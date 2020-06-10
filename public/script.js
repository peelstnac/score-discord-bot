async function refresh() {
    if (localStorage.getItem("local-score") == null) {
      localStorage.setItem("local-score", 0);
    }
    if (localStorage.getItem("previous-score") == null) {
      localStorage.setItem("previous-score", 0);
    }
    $("#local-score").html(localStorage.getItem("local-score"));
    $("#previous-score").html(localStorage.getItem("previous-score"));
    if (localStorage.getItem("state") == null) localStorage.setItem("state", 0);
    var state = localStorage.getItem("state");
    if (state == 0) {
      $("#score-emote").attr(
        "src",
        "https://balermo.com/wp-content/uploads/2020/05/Pepega-meme.png"
      );
    } else {
      $("#score-emote").attr(
        "src",
        "https://m.media-amazon.com/images/I/81vULjvv6mL._SS500_.jpg"
      );
    }
    $("#leaderboard").empty();
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
  }
  
  $(document).ready(async () => {
    refresh();
  });
  
  $("#submit-bet").click((event) => {
    event.preventDefault();
    var username = $("#username").val();
    var bet = parseInt($("#bet-value").val());
    if (username.length == 0 || !Number.isInteger(bet)) {
      alert("Must enter a valid username and bet.");
    } else if (username.length > 10)
      console.log("Please enter a username less than or equal to 10 characters.");
    else {
      $.get("/bet/" + username + "/" + bet, (data, status) => {
        console.log("GET score: " + status);
        if (status == "success") {
          var score = data.score;
          localStorage.setItem("previous-score", score);
          var highest_score = localStorage.getItem("local-score");
          if (score > highest_score) {
            localStorage.setItem("local-score", score);
            localStorage.setItem("state", 1);
          } else localStorage.setItem("state", 0);
        }
        refresh();
      });
    }
  });
  