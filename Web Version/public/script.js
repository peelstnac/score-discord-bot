$(document).ready(async () => {
    var leaderboard;
    await $.get("/leaderboard", (data, status) => {
      console.log("GET leaderboard: " + status);
      leaderboard = JSON.parse(data);
    });
    console.log(leaderboard);
    leaderboard.forEach((user, i) => {
      i = i + 1;
      $("#leaderboard").append("<tr>");
      $("#leaderboard").append('<th scope="row">' + i + "</th>");
      $("#leaderboard").append("<td>" + user[0] + "</td>");
      $("#leaderboard").append("<td>" + user[1] + "</td>");
      $("#leaderboard").append("</tr>");
    });
  
    if (localStorage.getItem("local-score") == null) {
      localStorage.setItem("local-score", 0);
    }
    if (localStorage.getItem("previous-score") == null) {
      localStorage.setItem("previous-score", 0);
    }
    $("#local-score").html(localStorage.getItem("local-score"));
    $("#previous-score").html(localStorage.getItem("previous-score"));
  });
  
  $("#submit-bet").click(() => {
    var username = $("#username").val();
    var bet = parseInt($("#bet-value").val());
    if (username.length == 0 || !Number.isInteger(bet)) {
      alert("Must enter a valid username and bet.");
    } else {
      $.get("/bet/" + username + "/" + bet, (data, status) => {
        console.log("GET score: " + status);
        if (status == "success") {
          var score = data.score;
          localStorage.setItem("previous-score", score);
          var highest_score = localStorage.getItem("local-score");
          if (score > highest_score) localStorage.setItem("local-score", score);
        }
      });
    }
  });
  