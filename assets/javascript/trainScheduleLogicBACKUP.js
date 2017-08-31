$(document).ready(function() {



var config = {
    apiKey: "AIzaSyA01-EMQyplz-5xrl9QMKoOT7arLoqUOzQ",
    authDomain: "trainscheduler-7e67e.firebaseapp.com",
    databaseURL: "https://trainscheduler-7e67e.firebaseio.com",
    projectId: "trainscheduler-7e67e",
    storageBucket: "trainscheduler-7e67e.appspot.com",
    messagingSenderId: "91160505604"
  };

firebase.initializeApp(config);

var database = firebase.database();

debugger;

//Function to find minutes to next train
function findMinutesAway (timeOne, frequency) {
  var diffTime = moment().diff(moment(timeOne), "minutes");
  var timeRemainder = diffTime%frequency;
  var minutesTillTrain = frequency - timeRemainder;
  return (minutesTillTrain);
}

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  // Store everything into a variable.
  var tName = childSnapshot.val().trainName;
  var dest = childSnapshot.val().destination;
  var firstT = childSnapshot.val().firstTrain;
  var frequ = childSnapshot.val().trainFrequency;

  // Train In

  // Format the time to the next train (don't think I have to do this)
  // var formatTime = moment.unix(empStart).format("MM/DD/YY");

  // Calculate the minutes away
  var minutesAway = findMinutesAway(firstT, frequ);
  var nextArrival = moment().add(minutesAway, "minutes").format("HH:mm");
  // OR... var nextArrival = moment((moment().add(minutesAway, "minutes")), "HH:mm");


  // Add each train's data into the table
  $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + dest + "</td><td>" + frequ + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
});


// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = moment($("#first-train-input").val().trim(), "HH:mm");
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    trainFrequency: trainFrequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.trainFrequency);

  // Alert
  alert("Train added successfully!");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});



});
