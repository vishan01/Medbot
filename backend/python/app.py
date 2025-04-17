from flask import Flask, request, jsonify
from twilio.rest import Client
import os
from dotenv import load_dotenv
from datetime import datetime
from dateutil.parser import parse
from flask_cors import CORS
import google.generativeai as genai
from bot import SYSTEM_INSTRUCTION

load_dotenv()
app = Flask(__name__)
CORS(app)

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set.")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

account_sid = os.environ.get("TWILIO_ACCOUNT_SID")
auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
msg_sid=os.environ.get("TWILIO_MSG_ID")
twilio_phone_number = os.environ.get("TWILIO_PHONE_NUMBER")

if not account_sid:
    print("TWILIO_ACCOUNT_SID is not set.  Please check your .env file!")
if not auth_token:
    print("TWILIO_AUTH_TOKEN is not set.  Please check your .env file!")
if not twilio_phone_number:
    print("TWILIO_PHONE_NUMBER is not set.  Please check your .env file!")
    twilio_phone_number = "+15555555555"

client = Client(account_sid, auth_token)

@app.route('/send_sms', methods=['POST'])
def send_sms():
    try:
        phone_number = request.form.get('phone_number')
        message_body = request.form.get('message')
        send_at_str = request.form.get('send_at')  # Get the scheduled time string

        if not phone_number or not message_body or not send_at_str:
            json_data = request.get_json()
            if json_data:
                phone_number = json_data.get('phone_number')
                message_body = json_data.get('message')
                send_at_str = json_data.get('send_at')

        if not phone_number:
            return jsonify({'status': 'error', 'message': 'Phone number is required'}), 400
        if not message_body:
            return jsonify({'status': 'error', 'message': 'Message body is required'}), 400
        if not send_at_str:
            return jsonify({'status': 'error', 'message': 'Scheduled time (send_at) is required'}), 400

        # Parse the time string into a datetime object.  Handles many formats.
        try:
            send_at = parse(send_at_str)
        except ValueError:
            return jsonify({'status': 'error', 'message': 'Invalid date/time format.  Please use a valid format like YYYY-MM-DD HH:MM:SS or ISO 8601.'}), 400

        # Ensure send_at is in the future
        if send_at <= datetime.now():
            return jsonify({'status': 'error', 'message': 'Scheduled time must be in the future'}), 400
        message = client.messages.create(
            to=phone_number,
            from_=msg_sid,
            body=message_body,
            schedule_type='fixed',  # Important:  set the schedule type.
            send_at=send_at
        )

        print(f"Message scheduled to send at {send_at} to {phone_number} with SID: {message.sid}")
        return jsonify({'status': 'success', 'message_sid': message.sid, 'scheduled_time': send_at.isoformat()}), 200

    except Exception as e:
        error_message = str(e)
        print(f"Error sending SMS: {error_message}")
        return jsonify({'status': 'error', 'message': error_message}), 500

@app.route('/medbot', methods=['POST'])
def medbot():
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({"error": "Missing 'query' in request body."}), 400

    user_query = data['query']
    prompt_with_context = f"{SYSTEM_INSTRUCTION}\n\nUser Query: {user_query}"

    try:
        response = model.generate_content(prompt_with_context)
        return jsonify({"response": response.text})
    except Exception as e:
        return jsonify({"error": f"Error generating response: {str(e)}"}), 500

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
