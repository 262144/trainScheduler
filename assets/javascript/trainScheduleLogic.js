$(document).ready(function() {

// Function to find minutes to next train
function findMinutesAway (timeOne, frequency) {
	var diffTime = moment().diff(moment(timeOne), "minutes");
	var timeRemainder = diffTime%frequency;
	var minutesTillTrain = frequency - timeRemainder;
	return (minutesTillTrain);
}

// Function to clear input
function clearInput () {
	$("#train-name-input").val("");
	$("#destination-input").val("");
	$("#first-train-input").val("");
	$("#frequency-input").val("");

}

var config = {
	apiKey: "AIzaSyAoEL8tuthnxKmYFF_rTwwvHogwMr5k9bg",
	authDomain: "a-4ce90.firebaseapp.com",
	databaseURL: "https://a-4ce90.firebaseio.com",
	projectId: "a-4ce90",
	storageBucket: "a-4ce90.appspot.com",
	messagingSenderId: "406545018152"
};
firebase.initializeApp(config);
var database = firebase.database();

// Grab user input; put into an object; push to the database
$("#add-train-btn").on("click", function () {
	event.preventDefault();
	var trainName = $("#train-name-input").val().trim();
	var destination = $("#destination-input").val().trim();
	var firstTrain = $("#first-train-input").val().trim();
	var frequency = $("#frequency-input").val().trim();
	if (trainName == "" || destination == "" || firstTrain == "") {
		alert ("Please enter a train name, destination and time.");
		clearInput();
	} else if (frequency < 1 || frequency > 1440) {
		alert("Please enter a number between 0 and 1441.");
		clearInput();
	} else {
		var newTrain = {
			trainName: trainName,
			destination: destination,
			firstTrain: firstTrain,
			frequency: frequency
		}
		database.ref().push(newTrain);
		alert("Train added successfully!");
		clearInput();
}
});


// Upon creating a database element, display data in table

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
	var trainName = childSnapshot.val().trainName;
	var destination = childSnapshot.val().destination;
	var firstTrain = childSnapshot.val().firstTrain;
	var frequency = childSnapshot.val().frequency;

	var convertedTime = moment(firstTrain, "HH:mm");

   // Calculate the minutes away
   var minutesAway = findMinutesAway(convertedTime, frequency);
   var nextArrival = moment().add(minutesAway, "minutes").format("LT");

    // Add each train's data into the table
    $("#train-table > tbody").prepend("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");

});

});