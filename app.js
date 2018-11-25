var config = {
    apiKey: "AIzaSyAMoXZXyyljsGFY9Ypuc-kqsSIfySxgu14",
    authDomain: "train-scheduler-51410.firebaseapp.com",
    databaseURL: "https://train-scheduler-51410.firebaseio.com",
    projectId: "train-scheduler-51410",
    storageBucket: "train-scheduler-51410.appspot.com",
    messagingSenderId: "683382295141"
};
firebase.initializeApp(config);

var database = firebase.database();

$(document).ready(function () {
    $("#submit").on("click", function (event) {
        event.preventDefault();
        var newTrainName = $("#train-name").val().trim();
        var newDestination = $("#train-destination").val().trim();
        var newTime = $("#train-time").val().trim();
        var newFrequency = $("#train-frequency").val().trim();

        database.ref().push({
            name: newTrainName,
            destination: newDestination,
            time: newTime,
            frequency: newFrequency,
        });
    });

    database.ref().on("child_added", function (snapshot) {
        console.log(snapshot.val().name);
        console.log(snapshot.val().destination);
        console.log(snapshot.val().time);
        console.log(snapshot.val().frequency);

        var newTrain = $("<tr>");
        var newTrainName = $("<td>").text(snapshot.val().name);
        newTrain.append(newTrainName);
        var newDestination = $("<td>").text(snapshot.val().destination);
        newTrain.append(newDestination);
        var newFrequency = $("<td>").text(snapshot.val().frequency);
        newTrain.append(newFrequency);
        $("tbody").append(newTrain);

        var tFrequency = snapshot.val().frequency;
        var firstTime = snapshot.val().time;

        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        var tRemainder = diffTime % tFrequency;

        var tMinutesTillTrain = tFrequency - tRemainder;
        var newMinutesTillTrain = $("<td>").text(tMinutesTillTrain);


        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        var newNextTrain = $("<td>").text(moment(nextTrain).format("HH:mm"));
        newTrain.append(newNextTrain);
        newTrain.append(newMinutesTillTrain);


    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });
});

// Assume the following situations.


// (TEST 1)
// First Train of the Day is 3:00 AM
// Assume Train comes every 3 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:18 -- 2 minutes away

// (TEST 2)
// First Train of the Day is 3:00 AM
// Assume Train comes every 7 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:21 -- 5 minutes away


// ==========================================================

// Solved Mathematically
// Test case 1:
// 16 - 00 = 16
// 16 % 3 = 1 (Modulus is the remainder)
// 3 - 1 = 2 minutes away
// 2 + 3:16 = 3:18

// Solved Mathematically
// Test case 2:
// 16 - 00 = 16
// 16 % 7 = 2 (Modulus is the remainder)
// 7 - 2 = 5 minutes away
// 5 + 3:16 = 3:21

// Assumptions


// Time is 3:30 AM

/*
// First Time (pushed back 1 year to make sure it comes before current time)
var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
console.log(firstTimeConverted);

// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % tFrequency;
console.log(tRemainder);

// Minute Until Train
var tMinutesTillTrain = tFrequency - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
*/