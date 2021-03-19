

var audio = new Audio('/assets/ElevatorBell.mp3');
var rightElevatorFloor = 2;
var leftElevatorFloor = 3;

var rightElevatorIdle = false;
var leftElevatorIdle = false;


var leftDistance = 1000;
var rightDistance = 1000;

function startMusic() {
    audio.play();
}

function elevatorArrived(whichElevator, floorNum) {

    const btnFloor = "redBTNFloor" + floorNum;

    startMusic();
    document.getElementById(btnFloor).style.visibility="hidden";

    setTimeout(function(){ // free to go again.
        setIdle(whichElevator, false);
        console.log("now idle is false !!");
     }, 2000);

    if ( whichElevator == "elevatorRight")
        rightElevatorFloor = floorNum;
    else
        leftElevatorFloor = floorNum;

    console.log(rightElevatorFloor);
    console.log(leftElevatorFloor);
}

function getCloserElevator(floorNum) {

    leftDistance = Math.abs(leftElevatorFloor - floorNum);
    rightDistance = Math.abs(rightElevatorFloor - floorNum);

    return Math.min(leftDistance, rightDistance) == leftDistance ? "left" : "right";
}

function setIdle(whichElevator, boolean){
    if (whichElevator == elevatorLeft)
        rightElevatorIdle = boolean;
    else    
        leftElevatorIdle = boolean;
}

const btnLeft0 = document.getElementById("btnFloor0");
btnLeft0.addEventListener("click", function() {

    var whichElevator = (getCloserElevator(0) == "left") ? "elevatorLeft" : "elevatorRight";
    console.log(whichElevator);

    var checkIfIdle = whichElevator + "Idle";
    console.log(checkIfIdle);

    if (!checkIfIdle){
        document.getElementById(whichElevator).style.top = "140%";
        document.getElementById("redBTNFloor0").style.visibility="visible";
        setIdle(whichElevator, true);

        setTimeout(function(){ 
            elevatorArrived(whichElevator, 0);
        }, 4000);
    }
    else{
        //   while (checkIfIdle){
        //     console.log("still idleee !!");
        // }
    console.log("else idle !!");
    }
});

const btnLeft1 = document.getElementById("btnFloor1");
btnLeft1.addEventListener("click", function() {

    var whichElevator = (getCloserElevator(1) == "left") ? "elevatorLeft" : "elevatorRight";
    console.log(whichElevator);

    document.getElementById(whichElevator).style.top = "122%";
    document.getElementById("redBTNFloor1").style.visibility="visible";
    setIdle(whichElevator, true);

    setTimeout(function(){ 
        elevatorArrived(whichElevator, 1);
     }, 4000);
});

const btnLeft2 = document.getElementById("btnFloor2");
btnLeft2.addEventListener("click", function() {

    var whichElevator = (getCloserElevator(2) == "left") ? "elevatorLeft" : "elevatorRight";
    console.log(whichElevator);

    document.getElementById(whichElevator).style.top = "102%";
    document.getElementById("redBTNFloor2").style.visibility="visible";

    setTimeout(function(){ 
        elevatorArrived(whichElevator, 2);
     }, 4000);
});

const btnLeft3 = document.getElementById("btnFloor3");
btnLeft3.addEventListener("click", function() {

    var whichElevator = (getCloserElevator(3) == "left") ? "elevatorLeft" : "elevatorRight";
    console.log(whichElevator);

    document.getElementById(whichElevator).style.top = "82%";
    document.getElementById("redBTNFloor3").style.visibility="visible";

    setTimeout(function(){ 
        elevatorArrived(whichElevator, 3);
     }, 4000);
});

const btnLeft4 = document.getElementById("btnFloor4");
btnLeft4.addEventListener("click", function() {

    var whichElevator = (getCloserElevator(4) == "left") ? "elevatorLeft" : "elevatorRight";
    console.log(whichElevator);

    document.getElementById(whichElevator).style.top = "62%";
    document.getElementById("redBTNFloor4").style.visibility="visible";

    setTimeout(function(){ 
        elevatorArrived(whichElevator, 4);
     }, 4000);
});

const btnLeft5 = document.getElementById("btnFloor5");
btnLeft5.addEventListener("click", function() {

    var whichElevator = (getCloserElevator(5) == "left") ? "elevatorLeft" : "elevatorRight";
    console.log(whichElevator);

    document.getElementById(whichElevator).style.top = "42%";
    document.getElementById("redBTNFloor5").style.visibility="visible";

    setTimeout(function(){ 
        elevatorArrived(whichElevator, 5);
     }, 4000);
});

const btnLeft6 = document.getElementById("btnFloor6");
btnLeft6.addEventListener("click", function() {

    var whichElevator = (getCloserElevator(6) == "left") ? "elevatorLeft" : "elevatorRight";
    console.log(whichElevator);

    document.getElementById(whichElevator).style.top = "21%";
    document.getElementById("redBTNFloor6").style.visibility="visible";

    setTimeout(function(){ 
        elevatorArrived(whichElevator, 6);
     }, 4000);
});


