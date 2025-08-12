require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./models");

const app = express();

/* ---------- CORS (safe + flexible) ---------- */
const allowedOrigins = new Set([
  "http://88.200.63.148:5174",
  "http://88.200.63.148:5173",
  "http://88.200.63.148:2222", // frontend served by Express
  "http://localhost:5174",
  "http://localhost:5173",
]);

app.use(express.json());
app.use(
  cors({
    origin: (origin, cb) => {
      // allow curl/postman (no Origin) and known dev/prod origins
      if (!origin || allowedOrigins.has(origin)) return cb(null, true);
      // not allowed? don’t error — just don’t set CORS headers
      return cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "accessToken"],
  })
);

/* ---------- Health check ---------- */
app.get("/health", (_req, res) => res.send("API is running"));

/* ---------- API routes ---------- */
const postsRouter = require("./routes/Posts");
app.use("/posts", postsRouter);

const commentsRouter = require("./routes/Comments");
app.use("/comments", commentsRouter);

const usersRouter = require("./routes/Users");
app.use("/auth", usersRouter);

const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

const reportRouter = require("./routes/Report");
app.use("/report", reportRouter);

const cryptoFactsRouter = require("./routes/CryptoFacts");
app.use("/facts", cryptoFactsRouter);

/* ---------- Seed facts ---------- */
async function seedFacts() {
  const count = await db.CryptoFacts.count();
  if (count === 0) {
    await db.CryptoFacts.bulkCreate([
      { factText: "Ethereum transitioned to Proof-of-Stake in 2022." },
      // add the rest of your facts (ensure file is UTF-8 to avoid weird characters)
    ]);
    console.log("? Seeded CryptoFacts table");
  }
}

/* ---------- Static frontend (no-sudo deploy) ---------- */
/* Build your React app and copy dist/* into server/public/ */
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// SPA fallback: send index.html for anything not matched above
// Use "/*" or a regex — Express 5 doesn't accept "*"
app.get("/*", (req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

/* ---------- Boot ---------- */
(async () => {
  try {
    console.log(`BOOT: NODE_ENV=${process.env.NODE_ENV || "development"}`);

    console.log("BOOT: sequelize.authenticate()");
    await db.sequelize.authenticate();
    console.log("BOOT: authenticate OK");

    console.log("BOOT: sequelize.sync({ alter: true })");
    await db.sequelize.sync({ alter: true });
    console.log("BOOT: sync OK");

    console.log("BOOT: seed facts if empty");
    await seedFacts();
    console.log("BOOT: seed OK");

    const PORT = process.env.PORT || 2222;
    const HOST = "0.0.0.0"; // public (no sudo)
    app.listen(PORT, HOST, () => {
      console.log(`Server running on ${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
})();

/* ---------- Extra safety logs ---------- */
process.on("unhandledRejection", (reason) => {
  console.error("UnhandledRejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("UncaughtException:", err);
});
