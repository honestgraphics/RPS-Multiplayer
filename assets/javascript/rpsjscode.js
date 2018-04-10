//listening for changes in database
  database.ref("players").on("value", function (snapshot) {
    //IF PLAYER 1 EXISTS
    if (!player1Exist && snapshot.child("1").exists()) {
      player1Exist = true;
      $("#player1Box").empty();
      $("#player1Box").append("<p>" + snapshot.child("1").val().username + "  </p>");
    }
    //IF PLAYER 2 EXISTS
    if (!player2Exist && snapshot.child("2").exists()) {
      player2Exist = true;
      $("#player2Box").empty();
      console.log("about to append player 2", snapshot.child("2").val().username);
      $("#player2Box").append("<p>" + snapshot.child("2").val().username + "  </p>");
    } else {
      player2Exist = false;
      $("#player2Box").empty();
    }
  });

  //submit button on click function
  $("#submitBtn").on("click", function (event) {
    var userName = $("#nameVal").val();
    // console.log($("#nameVal").val());
    signIn(userName);
    // event.preventDefault();
  });

  //signs into game
  function signIn(user) {
    let userObject = {
      username: user,
      wins: 0,
      losses: 0,
      choice: ''
    };
    if (player1Exist == false && !database.ref("player/1").exists()) {
      //ADDS PLAYER 1 WHEN SIGN ON
      firebase.database().child('players/' + 1).set(userObject);
      appendGameChoices(1);
                // REMOVES PLAYER WHEN TAB CLOSES
      database.ref('players/' + 1).onDisconnect().remove();

      //notify player 2 on screen 
      //update data for player 2 to reset wins and losses

      // reversal for player 1


    } else {
      //if (player1Exist == true*/snapshot.child("1").exists()) {
      //ADDS PLAYER 2 WHEN PLAYER 1 ALREADY EXISTS
      firebase.database().child('players/' + 2).set(userObject);
      appendGameChoices(2);
      // REMOVES PLAYER WHEN TAB CLOSES
      database.ref('players/' + 2).onDisconnect().remove();
    }
  };



  function appendGameChoices(playerNum) {
    var box = $("#player" + playerNum + "Box");
    var imgArray = ['./assets/images/paper.jpg', './assets/images/rock.png', './assets/images/scissors.png'];
    for (var i = 0; i < imgArray.length; i++) {
      box.append('<img class="choices" src="' + imgArray[i] + '"/>');
    }

  }







  });