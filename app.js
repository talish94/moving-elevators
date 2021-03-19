

var audio = new Audio('/assets/ElevatorBell.mp3');
var rightElevatorFloor = 2;
var leftElevatorFloor = 3;

var rightElevatorIdle = false;
var leftElevatorIdle = false;

var leftDistance = 1000;
var rightDistance = 1000;

var queueRight = [];
var queueLeft = [];

var timePerFloor = 4;
var delayAfterArrival = 2000;

var firstInitial = true;

var elevatorLeftIsBusy = false;
var elevatorRightIsBusy = false;

var timerFloor0 = 0;
var timerFloor1 = 0;
var timerFloor2 = 0;
var timerFloor3 = 0;
var timerFloor4 = 0;
var timerFloor5 = 0;
var timerFloor6 = 0;


function setAllButtons() {

    console.log(firstInitial);

    const btn0 = document.getElementById("btnFloor0");
    btn0.addEventListener("click", function() {
        onBTNpress(0);
    });

    const btn1 = document.getElementById("btnFloor1");
    btn1.addEventListener("click", function() {
        onBTNpress(1);
    });
 


    const btn2 = document.getElementById("btnFloor2");
    btn2.addEventListener("click", function() {
        onBTNpress(2);
    });

    const btn3 = document.getElementById("btnFloor3");
    btn3.addEventListener("click", function() {
        onBTNpress(3);
    });

    const btn4 = document.getElementById("btnFloor4");
    btn4.addEventListener("click", function() {
        onBTNpress(4);
    });

    const btn5 = document.getElementById("btnFloor5");
    btn5.addEventListener("click", function() {
        onBTNpress(5);
    });

    const btn6 = document.getElementById("btnFloor6");
    btn6.addEventListener("click", function() {
        onBTNpress(6);
    });

    firstInitial = false;
    console.log(firstInitial);
    
}
   
    // for (numButtons = 0; numButtons < 7; numButtons++ ){

    //     var currBTN = "btnFloor" + numButtons;  // "btnFloor0"
    //     console.log(currBTN);
    //     var elementBTN = document.getElementById(currBTN);

    //     elementBTN.addEventListener("click", function() {
    //         onBTNpress(numButtons);
    //     });

    //     console.log(numButtons);
    // }






// setInterval(function() {
//     initialState();
//     console.log("Im herreee");
//     }, 1000); 

initialState();

function initialState(){

    if (firstInitial)
        setAllButtons();

    if (queueRight.length !== 0 && !elevatorRightIsBusy){
        moveElevator("elevatorRight", rightElevatorFloor, queueRight[queueRight.length-1]);  // num of next floor to go to.
        //console.log("enter roght");
    }

    if (queueLeft.length !== 0 && !elevatorLeftIsBusy) {
        moveElevator("elevatorLeft", leftElevatorFloor, queueLeft[queueLeft.length-1]);  // num of next floor to go to.
    }


    setTimeout(function() {
        initialState();
        //console.log("Im herreee");
     }, 200); 
}

function moveElevator(whichElevator, fromFloorNum, toFloorNum){

    if ( whichElevator == "elevatorRight" )
        elevatorRightIsBusy = true; 
    
    else if (whichElevator == "elevatorLeft")
        elevatorLeftIsBusy = true;

    else
        throw 'Invalid elevator!';


    var topRate = convertFloorToPlace(toFloorNum);
    document.getElementById(whichElevator).style.top = topRate;

    var time = (Math.abs(fromFloorNum - toFloorNum)) * timePerFloor;
    document.getElementById(whichElevator).style.transition = time + "s ease-in-out";

    //console.log(document.getElementById(whichElevator).style.transition);
    //var totalTimeToArrival = (Math.abs(fromFloorNum, toFloorNum)) * timePerFloor;

    setTimeout(function(){ // free to go again.
        completeMove(whichElevator, toFloorNum);
     }, time * 1000); 
}


function convertFloorToPlace(floorNum){  
    
    switch (floorNum) {
        case 0:
            return "140%";
        case 1:
            return "122%";
        case 2:
            return "102%";
        case 3:
            return "82%";
        case 4:
            return "62%";
        case 5:
            return "42%";
        case 6:
            return "21%";
        default:
            throw 'Invalid floor!';
    }
}


