const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Leaderboard = require("./leaderboardSchema.js");
const fs = require("fs");

const URI = process.env.URI;
const PORT = process.env.PORT;
const MOD = 10007;

function init() {
  var leaderboard = new Leaderboard({
    name: "leaderboard",
    val: []
  });
  leaderboard.save(err => {
    console.log("saved leaderboard");
    if (err) {
      console.log(err);
    }
  });
}

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", err => {
  console.log(err);
});
db.on("open", () => {
  console.log("connected to MongoDB");
  //init();
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

var values = JSON.parse(fs.readFileSync("values.json"));
var primes = JSON.parse(fs.readFileSync("primes.json"));

app.get("/bet/:bet", (req, res) => {
  if (!Number.isInteger(parseInt(req.params.bet))) res.sendStatus(404);
  else if (parseInt(req.params.bet) < 1 || parseInt(req.params.bet) > 10000)
    res.sendStatus(404);
  else {
    if (values.arr.length > 100) {
      values.arr = [parseInt(Math.random() * 10000)];
      fs.writeFileSync("values.json", JSON.stringify(values));
      console.log("Refreshed values.");
    }
    var m = parseInt(req.params.bet);
    var M = m;
    if (M == 1) m = 2;
    else if (M > 9973) m = 9973;
    else {
      var r = Math.random();
      if (r <= 0.5) {
        for (var i = m; i >= 2; i--) {
          if (primes.arr[i]) {
            m = i;
            break;
          }
        }
      } else {
        for (var i = m; i <= 9973; i++) {
          if (primes.arr[i]) {
            m = i;
            break;
          }
        }
      }
    }
    console.log("GAME: m is " + m + " and M is " + M);
    var inv = [1, 1];
    for (var i = 2; i < m; i++) {
      inv[i] = (m - ((parseInt(m / i) * inv[m % i]) % m)) % m;
    }
    var score = 1;
    for (var i = 0; i < values.arr.length; i++) {
      score *= inv[values.arr[i] % m];
      score %= MOD;
    }
    console.log("GAME: score is " + score);
    res.json({ score: score });
    values.arr.push(M);
    fs.writeFileSync("values.json", JSON.stringify(values));
  }
});

app.listen(PORT, err => {
  console.log("listening to port " + PORT);
  if (err) {
    console.log(err);
  }
});
