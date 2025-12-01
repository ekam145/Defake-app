# 🚨 DeFake – AI-Powered Fake News Detector

### Identify misinformation instantly using NLP, sentiment analysis, and machine-learning.

DeFake is a full-stack Fake News Detection system built with:

* **Node.js (Frontend + Main Backend)**
* **Flask (Python ML Microservice)**
* **NLP Sentiment + Probability-Based Fake/Real Detection**
* **Modern UI (clean, minimal, intuitive)**

Users can paste news text or URLs, and the system returns:
✔ Fake vs Real prediction
✔ Confidence score
✔ Fake/Real probability breakdown
✔ Explanation (emotion, polarity, tone indicators)

---

## 🌐 Live Demo (Optional)

*(Add your Render/GitHub Pages/Netlify link here when deployed)*
👉 `https://your-app-link.com`

---

# 📸 Screenshots

### 🏠 Home – News Checker Interface

Paste article text → click *Check* → get AI verification.

![Home][(https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/screenshots/home.png](https://github.com/ekam145/Defake-app/blob/main/Screenshot%202025-12-02%20002103.png))

---

### 📊 Detection Result – Confidence Score Breakdown

Real-time score + Fake/Real probabilities.

![Result][(https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/screenshots/result.png](https://github.com/ekam145/Defake-app/blob/main/Screenshot%202025-12-02%20002103.png))

---

### ℹ️ About Page – App Story & Purpose

![About]([https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/screenshots/about.png](https://github.com/ekam145/Defake-app/blob/main/Screenshot%202025-12-02%20002120.png))

---

### 🔐 Login & Register – Auth UI

![Auth]([https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/screenshots/auth.png](https://github.com/ekam145/Defake-app/blob/main/Screenshot%202025-12-02%20003231.png))

---

# 🚀 Features

### 🔍 Fake News Detection

* Sentiment polarity + subjectivity
* Emotion spike detection
* Probability-based Fake/Real classification
* Transformer/NLP-based analysis (backend)

### ⚡ Full-stack Architecture

* Node.js → User interface + routing
* Flask → Text analysis ML API
* Clean EJS templates
* Modern CSS UI
* Clear code structure

### 💾 User Accounts (Optional)

* Login / Register
* Secure handling
* Extendable for saving search history

### 📱 Responsive UI

* Works on mobile + desktop
* Smooth transitions
* Clear breakdown of results

---

# 🧠 Tech Stack

| Layer      | Technology                 |
| ---------- | -------------------------- |
| Frontend   | HTML, CSS, EJS, JavaScript |
| Backend    | Node.js + Express          |
| ML Engine  | Python + Flask             |
| NLP        | TextBlob + Transformers    |
| Deployment | Render / GitHub / Netlify  |

---

# 📁 Project Structure

```
defake/
│── Homepage/          # UI + Node.js backend
│── flask_factcheck/   # Python ML microservice
│── public/            # static assets
│── views/             # EJS templates
│── package.json
│── app.py (Flask)
│── index.js (Node)
```

---

# 🛠 Installation

## 1️⃣ Clone the Repository

```
git clone https://github.com/ekam145/defake-app.git
cd defake-app
```

---

# 🟦 Node.js (Frontend + Backend)

### Install dependencies:

```
cd Homepage
npm install
```

### Start server:

```
npm start
```

---

# 🐍 Python ML Backend (Flask)

### Create venv:

```
cd flask_factcheck
python -m venv venv
venv\Scripts\activate
```

### Install requirements:

```
pip install -r requirements.txt
```

### Start Flask:

```
python app.py
```

---

# 🔗 Connecting Node ↔ Flask

Node will call Flask automatically at:

```
http://127.0.0.1:5000/factcheck
```

Nothing extra needed.

---

# 📤 Deployment Guide

### Node.js → Render

* Select *Homepage* folder
* Build command: `npm install`
* Start: `node index.js`

### Flask → Render (separate service)

* Add Python build
* Start command: `gunicorn app:app`

---

# ⭐ Future Enhancements

* Add image-based fake-news detection
* Save user search history
* Browser extension
* Multilingual detection
* Advanced transformer models

---

# 👨‍💻 Author

**Ekamjot Singh**
Cloud + Python + Backend Developer