function completeMove(whichElevator, toFloorNum){

    startMusic();
    var setBusy = "";

    const btnFloor = "redBTNFloor" + toFloorNum;
    document.getElementById(btnFloor).style.visibility="hidden";

    if (whichElevator === "elevatorRight" ){
        rightElevatorFloor = queueRight.shift(); 
        console.log("shift out " + toFloorNum + " from right array !!");
        setBusy = "right";
    }
    
    else if (whichElevator === "elevatorLeft"){
        leftElevatorFloor = queueLeft.shift();
        console.log("shift out " + toFloorNum + " from lefttt array !!");
        setBusy = "left";
    }

    else
        throw 'Invalid elevator!';


    setTimeout(function(){ 

        if (setBusy === "left"){
            elevatorLeftIsBusy = false; 
            //console.log("enter left %$$$$$$$$$$");
        }
        else{
            elevatorRightIsBusy = false; 
            //console.log("enter rightttt$$");
        }

        initialState();
    }, delayAfterArrival); 
}



function startMusic() {
    audio.play();
}



// function elevatorArrived(whichElevator, floorNum) {
//     const btnFloor = "redBTNFloor" + floorNum;

//     startMusic();
//     document.getElementById(btnFloor).style.visibility="hidden";

//     setTimeout(function(){ // free to go again.
//         setIdle(whichElevator, false);
//         console.log("now idle is false !!");
//      }, 2000);

//     if ( whichElevator == "elevatorRight")
//         rightElevatorFloor = floorNum;
//     else
//         leftElevatorFloor = floorNum;

//     console.log(rightElevatorFloor);
//     console.log(leftElevatorFloor);
// }

// function getCloserElevator(floorNum) {
//     leftDistance = Math.abs(leftElevatorFloor - floorNum);
//     rightDistance = Math.abs(rightElevatorFloor - floorNum);

//     return Math.min(leftDistance, rightDistance) == leftDistance ? "left" : "right";
// }

// function setIdle(whichElevator, boolean){
//     if (whichElevator == elevatorLeft)
//         rightElevatorIdle = boolean;
//     else    
//         leftElevatorIdle = boolean;
// }


// function computeSpeed(whichElevator, floorNum){
//     if (whichElevator == elevatorLeft)
//         var distance = Math.abs(leftElevatorFloor - floorNum);
//     else    
//         var distance =  Math.abs(rightElevatorFloor - floorNum);

//     return distance * 4 ;   /////// timePerFloor
// }



function onBTNpress(btnFloorNum){

    const redBTNFloor = "redBTNFloor" + btnFloorNum;

    document.getElementById(redBTNFloor).style.visibility="visible";

    document.getElementById('timerFloor0').innerText = "4.000";


    var destRight = rightElevatorFloor;
    var destLeft = leftElevatorFloor;

    // console.log(destRight);
    // console.log(destLeft);

    if (queueRight.length !== 0)
        destRight = queueRight[queueRight.length-1];

    if (queueLeft.length !== 0)
        destLeft = queueLeft[queueLeft.length-1];
    
    // console.log(queueRight.length);
    // console.log(queueLeft.length );


    if ((Math.abs(btnFloorNum - destLeft)) > (Math.abs(btnFloorNum - destRight))){
        queueRight.push(btnFloorNum);
        console.log("push " + btnFloorNum + " into right array !!");
        console.log(queueRight);
    }
        
    else if ((Math.abs(btnFloorNum - destLeft)) < (Math.abs(btnFloorNum - destRight))){
        queueLeft.push(btnFloorNum);
        console.log("push " + btnFloorNum + " into lefttt array !!");
        console.log(queueLeft);
    }

    else {  // distances are equal. choose the first empty one if any
        if (queueRight.length === 0){
            queueRight.push(btnFloorNum);
            console.log("push " + btnFloorNum + " into right array !!");
        }
        else    {
            queueLeft.push(btnFloorNum);
            console.log("push " + btnFloorNum + " into lefttt array !!");
        }
    }
   
}





// const btnLeft0 = document.getElementById("btnFloor0");
// btnLeft0.addEventListener("click", function() {

//     var whichElevator = (getCloserElevator(0) == "left") ? "elevatorLeft" : "elevatorRight";
//     console.log(whichElevator);

//     var checkIfIdle = whichElevator + "Idle";
//     console.log(checkIfIdle);

//   // if (!checkIfIdle){
//         document.getElementById(whichElevator).style.top = "140%";
//         document.getElementById("redBTNFloor0").style.visibility="visible";

