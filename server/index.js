const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const db = require("./models");

app.get("/", (req, res) => {
  res.send("API is running");
});

// Associate models if needed
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

// Routers
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

// Sync database and start server
db.sequelize.sync().then(() => {
  console.log("DB synced");

  app.listen(2222, () => {
    console.log("Server running on port 2222");
  });
});
