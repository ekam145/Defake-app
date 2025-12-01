from flask import Flask, request, jsonify
from transformers import pipeline
from textblob import TextBlob
from dotenv import load_dotenv
import os
import requests
import math

# ===================================
#  FLASK + ENV SETUP
# ===================================
app = Flask(__name__)

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

def verify_api_keys():
    print("\n================= 🔐 API Key Check =================")
    print("✅ GOOGLE_API_KEY loaded." if GOOGLE_API_KEY else "⚠️ GOOGLE_API_KEY missing.")
    print("✅ NEWS_API_KEY loaded." if NEWS_API_KEY else "⚠️ NEWS_API_KEY missing.")
    print("====================================================\n")

verify_api_keys()

# ===================================
#  MODEL SETUP
# ===================================
try:
    print("🧠 Loading transformer model...")
    classifier = pipeline("text-classification", model="mrm8488/bert-tiny-finetuned-fake-news")
    print("✅ Model loaded successfully.")
except Exception as e:
    print("⚠️ Model load failed:", e)
    classifier = None


# ===================================
#  IMPROVED ANALYSIS FUNCTION
# ===================================
def enhanced_news_analysis(text):
    """Dynamic hybrid analysis with controlled probabilities and realistic confidence."""
    result = {
        "is_fake": False,
        "confidence": 0.5,
        "details": [],
        "fake_prob": 0.5,
        "real_prob": 0.5
    }

    text_lower = text.lower()

    # --- (1) Model Weights ---
    transformer_weight = 0.55
    linguistic_weight = 0.25
    external_weight = 0.20

    model_fake_score = 0.5
    model_real_score = 0.5

    # --- (2) Transformer ---
    if classifier:
        try:
            prediction = classifier(text[:512])[0]
            label = prediction['label'].lower()
            score = prediction['score']

            if "fake" in label:
                model_fake_score = min(score, 0.95)
                model_real_score = 1 - model_fake_score
            else:
                model_real_score = min(score, 0.95)
                model_fake_score = 1 - model_real_score

            result["details"].append(f"🤖 Transformer classified as '{label}' ({score:.2f})")
        except Exception as e:
            result["details"].append(f"⚠️ Model error: {e}")

    # --- (3) Sentiment Analysis ---
    sentiment = TextBlob(text).sentiment
    polarity = sentiment.polarity
    subjectivity = sentiment.subjectivity
    result["details"].append(f"🧠 Sentiment polarity={polarity:.2f}, subjectivity={subjectivity:.2f}")

    tone_fake = 0
    tone_real = 0

    if subjectivity > 0.7 and abs(polarity) > 0.5:
        tone_fake = 0.7
        result["details"].append("⚠️ Highly emotional or biased tone.")
    elif subjectivity < 0.4 and abs(polarity) < 0.3:
        tone_real = 0.7
        result["details"].append("✅ Objective or neutral tone detected.")

    # --- (4) Linguistic Keywords ---
    sensational = ["shocking", "unbelievable", "miracle", "banned", "cure", "alien",
                   "secret", "exposed", "flat earth", "proof", "viral", "you won't believe"]
    credible = ["report", "data", "study", "research", "university", "official", "analysis"]

    sensational_hits = sum(1 for w in sensational if w in text_lower)
    credible_hits = sum(1 for w in credible if w in text_lower)

    if sensational_hits:
        tone_fake = max(tone_fake, 0.8)
        result["details"].append(f"🚨 Sensational words detected ({sensational_hits}).")

    if credible_hits:
        tone_real = max(tone_real, 0.8)
        result["details"].append(f"✅ Credible terms found ({credible_hits}).")

    # --- (5) External Verification ---
    ext_fake, ext_real = 0, 0
    if GOOGLE_API_KEY and GOOGLE_API_KEY.startswith("AIza"):
        try:
            fact_url = f"https://factchecktools.googleapis.com/v1alpha1/claims:search?query={text[:80]}&key={GOOGLE_API_KEY}"
            resp = requests.get(fact_url, timeout=6)
            data = resp.json()
            if "claims" in data:
                rating = data["claims"][0]["claimReview"][0]["textualRating"].lower()
                if "false" in rating:
                    ext_fake = 0.9
                    result["details"].append(f"📡 FactCheck: Marked False ({rating})")
                elif "true" in rating:
                    ext_real = 0.9
                    result["details"].append(f"📡 FactCheck: Marked True ({rating})")
        except Exception:
            result["details"].append("⚠️ FactCheck API unavailable.")

    # --- (6) Weighted Probabilities ---
    raw_fake = (
        model_fake_score * transformer_weight
        + tone_fake * linguistic_weight
        + ext_fake * external_weight
    )
    raw_real = (
        model_real_score * transformer_weight
        + tone_real * linguistic_weight
        + ext_real * external_weight
    )

    # --- (7) Softmax Normalization ---
    exp_fake = math.exp(raw_fake)
    exp_real = math.exp(raw_real)
    total = exp_fake + exp_real
    fake_prob = exp_fake / total
    real_prob = exp_real / total

    result["fake_prob"] = round(fake_prob * 100, 2)
    result["real_prob"] = round(real_prob * 100, 2)

    # --- (8) Decision ---
    result["is_fake"] = fake_prob > real_prob

    # --- (9) Smarter Confidence Curve ---
    diff = abs(fake_prob - real_prob)
    # make confidence vary from 55–95 realistically
    confidence = 0.55 + (diff * 0.8)
    # Add slight boost for clearly real or fake cases
    if real_prob > 0.85:
        confidence += 0.05
    elif fake_prob > 0.85:
        confidence += 0.05

    result["confidence"] = round(min(confidence, 0.96), 2)

    return result


# ===================================
#  API ROUTE
# ===================================
@app.route("/api/analyze", methods=["POST"])
def analyze_news():
    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "Please provide text"}), 400

    analysis = enhanced_news_analysis(text)

    return jsonify({
        "prediction": "Fake News" if analysis["is_fake"] else "Real News",
        "confidence": round(analysis["confidence"] * 100, 2),
        "fake_probability": analysis["fake_prob"],
        "real_probability": analysis["real_prob"],
        "details": analysis["details"]
    })


# ===================================
#  RUN FLASK
# ===================================
if __name__ == "__main__":
    from flask_cors import CORS
    CORS(app)
    app.run(host="0.0.0.0", port=5000)

