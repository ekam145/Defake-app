# 📰 **DeFake – Hybrid AI-Powered Fake News Detection System**

DeFake is an advanced fake-news detection platform combining:

✅ **Node.js backend** for routing, UI rendering, authentication
✅ **Flask AI backend** for hybrid text analysis
• Transformers (HuggingFace)
• Rule-based pattern checks
• Sentiment + linguistic heuristics
• Confidence scores + probability breakdown

This project provides **real-time prediction**, clean UI, confidence scoring, and a fallback mechanism when AI models are offline.

---

## 🚀 **Features**

### 🔍 Accurate Fake-News Detection

* Hybrid AI model combining:

  * Transformers sentiment + credibility estimation
  * Heuristics & linguistic analysis
  * Rule-based detection
  * External fact-check API support (optional)
* Returns:

  * **Prediction (Fake / Real)**
  * **Confidence %**
  * **Fake vs Real probability**
  * **Explanation breakdown**

### 🧠 Dual-Backend Architecture

* **Node.js (Express)**

  * Renders UI
  * Handles user auth
  * Acts as bridge between UI ↔ Flask
* **Flask (Python)**

  * Runs the hybrid AI model
  * Provides `/api/analyze` endpoint
  * Sends structured JSON to Node

### 🧾 Authentication System

* Register / Login
* Hashed password storage using bcrypt
* PostgreSQL database integration

### 🖥 Modern UI

* Clean analysis interface
* Real-time result rendering
* Probabilities and explanation shown visually
* "Clear Input" option

### ⚠️ Offline fallback

If Flask API is down, Node.js automatically uses a **local heuristic model**.

---

## 📂 **Project Structure**

```
DeFake/
│── defake/                 # Node.js backend
│   ├── views/              # EJS templates (UI)
│   ├── public/             # CSS, JS, images
│   ├── assets/             # UI assets
│   ├── index.js            # Main Express server
│   ├── package.json
│
│── flask_factcheck/        # Python AI backend
│   ├── app.py              # Flask server + AI model
│   ├── venv/               # Python virtual environment
│   ├── requirements.txt
│
│── README.md               # Project documentation
```

---

## 🛠 **Tech Stack**

### **Frontend**

* HTML, CSS, JavaScript
* EJS templates
* Service Worker (optional offline caching)

### **Backend**

#### Node.js (Primary backend)

* Express.js
* EJS
* PostgreSQL
* Axios (to call Flask API)

#### Python (AI backend)

* Flask
* TextBlob
* Transformers (HuggingFace)
* NLTK
* Regex-based credibility rules

---

## 🏗 **Installation & Setup**

### 📌 Clone the repository

```sh
git clone https://github.com/ekam145/Defake-app.git
cd Defake-app
```

---

# ⚙️ **Node.js Setup**

```sh
cd defake
npm install
```

Create `.env` file (optional, if you store DB creds):

```env
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=secrets
DB_HOST=localhost
DB_PORT=5432
```

Run the Node server:

```sh
npm start
```

Server runs at:

```
http://localhost:3000
```

---

# 🧬 **Flask (Python) Setup**

```sh
cd flask_factcheck
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

Run Flask:

```sh
python app.py
```

Flask runs at:

```
http://localhost:5000
```

---

# ▶️ **How to Run the Full System**

Start Flask first:

```sh
cd flask_factcheck
venv\Scripts\activate
python app.py
```

Then start Node:

```sh
cd defake
npm start
```

Finally open:

👉 **[http://localhost:3000](http://localhost:3000)**

---

# 📡 **API Routes**

### **Node.js → Flask Bridge**

```
POST /factcheck
{
  "text": "Your news headline..."
}
```

### Flask returns:

```json
{
  "prediction": "Real News",
  "confidence": 82,
  "fake_probability": 18,
  "real_probability": 82,
  "explanation": "Model confidence based on hybrid signals"
}
```

---

# 🖼 **Screenshots**

(Upload your UI images here)

```
![Homepage](screenshots/homepage.png)
![Analysis](screenshots/analysis.png)
```

---

# 🚀 **Deployment Guide**

### Node.js Deployment Options

* Render.com (free)
* Railway.app
* Vercel (serverless rewrite needed)
* AWS EC2 / Lightsail

### Python Flask Deployment

* Render.com (free)
* Railway
* AWS EC2
* PythonAnywhere

⚠️ **You must deploy Flask separately**, then update this Node route:

```js
const flaskUrl = "https://your-flask-host.com/api/analyze";
```

---

# 👨‍💻 Author

**Ekamjot Singh**
Developer | Cloud & Python Developer
GitHub: [ekam145](https://github.com/ekam145)


