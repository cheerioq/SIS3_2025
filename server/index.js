const express = require("express");      // standard to start api
const app = express();   
app.use(express.json());  // middleware to parse JSON bodies

const db = require("./models")   // standard to start api

app.get("/", (req, res) => {
  res.send("API is running");
});


// Routers

const postsRouter = require("./routes/Posts");  // import posts router
app.use("/posts", postsRouter);  // use posts router for /posts endpoint

db.sequelize.sync().then(() => {      // sync database, force: true will drop the table if it exists
app.listen(1212, () => {
    console.log("Server is running on port 1212"); 
  });            
});  