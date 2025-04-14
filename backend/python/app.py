from flask import Flask, request, redirect, session, jsonify
from google.oauth2 import id_token, credentials
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import os
import secrets
from dotenv import load_dotenv
import time
import asyncio
from flask_cors import CORS
from datetime import datetime
import requests
import json
load_dotenv()

# Load credentials from creds.json
try:
    with open('./creds.json', 'r') as f:
        creds_data = json.load(f)
    client_secret = creds_data['web']['client_secret']
    client_id = creds_data['web']['client_id']
    redirect_uris = creds_data['web']['redirect_uris']
except FileNotFoundError:
    print("Error: creds.json not found. Make sure it's in the same directory.")
    exit()
except json.JSONDecodeError:
    print("Error: Invalid JSON format in creds.json.")
    exit()
except KeyError as e:
    print(f"Error: Missing key in creds.json: {e}")
    exit()

# Flask app setup
app = Flask(__name__)
app.secret_key = secrets.token_hex(32)  # Generate a strong secret key
CORS(app, origins="http://localhost:5173")
userProfileData = None

# Google OAuth flow setup
SCOPES = [
    "https://www.googleapis.com/auth/fitness.activity.read",
    "https://www.googleapis.com/auth/fitness.blood_glucose.read",
    "https://www.googleapis.com/auth/fitness.blood_pressure.read",
    "https://www.googleapis.com/auth/fitness.heart_rate.read",
    "https://www.googleapis.com/auth/fitness.body.read",
    "https://www.googleapis.com/auth/fitness.sleep.read", 
    "https://www.googleapis.com/auth/fitness.reproductive_health.read",
    "https://www.googleapis.com/auth/userinfo.profile",
]

def create_oauth_flow():
    from google_auth_oauthlib.flow import Flow
    # Create flow instance to manage the OAuth 2.0 Authorization Grant Flow
    flow = Flow.from_client_config(
        client_config=creds_data,
        scopes=SCOPES,
        redirect_uri=redirect_uris[0]
    )
    return flow

def get_user_profile(credentials):
    service = build('people', 'v1', credentials=credentials)
    profile = service.people().get(resourceName='people/me', personFields='names,photos,emailAddresses').execute()
    display_name = profile.get('names', [])[0].get('displayName') if profile.get('names') else None
    url = profile.get('photos', [])[0].get('url') if profile.get('photos') else None
    user_id_str = profile.get('resourceName', '').replace('people/', '')
    user_id = int(user_id_str) if user_id_str.isdigit() else None
    return {
        'displayName': display_name,
        'profilePhotoUrl': url,
        'userID': user_id,
    }

@app.route("/auth/google")
def auth_google():
    print("Initiating Google OAuth flow!")
    flow = create_oauth_flow()
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'
    )
    session['state'] = state
    return jsonify({'authUrl': authorization_url})

@app.route("/auth/google/callback")
def auth_google_callback():
    code = request.args.get('code')
    if code:
        try:
            flow = create_oauth_flow()
            flow.fetch_token(code=code)
            credentials = flow.credentials
            
            # Store credentials
            session['tokens'] = {
                'token': credentials.token,
                'refresh_token': credentials.refresh_token,
                'token_uri': credentials.token_uri,
                'client_id': credentials.client_id,
                'client_secret': credentials.client_secret,
                'scopes': credentials.scopes
            }
            
            # Get user profile
            profile = get_user_profile(credentials)
            session['userProfile'] = profile
            global userProfileData
            userProfileData = profile
            return redirect("/fetch-data")
        except Exception as error:
            print(f"Error retrieving access token: {error}")
            return redirect("/error")
    else:
        return "Authorization code not found", 400