//         var time = computeSpeed(whichElevator, 0);
//         document.getElementById(whichElevator).style.transition = time + "s ease-in-out";

//         console.log(document.getElementById(whichElevator).style.transition);

//         setTimeout(function(){ 
//             elevatorArrived(whichElevator, 0);
//         }, time * 1000);
// //    }
// //     else{
// //         //   while (checkIfIdle){
// //         //     console.log("still idleee !!");
// //         // }

// //         // var myVar = setInterval(myTimer(checkIfIdle), 250);

// //         console.log("else idle !!");
// //     }
// });



// const btnLeft1 = document.getElementById("btnFloor1");
// btnLeft1.addEventListener("click", function() {

//     var whichElevator = (getCloserElevator(1) == "left") ? "elevatorLeft" : "elevatorRight";
//     console.log(whichElevator);

//     document.getElementById(whichElevator).style.top = "122%";
//     document.getElementById("redBTNFloor1").style.visibility="visible";
//    // setIdle(whichElevator, true);

//    var time = computeSpeed(whichElevator, 1);
//    document.getElementById(whichElevator).style.transition = time + "s ease-in-out";

//     setTimeout(function(){ 
//         elevatorArrived(whichElevator, 1);
//      }, time * 1000);
// });

// const btnLeft2 = document.getElementById("btnFloor2");
// btnLeft2.addEventListener("click", function() {

//     var whichElevator = (getCloserElevator(2) == "left") ? "elevatorLeft" : "elevatorRight";
//     console.log(whichElevator);

//     document.getElementById(whichElevator).style.top = "102%";
//     document.getElementById("redBTNFloor2").style.visibility="visible";

//     var time = computeSpeed(whichElevator, 2);
//     document.getElementById(whichElevator).style.transition = time + "s ease-in-out";

//     setTimeout(function(){ 
//         elevatorArrived(whichElevator, 2);
//      }, time * 1000);
// });

// const btnLeft3 = document.getElementById("btnFloor3");
// btnLeft3.addEventListener("click", function() {

//     var whichElevator = (getCloserElevator(3) == "left") ? "elevatorLeft" : "elevatorRight";
//     console.log(whichElevator);

//     document.getElementById(whichElevator).style.top = "82%";
//     document.getElementById("redBTNFloor3").style.visibility="visible";

//     var time = computeSpeed(whichElevator, 3);
//     document.getElementById(whichElevator).style.transition = time + "s ease-in-out";

//     setTimeout(function(){ 
//         elevatorArrived(whichElevator, 3);
//      }, time * 1000);
// });

// const btnLeft4 = document.getElementById("btnFloor4");
// btnLeft4.addEventListener("click", function() {

//     var whichElevator = (getCloserElevator(4) == "left") ? "elevatorLeft" : "elevatorRight";
//     console.log(whichElevator);

//     document.getElementById(whichElevator).style.top = "62%";
//     document.getElementById("redBTNFloor4").style.visibility="visible";

//     var time = computeSpeed(whichElevator, 4);
//     document.getElementById(whichElevator).style.transition = time + "s ease-in-out";

//     setTimeout(function(){ 
//         elevatorArrived(whichElevator, 4);
//      }, time * 1000);
// });

// const btnLeft5 = document.getElementById("btnFloor5");
// btnLeft5.addEventListener("click", function() {

//     var whichElevator = (getCloserElevator(5) == "left") ? "elevatorLeft" : "elevatorRight";
//     console.log(whichElevator);

//     document.getElementById(whichElevator).style.top = "42%";
//     document.getElementById("redBTNFloor5").style.visibility="visible";

//     var time = computeSpeed(whichElevator, 5);
//     document.getElementById(whichElevator).style.transition = time + "s ease-in-out";

//     setTimeout(function(){ 
//         elevatorArrived(whichElevator, 5);
//      }, time * 1000);
// });

// const btnLeft6 = document.getElementById("btnFloor6");
// btnLeft6.addEventListener("click", function() {

//     var whichElevator = (getCloserElevator(6) == "left") ? "elevatorLeft" : "elevatorRight";
//     console.log(whichElevator);

//     document.getElementById(whichElevator).style.top = "21%";
//     document.getElementById("redBTNFloor6").style.visibility="visible";

//     var time = computeSpeed(whichElevator, 6);
//     document.getElementById(whichElevator).style.transition = time + "s ease-in-out";

//     setTimeout(function(){ 
//         elevatorArrived(whichElevator, 6);
//      }, time * 1000);
// });


