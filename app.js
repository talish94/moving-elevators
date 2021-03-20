

let audio = new Audio('/assets/ElevatorBell.mp3');
let rightElevatorFloor = 2;
let leftElevatorFloor = 3;

let rightElevatorIdle = false;
let leftElevatorIdle = false;

let leftDistance = 1000;
let rightDistance = 1000;

let queueRight = [];
let queueLeft = [];

let timePerFloor = 4;
let delayAfterArrival = 2000;

let firstInitial = true;

let elevatorLeftIsBusy = false;
let elevatorRightIsBusy = false;

let totalTimeQueueRight = 0;
let totalTimeQueueLeft = 0;


let rightInterval;
let leftInterval;

let intervalTimerFloor0;
let intervalTimerFloor1;
let intervalTimerFloor2;
let intervalTimerFloor3;
let intervalTimerFloor4;
let intervalTimerFloor5;
let intervalTimerFloor6;


let timerFloor0 = false;
let timerFloor1 = false;
let timerFloor2 = false;
let timerFloor3 = false;
let timerFloor4 = false;
let timerFloor5 = false;
let timerFloor6 = false;




let time_elapsed;

 function setAllButtons() {

    console.log(firstInitial);
     
    for (numButtons = 0; numButtons < 7; numButtons++ ){

        let currBTN = "btnFloor" + numButtons;  // "btnFloor0"
        console.log(currBTN);
        let elementBTN = document.getElementById(currBTN);

        elementBTN.addEventListener("click", onBTNpress.bind(this, numButtons), false);

        console.log(numButtons);
    }

    firstInitial = false;
    console.log(firstInitial);

}



initialState();

function initialState(){

    if (firstInitial)
        setAllButtons();

    if (queueRight.length !== 0 && !elevatorRightIsBusy){
        moveElevator("elevatorRight", rightElevatorFloor, queueRight[0]);  // num of next floor to go to.
    }

    if (queueLeft.length !== 0 && !elevatorLeftIsBusy) {
        moveElevator("elevatorLeft", leftElevatorFloor, queueLeft[0]);  // num of next floor to go to.

    }

    setTimeout(function() {
        initialState();
    }, 100); 
}



function moveElevator(whichElevator, fromFloorNum, toFloorNum){

    if ( whichElevator == "elevatorRight" )
        elevatorRightIsBusy = true; 
    
    else if (whichElevator == "elevatorLeft")
        elevatorLeftIsBusy = true;

    else
        throw 'Invalid elevator!';


    let topRate = convertFloorToPlace(toFloorNum);
    document.getElementById(whichElevator).style.top = topRate;

    let time = (Math.abs(fromFloorNum - toFloorNum)) * timePerFloor;
    document.getElementById(whichElevator).style.transition = time + "s ease-in-out";

    setTimeout(function(){ // free to go again.
        completeMove(whichElevator, toFloorNum);
     }, time * 1000); 

     return time;
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

    audio.play();
    let setBusy = "";

    const btnFloor = "redBTNFloor" + toFloorNum;
    document.getElementById(btnFloor).style.visibility="hidden";

    setTimer(toFloorNum);


    if (whichElevator === "elevatorRight" ){
        setBusy = "right";
    }
    
    else if (whichElevator === "elevatorLeft"){
        setBusy = "left";
    }

    else
        throw 'Invalid elevator!';


    setTimeout(function(){ 

        if (setBusy == "left"){
            elevatorLeftIsBusy = false; 
            leftElevatorFloor = queueLeft.shift();

            if (queueLeft.length === 0 )
                totalTimeQueueLeft = 0;
        }
        else{
            elevatorRightIsBusy = false; 
            rightElevatorFloor = queueRight.shift(); 
            

            if (queueRight.length === 0 )
                totalTimeQueueRight = 0;
        }

    }, delayAfterArrival); 
}





function onBTNpress(btnFloorNum){

    const redBTNFloor = "redBTNFloor" + btnFloorNum;
    document.getElementById(redBTNFloor).style.visibility="visible";

    let right = false;

    let destRight = rightElevatorFloor;
    let destLeft = leftElevatorFloor;

    if (queueRight.length !== 0)
        destRight = queueRight[queueRight.length-1];

    if (queueLeft.length !== 0)
        destLeft = queueLeft[queueLeft.length-1];
    


    if ((Math.abs(btnFloorNum - destLeft)) > (Math.abs(btnFloorNum - destRight))){
        queueRight.push(btnFloorNum);
        right = true;        
    }
        
    else if ((Math.abs(btnFloorNum - destLeft)) < (Math.abs(btnFloorNum - destRight))){
        queueLeft.push(btnFloorNum);
    }

    else {  // distances are equal. choose the first empty one if any
        if (queueRight.length === 0){
            queueRight.push(btnFloorNum);
            right = true;
        }
        else {
            queueLeft.push(btnFloorNum);
        }
    }

    setTimer(btnFloorNum);

    if ( right ){
        totalTimeQueueRight = totalTimeQueueRight + (Math.abs(btnFloorNum - destRight) * timePerFloor * 1000);   // global timer !
    
        if (queueRight.length > 0 && queueRight[0] !== btnFloorNum){
            totalTimeQueueRight = totalTimeQueueRight + delayAfterArrival; // delay between floors.
        }

        if (rightInterval == null){

            rightInterval = setInterval( function checkTimerRight() {
                if (queueRight.length !== 0 && totalTimeQueueRight > 100){
                    totalTimeQueueRight = totalTimeQueueRight - 100;
                }
                    
                else{
                    clearInterval(rightInterval);
                    rightInterval = null;
                }
            
            }, 100);
        }

    }

    else {
        totalTimeQueueLeft = totalTimeQueueLeft + (Math.abs(btnFloorNum - destLeft) * timePerFloor * 1000); 

        if (queueLeft.length > 0 && queueLeft[0] !== btnFloorNum)
            totalTimeQueueLeft = totalTimeQueueLeft + delayAfterArrival; // delay between floors.
        
        if (leftInterval == null){

            leftInterval = setInterval( function checkTimerRight() {

                if (queueLeft.length !== 0 && totalTimeQueueLeft > 100)
                    totalTimeQueueLeft = totalTimeQueueLeft - 100;
                
                else{
                    clearInterval(leftInterval);
                    leftInterval = null;
                }
            
            }, 100);
        }
    }

    let whichQueue = right ? totalTimeQueueRight : totalTimeQueueLeft;
    setSpecificFloorTimer(btnFloorNum, whichQueue);
}

