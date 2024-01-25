// server.js
const express = require("express");
const app = express();

const mongoose = require("mongoose");
var bodyParser = require("body-parser");

const cors = require("cors");

// Use cors middleware to handle CORS headers
app.use(cors());
app.use(bodyParser.json());
//Connecting to the DB
// MVbndm4E8Wczjjc3
mongoose
  .connect(
    "mongodb+srv://zaidkamboo100:MVbndm4E8Wczjjc3@taskmanagerapp.52avg7f.mongodb.net/"
  )
  .then(() => {
    console.log("Mongo db connected");
  })
  .catch((err) => console.log(err));

// USER ROUTES
app.use("/users", require("./routes/userRoutes.js"));
app.use("/tasks", require("./routes/taskRoutes.js"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, (req, res) => {
  console.log(`Backend listening on port:${PORT}`);
});
app.get("/", (req, res) => {});
