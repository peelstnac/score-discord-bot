$(document).ready(async () => {
    var leaderboard;
    await $.get("/leaderboard", (data, status) => {
      console.log("GET leaderboard: " + status);
      leaderboard = data;
    });
    console.log(leaderboard);
  });
  $("#submit-bet").click(() => {
    var username = $("#username").val();
    var bet = parseInt($("#bet-value").val());
    if (username.length == 0 || !Number.isInteger(bet)) {
      alert("Must enter a valid username and bet.");
    } else {
    }
  });
  