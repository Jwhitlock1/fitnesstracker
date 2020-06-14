///////
// version 2.0
// fresh start 
///////

///////
// setting up required 
// based off of provided package.json
// and the built into node "path"
// for linking to our html;
// have added mongoose per requirements
// of assignment
//
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
//
///////

///////
// set up port to listen on
// issues due to setting it to PORT instead of MONGODB_URI, deeply facepalm
const PORT = process.env.PORT || 3030
//
///////

///////
// link to model
const db = require("./models");
//
///////

///////
// initializing the server
const app = express();
//
///////

///////
// initializing morgan to use for logging
app.use(logger("dev"));
//
///////

///////
// initializing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//
///////

///////
// allows access to public folder
app.use(express.static("public"));
//
///////


///////
// routes setup
///////

// Pretty sure I'm having an async issue, trying with .thens

///////
// connects either to mongodb or local db 
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false
});
//
///////

///////
// html routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});

// from api.js:: res = await fetch("/api/workouts");
app.get("/api/workouts", (req, res) => {
  db.Workouts.find()
    .then(data => {
      res.json(data);
    });
});

// from api.js:: await fetch("/api/workouts/" + id, "PUT"
app.put("/api/workouts/:id", (req, res) => {
  // update based on id passed, pass over added exercise
  // using our workouts model
  db.Workouts.update({ _id: req.params.id }, { $push: { exercises: req.body } })
    .then(data => {
      res.json(data);
    });
});

// from api.js:: fetch("/api/workouts", "POST" create workout
app.post("/api/workouts", (req, res) => {
  db.Workouts.create(req.body)
    .then(data => {
      res.json(data);
    });
});

// from api.js:: fetch(`/api/workouts/range`, get workouts in range
app.get("/api/workouts/:range", (req, res) => {
  db.Workouts.find()
    .then(data => {
      res.json(data);
    });
});


app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});