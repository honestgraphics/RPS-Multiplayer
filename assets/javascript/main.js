$(document).ready(function () {

  var player1Exist = false;
  var player2Exist = false;



  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAYFJ_o33sd5WwHO8gXgvheakmTusZrbM8",
    authDomain: "rps-multiplayer-940fe.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-940fe.firebaseio.com",
    projectId: "rps-multiplayer-940fe",
    storageBucket: "",
    messagingSenderId: "373803406166"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();



  //submit button on click function
  $("#submitBtn").on("click", function (event) {
    var userName = $("#nameVal").val();
    // console.log($("#nameVal").val());
    signIn(userName);
    // event.preventDefault();
  });

  //signs into game
  function signIn(Tom) {
    if (player1Exist == false) {
      //ADDS PLAYER 1 WHEN SIGN ON
      firebase.database().ref('players/' + 1).set({
        username: Tom,
      });
      appendGameChoices(1);
      // REMOVES PLAYER WHEN TAB CLOSES
      database.ref('players/' + 1).onDisconnect().remove();

    } else if (player1Exist == true) {
      //ADDS PLAYER 2 WHEN PLAYER 1 ALREADY EXISTS
      firebase.database().ref('players/' + 2).set({
        username: Tom,
      });
      appendGameChoices(2);
    }
  };



  function appendGameChoices(playerNum) {
    var imgArray = ['assets/images/paper.jpg', 'assets/images/rock.png', 'assets/images/scissors.png']
    for (i = 0; i < imgArray.length; i++) {
      $("#player" + playerNum + "Box").append("<img class='choices' src=" + imgArray[i] + "></>");
    }

  }

  //listening for changes in database
  database.ref("players").on("value", function (snapshot) {
    //IF PLAYER 1 EXISTS
    if (snapshot.child("1").exists()) {
      player1Exist = true;
      $("#player1Box").empty();
      $("#player1Box").append("<p>" + snapshot.child("1").val().username + "  </p>");
    } else {
      player1Exist = false;
      $("#player1Box").empty();
    }
    //IF PLAYER 2 EXISTS
    if (snapshot.child("2").exists()) {
      player2Exist = true;
      // $("#player2Box").empty();
      console.log("about to append player 2", snapshot.child("2").val().username);
      $("#player2Box").append("<p>" + snapshot.child("2").val().username + "  </p>");
    } else {
      player2Exist = false;
      $("#player2Box").empty();
    }




    //   $("#submitBtn").on("click", function (event) {
    //     $('#chatInput').keypress(function (e) {
    //       if (e.keyCode == 13) {
    //         var text = $('#messageInput').val();
    //         myDataRef.push({
    //           name: name,
    //           text: text
    //         });
    //         $('#messageInput').val('');
    //       }
    //     });

    //     myDataRef.on('child_added', function (snapshot) {
    //       var message = snapshot.val();
    //       displayChatMessage(message.name, message.text);
    //     });

    //     function displayChatMessage(name, text) {
    //       $('<div/>').text(text).prepend($('<em/>').text(name + ': ')).appendTo($('#messages'));
    //       $('#messages')[0].scrollTop = $('#messages')[0].scrollHeight;
    //     }
    //   });

  });

  // event.preventDefault();










  //use to append a span to doc later
  // $( ".inner" ).append( "<p>Test</p>" );







});