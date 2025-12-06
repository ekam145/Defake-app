import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import bcrypt from "bcrypt";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const saltRounds = 10;

// ================= DATABASE CONNECTION =================
const { Client } = pg;

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required by Render’s managed Postgres
  },
});


try {
  await db.connect();
  console.log("✅ PostgreSQL connected successfully!");
} catch (err) {
  console.error("❌ Database connection failed:", err.message);
  process.exit(1);
}

// ================= VIEW ENGINE & MIDDLEWARE ==============
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// ================= SAMPLE DATA =================
const fakeNewsSamples = [
  "India and Pakistan Declare Full-Scale War Following Pahalgam Bus Attack",
  "China Diverts Brahmaputra to Relieve Pakistans Water Crisis",
  "U.S. Dollar Collapses Overnight Amidst Trumps 100% Universal Import Tariff",
  "Aliens landed in Paris",
  "Cure for cancer found in potato",
  "Government bans breathing on weekends",
  "Chocolate causes immortality",
];

const realNewsSamples = [
  "hindu tourists attacked in kashmir, 26 fatalities",
  "Militants in Indian Kashmir Separate Men from Women and Children Before Opening Fire in Baisaran Valley",
  "Panic in Pakistan as India Vows to Cut Off Water Supply Over Kashmir",
  "Tariffs to Trigger Sharp US Economic Slowdown, Chance of Recession Jumps to 45%: Reuters Poll",
  "Global warming affects ocean levels",
  "New AI model improves healthcare diagnosis",
  "India launches new satellite successfully",
  "Electric vehicle adoption increases in 2025",
  "UN discusses global peace resolution",
];

// ================= ROUTES =================

// Home & Pages
app.get("/", (req, res) => res.render("index", { isAuthenticated: false }));
app.get("/about", (req, res) =>
  res.render("about", { title: "About DeFake", isAuthenticated: false })
);
app.get("/login", (req, res) =>
  res.render("login/home", { title: "Welcome", error: null })
);
app.get("/login/signin", (req, res) =>
  res.render("login/login", { title: "Login", error: null })
);
app.get("/login/register", (req, res) =>
  res.render("login/register", { title: "Register", error: null })
);

// ================= LOGIN =================
app.post("/login/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0)
      return res.render("login/login", { title: "Login", error: "Invalid credentials" });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.render("login/login", { title: "Login", error: "Invalid credentials" });

    res.render("login/success", {
      title: "Success",
      message: "Login successful!",
      user,
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.render("login/login", { title: "Login", error: "Database error" });
  }
});

// ================= REGISTER =================
app.post("/login/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0)
      return res.render("login/register", {
        title: "Register",
        error: "Email already exists.",
      });

    const hash = await bcrypt.hash(password, saltRounds);
    const result = await db.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
      [email, hash]
    );

    res.render("login/success", {
      title: "Success",
      message: "Registration successful!",
      user: result.rows[0],
    });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.render("login/register", {
      title: "Register",
      error: "Registration failed.",
    });
  }
});

// ================= FLASK FACTCHECK =================
// --- FLASK FACTCHECK (DEBUG VERSION) ---
app.post("/factcheck", async (req, res) => {
  const text = req.body.text || req.body.newsInput;
  console.log("📩 Incoming /factcheck request:", text?.slice(0, 100));

  if (!text) {
    console.error("❌ No text received in body");
    return res.status(400).json({ error: "No text provided." });
  }

  try {
    const FLASK_URL = process.env.FACTCHECK_API_URL || "http://localhost:5000/api/analyze";
    console.log("🔁 Sending request to Flask:", flaskUrl);

    const flaskResponse = await axios.post(FLASK_URL, { text });
    console.log("✅ Flask responded:", flaskResponse.data);

    return res.json(flaskResponse.data);
  } catch (err) {
    console.error("❌ Flask API error:", err.message);

    if (err.response) {
      console.error("📨 Flask error details:", err.response.status, err.response.data);
    } else if (err.request) {
      console.error("📡 No response received from Flask:", err.request);
    } else {
      console.error("💥 Request setup error:", err.message);
    }

    return res.status(500).json({
      error: "Flask connection failed",
      details: err.message,
    });
  }
});


// ================= SERVER START =================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Node server running on port ${PORT}`);
});

