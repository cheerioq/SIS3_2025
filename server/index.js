require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./models");

const app = express();

const allowedOrigins = new Set([
  "http://88.200.63.148:5174",
  "http://88.200.63.148:5173",
  "http://88.200.63.148:2222",
  "http://localhost:5174",
  "http://localhost:5173",
]);

app.use(express.json());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.has(origin)) return cb(null, true);
      return cb(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "accessToken"],
  })
);

app.get("/health", (_req, res) => res.send("API is running"));

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

const rankListRouter = require('./routes/RankList');
app.use('/ranklist', rankListRouter);

async function seedFacts() {
  const count = await db.CryptoFacts.count();
  if (count === 0) {
    await db.CryptoFacts.bulkCreate([
      { factText: "Ethereum transitioned to Proof-of-Stake in 2022." },
    ]);
    console.log("✅ Seeded CryptoFacts table");
  }
}

const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

app.get("/*", (req, res) => {
  res.sendFile(path.join(staticDir, "index.html"));
});

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

    // Sync Coins table without overwriting existing amounts
    const users = await db.Users.findAll();
    for (const user of users) {
      const [coin, created] = await db.Coins.findOrCreate({
        where: { userId: user.id },
        defaults: (() => {
          let total = 0;
          try {
            const coinsArray = JSON.parse(user.coinsOwned || '[]');
            if (coinsArray.length > 0 && typeof coinsArray[0] === 'object' && 'amount' in coinsArray[0]) {
              total = coinsArray.reduce((sum, c) => sum + (c.amount || 0), 0);
            } else {
              total = coinsArray.length;
            }
          } catch (err) {
            console.warn(`Warning: invalid coinsOwned JSON for user ${user.id}, defaulting to 0`);
          }
          return { amount: total };
        })(),
      });

      if (created) {
        console.log(`Created Coins row for user ${user.id} with amount ${coin.amount}`);
      }
    }
    console.log("BOOT: Coins synced for existing users");

    const PORT = process.env.PORT || 2222;
    const HOST = "0.0.0.0";
    app.listen(PORT, HOST, () => {
      console.log(`Server running on ${HOST}:${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
})();

process.on("unhandledRejection", (reason) => {
  console.error("UnhandledRejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("UncaughtException:", err);
});
