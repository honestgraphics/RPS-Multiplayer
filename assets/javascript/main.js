$(document).ready(function () {

  ///INITIALIZE FIREBASE
  var config = {
    apiKey: "AIzaSyAYFJ_o33sd5WwHO8gXgvheakmTusZrbM8",
    authDomain: "rps-multiplayer-940fe.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-940fe.firebaseio.com",
    projectId: "rps-multiplayer-940fe",
    storageBucket: "rps-multiplayer-940fe.appspot.com",
    messagingSenderId: "373803406166"
  };
  firebase.initializeApp(config);

  ///SET LOCAL VARIABLES
  var player1Exist = false;
  var player2Exist = false;
  var playerNum;
  //var playerKey; //unique to session client
  var turn = 1;
  var isPlay = false;
  var imgArray = ['./assets/images/paper.png', './assets/images/rock.png', './assets/images/scissors.png'];

  ///SET FIREBASE REFERENCE VARIABLES
  var database = firebase.database();
  var myDataRef = database.ref();
  // var playerRef = firebase.database().ref("players");
  // var player1Ref = firebase.database().ref("players/1");
  // var player2Ref = firebase.database().ref("players/2");
  // var chat = firebase.database().ref("chat");
  // var remove = database.ref().remove();

  ///////////////////////////////////////
  ///////////////////////////////////////
  ///////////////////////////////////////

  ///FIREBASE WATCHER... - listening for changes in database
  database.ref("players").on("value", function (snapshot) {
    //IF PLAYER 1 EXISTS
    // console.log(snapshot);
    if (snapshot.child("1").exists()) {
      console.log('snapshot.child("1").val()', snapshot.child("1").val());
      console.log("player 1 is in")
      //tells chat that player 1 has left chat
      if(!player1Exist && playerNum === 2) $('#chat').append('<p><span>Player 1</span>' + ' has connected.' + '</p>');
      player1Exist = true;
      $("#player1Box").empty();
      $("#player1Box").append("<p>" + snapshot.child("1").val().username + "  </p>");
    } else {
      //tells chat that player 1 has left chat
      if(player1Exist && playerNum === 2) $('#chat').append('<p><span>Player 1</span>' + ' has disconnected.' + '</p>');
      player1Exist = false;
      $("#player1Box").empty();
      isPlay = false;
    }
    //IF PLAYER 2 EXISTS
    if (snapshot.child("2").exists()) {
      //tells chat that player 1 has left chat
      if(!player2Exist && playerNum === 1) $('#chat').append('<p><span>Player 2</span>' + ' has connected.' + '</p>');
      player2Exist = true;
      //$("#player2Box").empty();
      console.log("about to append player 2", snapshot.child("2").val().username);
      $("#player2Box").append("<p>" + snapshot.child("2").val().username + "  </p>");
    } else {
      //tells chat that player 1 has left chat
      if(player2Exist && playerNum === 1) $('#chat').append('<p><span>Player 2</span>' + ' has disconnected.' + '</p>');
      player2Exist = false;
      $("#player2Box").empty();
      isPlay = false;

    }

    // if not currently playing check to see if both players are logged in
    if (isPlay === false && player1Exist && player2Exist) {
      //  set turn = 1
      turn = 1;
      //call append game choices
      appendGameChoices();
    }
    
  });

  ///CHAT FIREBASE WATCHER... - listening for changes in database for chat
  database.ref("chat").on("child_added", function (snapshot) {
    console.log("chat: ", snapshot.val());
    displayChattext(snapshot.val().time, snapshot.val().username, snapshot.val().text);
  })

  ///////////////////////////////////////
  ///////////////////////////////////////
  ///////////////////////////////////////

  ///ADDING CHAT FUNCTIONS
  //FUNCTION TO DISPLAY CORRECT TIME IN CHAT
  function displayChattext(time, name, text) {
    console.log(time);
    var date = new Date(time);
    // Hours part from the timestamp
    var hours = date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    // Seconds part from the timestamp
    var seconds = "0" + date.getSeconds();

    // Will display time in 10:30 format
    var formattedTime = hours + ':' + minutes.substr(-2);

    // $("#chat").empty();
    $('#chat').append('<p><span>' + " (" + formattedTime + ") " + name + ': </span>' + text + '</p>');
    // $('#chat')[0].scrollTop = $('#chat')[0].scrollHeight;
  }

  //CHAT: when pressing enter, the chat sends message  --- good
  $("#chatBtn").click(function (event) {
    console.log("i've been clicked!");
    var userName = $("#nameVal").val();
    let chatObject = {
      username: userName,
      text: $("#chatInput").val(),
      time: $.now()
      // firebase.database.ServerValue.TIMESTAMP
    };
    console.log(chatObject.time);
    database.ref('/chat/').push(chatObject);
    // displayChattext (chatObject.time, chatObject.username, chatObject.text);
    // $('#chatInput').val();
    // database.ref("chat").set(
    //   chatObject
    // );
    $('#chatInput').val('');
  });





  ///////////////////////////////////////
  ///////////////////////////////////////
  ///////////////////////////////////////


  //submit button on click function
  $("#submitBtn").on("click", function (event) {
    var userName = $("#nameVal").val();
    // console.log($("#nameVal").val());
    signIn(userName);
    // event.preventDefault();
  });

  //append game choices function to be called later (puts images into boxes)
  function appendGameChoices() {
    var box = $("#player" + turn + "Box");
    for (var i = 0; i < imgArray.length; i++) {
      box.append('<img class="choices" src="' + imgArray[i] + '"/>');
    }
  }

  //signs into game
  function signIn(user) {
    let userObject = {
      username: user,
      wins: 0,
      losses: 0,
      choice: ''
    };
    if (player1Exist == false) {
      playerNum = 1;
      //ADDS PLAYER 1 WHEN SIGN ON
      database.ref('/players/' + 1).update(userObject);
      // appendGameChoices(1);
      //console.log
      // REMOVES PLAYER WHEN TAB CLOSES
      database.ref('players/' + 1).onDisconnect().remove();
      //removes player 1 chat on disconnect
      database.ref('chat/' + 1).onDisconnect().remove();

      //notify player 2 on screen 
      //update data for player 2 to reset wins and losses
      // reversal for player 1
      //new obect push update is update!!!


    } else {
      if (player1Exist == true) {
        playerNum = 2;
        //ADDS PLAYER 2 WHEN PLAYER 1 ALREADY EXISTS
        database.ref('players/' + 2).update(userObject);
        // appendGameChoices(1);
        // REMOVES PLAYER WHEN TAB CLOSES
        database.ref('players/' + 2).onDisconnect().remove();
        //removes player 2 chat on disconnect
        database.ref('chat/' + 2).onDisconnect().remove();
      }
    };


    //append game choices function to be called later (puts images into boxes)
    function appendGameChoices() {
      var box = $("#player" + turn + "Box");
      // if turn === playerNum show the choices
      if(turn === playerNum) {
        for (var i = 0; i < imgArray.length; i++) {
          box.append('<img class="choices" src="' + imgArray[i] + '"/>');
        }
      }
      else {
        // show waiting message
        box.append("<h2>Waiting for Player "+ playerNum + "</h2>");
        console.log('waiting message here');
      }

    }

    //1st player choice onclick
    $("#player1Box").on("click", "img.choices", function (event) {
      var imageChoice = this.getAttribute("src");
      if (imageChoice == imgArray[0]) {
        //paper
        database.ref('/players/1/choice').set('paper');
        $('#player1Box img.choices').remove();
        $('#player1Box').append("<h2>Paper!</h2>");
      } else if (imageChoice == imgArray[1]) {
        //rock
        database.ref('/players/1/choice').set('rock');
        $('#player1Box img.choices').remove();
        $('#player1Box').append("<h2>Rock!</h2>");
      } else {
        //scissors
        database.ref('/players/1/choice').set('scissors');
        $('#player1Box img.choices').remove();
        $('#player1Box').append("<h2>Scissors!</h2>");
      }
      turn = 2;
      appendGameChoices();
    });


    //2nd player choice onclick
    $("#player2Box").on("click", "img.choices", function (event) {
      var imageChoice = this.getAttribute("src");
      if (imageChoice == imgArray[0]) {
        //paper
        database.ref('/players/2/choice').set('paper');
        $('#player2Box img.choices').remove();
        $('#player2Box').append("<h2>Paper!</h2>");
      } else if (imageChoice == imgArray[1]) {
        //rock
        database.ref('/players/2/choice').set('rock');
        $('#player2Box img.choices').remove();
        $('#player2Box').append("<h2>Rock!</h2>");
      } else {
        //scissors
        database.ref('/players/2/choice').set('scissors');
        $('#player2Box img.choices').remove();
        $('#player2Box').append("<h2>Scissors!</h2>");
      }
      turn = 1;
      appendGameChoices();
    });

    //SOLUTION LOGIC
    function solutionLogic() {
      database.ref("players").on("child_added", function (snapshot) {
        var player1Choice = snapshot.child(1).val();
        console.log(player1Choice);
        console.log("look here")
        var player2Choice = snapshot.child(2).child("choice").val();
        console.log(player2Choice);
        //tie, rock, paper, scissors
        //determine winner
        //append winner to middle
      })
    }



    ///////////////////////////////////////
    ///////////////////////////////////////
    ///////////////////////////////////////







    // function appendGameChat(playerChat) {
    //   var chatBox = $("#chat" + playerChat + "Box");
    //   chatBox.append('<>');
    // }

    // function chat(user) {

    //   if (user == player1Exist) {

    //     appendGameChoices(1);
    //     // REMOVES PLAYER WHEN TAB CLOSES
    //     database.ref('players/' + 1).onDisconnect().remove();

    //     //notify player 2 on screen 
    //     //update data for player 2 to reset wins and losses
    //     // reversal for player 1


    //   } else {
    //     if (player1Exist == true) {
    //       //ADDS PLAYER 2 WHEN PLAYER 1 ALREADY EXISTS
    //       firebase.database().child('players/' + 2).set(userObject);
    //       appendGameChoices(2);
    //       // REMOVES PLAYER WHEN TAB CLOSES
    //       database.ref('players/' + 2).onDisconnect().remove();
    //     }
    //   };


    // myDataRef.on('child_added', function (snapshot) {
    //   var chat = snapshot.val();
    //   displayChattext(chat.name, chat.text);
    // });


    // }


    // event.preventDefault();










    //use to append a span to doc later 
    // $( ".inner" ).append( "<p>Test</p>" );

    // });}
  }
});