function setSpecificFloorTimer(floorNum, whichQueue){   // set timer on or off, depends on 'boolean'.

    let currTimer = "timerFloor" + floorNum;

    switch (currTimer) {
        case "timerFloor0": {
            timerFloor0 = true;
            let currTime0 = whichQueue / 1000 ;

            intervalTimerFloor0 = setInterval( function checkTimer0() {
                if (currTime0 > 0){
                    currTime0 = currTime0 - 0.1;
                    currTime0 = currTime0.toFixed(1);
                    document.getElementById('timerFloor0').innerText = currTime0;
                }

                else{
                    clearInterval(intervalTimerFloor0);
                }
            
            }, 100);
            return;
        }

        case "timerFloor1":{
            timerFloor1 = true;
            let currTime1 = whichQueue / 1000 ;

            intervalTimerFloor1 = setInterval( function checkTimer1() {
                if (currTime1 > 0.09){
                    currTime1 = currTime1 - 0.1;
                    currTime1 = currTime1.toFixed(1);
                    document.getElementById('timerFloor1').innerText = currTime1;
                }

                else{
                    clearInterval(intervalTimerFloor1);
                }
            
            }, 100);
            return;
        }

        case "timerFloor2": {
            timerFloor2 = true;
            let currTime2 = whichQueue / 1000 ;

            intervalTimerFloor2 = setInterval( function checkTimer2() {
                if (currTime2 > 0.09){
                    currTime2 = currTime2 - 0.1;
                    currTime2 = currTime2.toFixed(1);
                    document.getElementById('timerFloor2').innerText = currTime2;
                }

                else{
                    clearInterval(intervalTimerFloor2);
                }
            
            }, 100);

            return;
        }

        case "timerFloor3": {
            timerFloor3 = true;
            let currTime3 = whichQueue / 1000 ;

            intervalTimerFloor3 = setInterval( function checkTimer3() {
                if (currTime3 > 0.09){
                    currTime3 = currTime3 - 0.1;
                    currTime3 = currTime3.toFixed(1);
                    document.getElementById('timerFloor3').innerText = currTime3;
                }

                else{
                    clearInterval(intervalTimerFloor3);
                }
            
            }, 100);
            return;
        }

        case "timerFloor4":{
            timerFloor4 = true;
            let currTime4 = whichQueue / 1000 ;

            intervalTimerFloor4 = setInterval( function checkTimer4() {
                if (currTime4 > 0.09){
                    currTime4 = currTime4 - 0.1;
                    currTime4 = currTime4.toFixed(1);
                    document.getElementById('timerFloor4').innerText = currTime4;
                }

                else{
                    clearInterval(intervalTimerFloor4);
                }
            
            }, 100);
            return;
        }
    
        case "timerFloor5":{
            timerFloor5 = true;
            let currTime5 = whichQueue / 1000 ;

            intervalTimerFloor5 = setInterval( function checkTimer5() {
                if (currTime5 > 0.09){
                    currTime5 = currTime5 - 0.1;
                    currTime5 = currTime5.toFixed(1);
                    document.getElementById('timerFloor5').innerText = currTime5;
                }

                else{
                    clearInterval(intervalTimerFloor5);
                }
            
            }, 100);            
            return;
        }

        case "timerFloor6":{
            timerFloor6 = true;
            let currTime6 = whichQueue / 1000 ;

            intervalTimerFloor6 = setInterval( function checkTimer6() {
                if (currTime6 > 0.09){
                    currTime6 = currTime6 - 0.1;
                    currTime6 = currTime6.toFixed(1);
                    document.getElementById('timerFloor6').innerText = currTime6;
                }

                else{
                    clearInterval(intervalTimerFloor6);
                }
            
            }, 100);
            return;
        }
    
        default:
            console.log("Invalid timer!");
    }
}

function setTimer(btnFloorNum){

    const timerFloor = "timerFloor" + btnFloorNum;

    if (document.getElementById(timerFloor).style.display === "block")
        document.getElementById(timerFloor).style.display = "none";

    else
        document.getElementById(timerFloor).style.display = "block";

}
