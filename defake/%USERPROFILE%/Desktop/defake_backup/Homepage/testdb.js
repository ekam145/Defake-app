import pkg from "pg";
const { Client } = pkg;

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "1234",  // same one you use in pgAdmin
  port: 5432,
});

client.connect()
  .then(() => {
    console.log("✅ Connected successfully!");
    return client.end();
  })
  .catch(err => {
    console.error("❌ Connection failed:", err);
  });
