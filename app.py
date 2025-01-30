from flask import Flask, jsonify, request
from flask_socketio import SocketIO
from flask_cors import CORS
import eventlet
import random
import time
import threading
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Supabase Configuration
SUPABASE_URL = "https://frzuszxndrfvqcffvzta.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyenVzenhuZHJmdnFjZmZ2enRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3MjQxODMsImV4cCI6MjA0NjMwMDE4M30.9VRG6CmrrctgzYBh5_plBq_2ehGXW8GyVUfQt0vTrJA"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Simulating real-time data
def generate_data():
    while True:
        fuel = round(random.uniform(20, 100), 2)  # Random fuel level
        engine_temp = round(random.uniform(50, 100), 2)  # Random engine temperature
        gps_speed = {
            "speed": round(random.uniform(0, 120), 2),  # Random speed
            "latitude": round(random.uniform(-90, 90), 6),
            "longitude": round(random.uniform(-180, 180), 6),
        }

        socketio.emit("update_data", {"fuel": fuel, "engine_temp": engine_temp, "gps_speed": gps_speed})
        time.sleep(2)  # Update every 2 seconds

# Run data generator in a separate thread
threading.Thread(target=generate_data, daemon=True).start()

@app.route("/submit", methods=["POST"])
def submit_form():
    data = request.json

    # Insert data into Supabase
    try:
        response = supabase.table("request_table").insert([data]).execute()
        return jsonify({"message": "Form submitted successfully!", "data": response.data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0", port=5000)
