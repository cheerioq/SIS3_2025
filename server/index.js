const express = require("express");      // standard to start api
const app = express();   
const cors = require("cors");          // standard to start api

app.use(express.json());  // middleware to parse JSON bodies
app.use(cors({
  origin: 'http://88.200.63.148:1212'
}));

const db = require("./models")   // standard to start api

app.get("/", (req, res) => {
  res.send("API is running");
});

Object.values(db).forEach(model => {
    if (model.associate) {
        model.associate(db);
    }
});

// Routers

const postsRouter = require("./routes/Posts");  // import posts router
app.use("/posts", postsRouter);  // use posts router for /posts endpoint
const commentsRouter = require("./routes/Comments");  
app.use("/comments", commentsRouter); 

db.sequelize.sync().then(() => {
  app.listen(2222, () => {
    console.log("Server is running on port 2222"); 

  });            
});  