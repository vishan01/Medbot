from flask import Flask, request, redirect, session, jsonify
from google.oauth2 import credentials
from googleapiclient.discovery import build
import os
import secrets
from dotenv import load_dotenv
import asyncio
load_dotenv()

# Load credentials from creds.json
try:
    import json
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

# Initialize Google OAuth2 client
oAuth2Client = credentials.Credentials(None,
    client_id=client_id,
    client_secret=client_secret,
    token_uri='https://oauth2.googleapis.com/token',
    scopes=[
        "https://www.googleapis.com/auth/fitness.activity.read",
        "https://www.googleapis.com/auth/fitness.blood_glucose.read",
        "https://www.googleapis.com/auth/fitness.blood_pressure.read",
        "https://www.googleapis.com/auth/fitness.heart_rate.read",
        "https://www.googleapis.com/auth/fitness.body.read",
        "https://www.googleapis.com/auth/fitness.sleep.read",
        "https://www.googleapis.com/auth/fitness.reproductive_health.read",
        "https://www.googleapis.com/auth/userinfo.profile",
    ]
)

# Flask app setup
app = Flask(__name__)
app.secret_key = secrets.token_hex(32) # Generate a strong secret key

userProfileData = None

async def getUserProfile(auth_creds):
    service = build('people', 'v1', credentials=auth_creds)
    profile = service.people().get(resourceName='people/me', personFields='names,photos,emailAddresses').execute()
    display_name = profile.get('names', [])[0].get('displayName')
    url = profile.get('photos', [])[0].get('url')
    user_id_str = profile.get('resourceName', '').replace('people/', '')
    user_id = int(user_id_str) if user_id_str.isdigit() else None
    return {
        'displayName': display_name,
        'profilePhotoUrl': url,
        'userID': user_id,
    }

@app.route("/auth/google")
def auth_google():
    print("hittttt!!!!")
    auth_url, _ = oAuth2Client.authorization_url(redirect_uris[0], access_type='offline')
    return jsonify({'authUrl': auth_url})
    # return redirect(auth_url)

@app.route("/auth/google/callback")
async def auth_google_callback():
    code = request.args.get('code')
    if code:
        try:
            token_response = oAuth2Client.exchange_code(code)
            oAuth2Client.token = token_response
            session['tokens'] = token_response

            profile = await getUserProfile(oAuth2Client)
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
async def fetch_data():
    if 'tokens' not in session or not session['tokens']:
        return redirect("/auth/google")  # Redirect to authentication if no tokens

    oAuth2Client.token = session['tokens']

    try:
        fitness = build('fitness', 'v1', credentials=oAuth2Client)

        if userProfileData:
            user_name = userProfileData.get('displayName')
            profile_photo = userProfileData.get('profilePhotoUrl')
            user_id = userProfileData.get('userID')
        else:
            # Fallback if user profile data is not in session (shouldn't happen often)
            profile = await getUserProfile(oAuth2Client)
            user_name = profile.get('displayName')
            profile_photo = profile.get('profilePhotoUrl')
            user_id = profile.get('userID')
            session['userProfile'] = profile
            userProfileData = profile

        seven_days_in_millis = 14 * 24 * 60 * 60 * 1000
        start_time_millis = int((Date.now() - seven_days_in_millis) * 1000000) # Convert to nanoseconds
        end_time_millis = int((Date.now() + 24 * 60 * 60 * 1000) * 1000000)   # Convert to nanoseconds

        aggregate_response = await fitness.users().dataset().aggregate(userId='me', body={
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
            'bucketByTime': {'durationMillis': 86400000}, # Aggregate daily
            'startTimeMillis': str(start_time_millis // 1000000), # Convert back to milliseconds for API
            'endTimeMillis': str(end_time_millis // 1000000),   # Convert back to milliseconds for API
        }).execute()

        fitness_data = aggregate_response.get('bucket', [])
        formatted_data = []

        for data in fitness_data:
            start_time = int(data.get('startTimeMillis', '0')) // 1000000
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
                        formatted_entry['sleep_hours'] = value[0].get('intVal', 0) # Assuming intVal represents sleep duration
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
    from datetime import datetime
    Date = datetime
    app.run(port=8000, debug=True)