@app.route("/fetch-data")
def fetch_data():
    if 'tokens' not in session or not session['tokens']:
        return redirect("/auth/google")  # Redirect to authentication if no tokens

    # Recreate credentials from session
    token_data = session['tokens']
    credentials = Credentials(
        token=token_data['token'],
        refresh_token=token_data['refresh_token'],
        token_uri=token_data['token_uri'],
        client_id=token_data['client_id'],
        client_secret=token_data['client_secret'],
        scopes=token_data['scopes']
    )

    try:
        fitness = build('fitness', 'v1', credentials=credentials)
        global userProfileData
        if userProfileData:
            user_name = userProfileData.get('displayName')
            profile_photo = userProfileData.get('profilePhotoUrl')
            user_id = userProfileData.get('userID')
        else:
            # Fallback if user profile data is not in session
            profile = get_user_profile(credentials)
            user_name = profile.get('displayName')
            profile_photo = profile.get('profilePhotoUrl')
            user_id = profile.get('userID')
            session['userProfile'] = profile
            userProfileData = profile

        # Calculate time window (14 days)
        current_time_millis = int(time.time() * 1000)  # Current time in milliseconds
        seven_days_in_millis = 14 * 24 * 60 * 60 * 1000
        start_time_millis = current_time_millis - seven_days_in_millis
        end_time_millis = current_time_millis + 24 * 60 * 60 * 1000  # Add a day for good measure

        aggregate_response = fitness.users().dataset().aggregate(userId='me', body={
            'aggregateBy': [
                {'dataTypeName': 'com.google.step_count.delta'},
                {'dataTypeName': 'com.google.blood_glucose'},
                {'dataTypeName': 'com.google.blood_pressure'},
                {'dataTypeName': 'com.google.heart_rate.bpm'},
                {'dataTypeName': 'com.google.weight'},
                {'dataTypeName': 'com.google.height'},
                {'dataTypeName': 'com.google.sleep.segment'},
                {'dataTypeName': 'com.google.body.fat.percentage'},
                {'dataTypeName': 'com.google.menstruation'},
            ],
            'bucketByTime': {'durationMillis': 86400000},  # Aggregate daily
            'startTimeMillis': start_time_millis,
            'endTimeMillis': end_time_millis,
        }).execute()

        fitness_data = aggregate_response.get('bucket', [])
        formatted_data = []

        for data in fitness_data:
            start_time = int(data.get('startTimeMillis', '0'))
            date = datetime.fromtimestamp(start_time / 1000).strftime('%a, %d %b %Y')
            formatted_entry = {
                'date': date,
                'step_count': 0,
                'glucose_level': 0,
                'blood_pressure': [],
                'heart_rate': 0,
                'weight': 0,
                'height_in_cms': 0,
                'sleep_hours': 0,
                'body_fat_in_percent': 0,
                'menstrual_cycle_start': '',
            }
            for dataset in data.get('dataset', []):
                data_source_id = dataset.get('dataSourceId')
                points = dataset.get('point', [])
                if points:
                    value = points[0].get('value', [])
                    if data_source_id == 'derived:com.google.step_count.delta:com.google.android.gms:aggregated' and value:
                        formatted_entry['step_count'] = value[0].get('intVal', 0)
                    elif data_source_id == 'derived:com.google.blood_glucose.summary:com.google.android.gms:aggregated' and value:
                        glucose_level = 0
                        for v in value:
                            if 'fpVal' in v:
                                glucose_level = v['fpVal'] * 10
                                break
                        formatted_entry['glucose_level'] = glucose_level
                    elif data_source_id == 'derived:com.google.blood_pressure.summary:com.google.android.gms:aggregated' and value:
                        blood_pressure = [0, 0]
                        for v in value:
                            if 'fpVal' in v:
                                if v['fpVal'] > 100:
                                    blood_pressure[0] = v['fpVal']
                                elif v['fpVal'] < 100:
                                    blood_pressure[1] = v['fpVal']
                        formatted_entry['blood_pressure'] = blood_pressure
                    elif data_source_id == 'derived:com.google.heart_rate.summary:com.google.android.gms:aggregated' and value:
                        heart_rate = 0
                        for v in value:
                            if 'fpVal' in v:
                                heart_rate = v['fpVal']
                                break
                        formatted_entry['heart_rate'] = heart_rate
                    elif data_source_id == 'derived:com.google.weight.summary:com.google.android.gms:aggregated' and value:
                        formatted_entry['weight'] = value[0].get('fpVal', 0)
                    elif data_source_id == 'derived:com.google.height.summary:com.google.android.gms:aggregated' and value:
                        formatted_entry['height_in_cms'] = value[0].get('fpVal', 0) * 100
                    elif data_source_id == 'derived:com.google.sleep.segment:com.google.android.gms:merged' and value:
                        formatted_entry['sleep_hours'] = value[0].get('intVal', 0)  # Assuming intVal represents sleep duration
                    elif data_source_id == 'derived:com.google.body.fat.percentage.summary:com.google.android.gms:aggregated' and value:
                        formatted_entry['body_fat_in_percent'] = value[0].get('fpVal', 0)
                    elif data_source_id == 'derived:com.google.menstruation:com.google.android.gms:aggregated' and value:
                        formatted_entry['menstrual_cycle_start'] = str(value[0].get('intVal', ''))

            formatted_data.append(formatted_entry)

        print("Fitness data fetched successfully!")
        return jsonify({
            'userName': user_name,
            'profilePhoto': profile_photo,
            'userId': user_id,
            'formattedData': formatted_data,
        })

    except Exception as error:
        print(f"Error fetching fitness data: {error}")
        return redirect("/error")

@app.route("/error")
def error():
    return "An error occurred during authentication or data fetching."

if __name__ == "__main__":
    app.run(port=8000, debug=True)