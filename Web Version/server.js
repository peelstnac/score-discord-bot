const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Leaderboard = require("./leaderboardSchema.js");
const fs = require("fs");

const URI = process.env.URI;
const PORT = process.env.PORT;
const LEAD_ID = process.env.LEAD_ID;
const MOD = 10007;

function init() {
  /*
  var leaderboard = new Leaderboard({
    name: "leaderboard",
    val: [['Score! Dummy Bot', 1]]
  });
  leaderboard.save(err => {
    console.log("saved leaderboard");
    if (err) {
      console.log(err);
    }
  });
  */
  Leaderboard.findOneAndUpdate(
    { name: "leaderboard" },
    { val: [["Score! Dummy Bot", 1]] },
    { new: true },
    (err, ret) => {
      if (err) console.log(err);
      console.log(ret);
      console.log("leaderboard initialized.");
    }
  );
}

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", err => {
  console.log(err);
});
db.on("open", () => {
  console.log("connected to MongoDB");
  mongoose.set("useFindAndModify", false);
  //init();
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/leaderboard", async (req, res) => {
  var leaderboard = await Leaderboard.find({
    name: "leaderboard"
  });
  leaderboard = leaderboard[0].val;
  res.json(JSON.stringify(leaderboard));
});

var values = JSON.parse(fs.readFileSync("values.json"));
var primes = JSON.parse(fs.readFileSync("primes.json"));

app.get("/bet/:usr/:bet", async (req, res) => {
  try {
    if (req.params.usr.length == 0 || req.params.usr.length > 20)
      res.sendStatus(404);
    else if (!Number.isInteger(parseInt(req.params.bet))) res.sendStatus(404);
    else if (parseInt(req.params.bet) < 1 || parseInt(req.params.bet) > 10000)
      res.sendStatus(404);
    else {
      //await init();
      var leaderboard = await Leaderboard.find({
        name: "leaderboard"
      });
      leaderboard = leaderboard[0].val;
      console.log("leaderboard is loaded in.");
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
      leaderboard.push([req.params.usr, score]);
      function sortBySecond(a, b) {
        a[1] = parseInt(a[1]);
        b[1] = parseInt(b[1]);
        if (a[1] === b[1]) {
          return 0;
        } else {
          return a[1] > b[1] ? -1 : 1;
        }
      }
      leaderboard.sort(sortBySecond);
      if (leaderboard.length > 10) leaderboard = leaderboard.slice(0, 10);
      await Leaderboard.findOneAndUpdate(
        { name: "leaderboard" },
        { val: leaderboard },
        { new: true },
        (err, ret) => {
          console.log("updated leaderboard.");
          console.log(ret);
          if (err) {
            console.log(err);
          }
        }
      );
      res.json({ score: score });
      values.arr.push(M);
      fs.writeFileSync("values.json", JSON.stringify(values));
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(PORT, err => {
  console.log("listening to port " + PORT);
  if (err) {
    console.log(err);
  }
});
