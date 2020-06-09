const mongoose = require("mongoose");
const Leaderboard = require("./leaderboardSchema.js");
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
init();