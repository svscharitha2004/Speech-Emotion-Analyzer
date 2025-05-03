from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from nltk.sentiment import SentimentIntensityAnalyzer

app = Flask(__name__)
CORS(app)  # Allow frontend to access backend

# Initialize Sentiment Analyzer
sia = SentimentIntensityAnalyzer()

# Serve frontend
@app.route("/")
def index():
    return render_template("index.html")

# API Endpoint for Emotion Analysis
@app.route("/analyze", methods=["POST"])
def analyze_emotion():
    data = request.json
    text = data.get("text", "")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Get sentiment scores
    sentiment = sia.polarity_scores(text)
    
    # Determine emotion based on scores
    if sentiment["compound"] >= 0.5:
        emotion = "Happy"
    elif sentiment["compound"] <= -0.5:
        emotion = "Sad"
    elif sentiment["compound"] > 0:
        emotion = "Neutral"
    else:
        emotion = "Angry"

    return jsonify({"emotion": emotion})

if __name__ == "__main__":
    app.run(debug=True)
