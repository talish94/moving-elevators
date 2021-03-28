////////////////////////////////////////////////////////////////////
//  
//  Project       :   Moving-Elevator (Home Assignment) 
//  File          :   app.js
//  Description   :   The main logic of dynamic elevators' simulator
//
//  Created On    :   18/03/2021 
//  Created By    :   Tali Schvartz
//

//////////////////// VARIABLES DECLERATION /////////////////////////

let arrayOfFloors = [];
let numOfFloors; // gets input from user

let arrayOfElevators = [];
let numElevators;  // gets input from user

let firstInitial = true;

let maxFloors = 40;
let minFloors = 2;

let maxElevators = 4;
let minElevators = 1;


//////////////////// CONSTANTS AND CONFIGURAIONS ////////////////////

let SECOND_IN_MILLI = 1000;
let REFRESH_RATE = 100;

let elevatorSound = new Audio('./assets/ElevatorBell.mp3');

let timePerFloorInMilli = 4000;  
let delayAfterArrivalInMilli = 2000;  

let elevatorWidth = 114;
let apartmentWidth = 395;
let floorHeight = 145;

let FLOOR_IMAGES_STOCK = 10;
let FIRST_SKY_IMAGE = 6;

let HIGHEST_ELEVATOR_PERCENTAGE = 18.3;
let FLOOR_HEIGHT_PERCENTAGE = 25.2;

let HIGHEST_BTN_PERCENTAGE = 35;
let PERCENTAGE_BETWEEN_BTNS = 25.1;
let DIFFERENCE_BTN_AND_TIMER = 5;


//////////////////// STATE MACHINE FUNCTIONS ////////////////////

// The state machine contains three states: initialState -> moveElevator -> completeMove.

function initialState(){

    if (firstInitial){
        hideForm();
        setAllButtons();
        drawBuilding();
    }

    for (elevator = 0; elevator < numElevators; elevator++ ){
        if (arrayOfElevators[elevator].queue.length !== 0 && !arrayOfElevators[elevator].isBusy) {
            moveElevator(arrayOfElevators[elevator], arrayOfElevators[elevator].currentFloor, arrayOfElevators[elevator].queue[0]); // gets the number of the next floor to go to.
        }
    }

    setTimeout(function() {
        initialState();
    }, REFRESH_RATE); 
}


// sets the css transition and top, from 'fromFloorNum' to 'toFloorNum'
function moveElevator(elevator, fromFloorNum, toFloorNum){

    elevator.isBusy = true;

    let topRate = convertFloorToCoordinate(toFloorNum);  
    document.getElementById(elevator.id).style.top = topRate;

    // sets the duration of the movement, depends on the distance between the 2 floors
    let movementDuration = (Math.abs(fromFloorNum - toFloorNum)) * timePerFloorInMilli; 
    document.getElementById(elevator.id).style.transition = movementDuration + "ms ease-in-out"; 

    // after the elevator gets to its destination - change to 'completeMove' state
    setTimeout(function(){ 
        completeMove(elevator, toFloorNum);
     }, movementDuration);  
}


// removes first element from queue and plays bell ring
function completeMove(elevator, toFloorNum){

    elevatorSound.play();
    document.getElementById(arrayOfFloors[toFloorNum].redButton).style.visibility="hidden";

    switchTimerDisplay(toFloorNum);
    elevator.isBusy = true;

    setTimeout(function(){ 

        elevator.isBusy = false;
        elevator.currentFloor = elevator.queue.shift();

        if (elevator.queue.length === 0){
            elevator.totalQueueTime = 0;
        }

    }, delayAfterArrivalInMilli);  // waits before ready to move again
}


//////////////////// DISPLAY FUNCTIONS ////////////////////

// draws floors according to 'numOfFloors', were each consists of 2 apartments and 'numElevators' elevators
function drawBuilding()
{

  for (floorNum = 0; floorNum < numOfFloors; floorNum++)
  {

    // calculate the floor from bottom, to add the correct image
    drawFloorImg("left_floor", numOfFloors - floorNum - 1);
        
    for (elevatorNum = 0; elevatorNum < numElevators; elevatorNum++){
        var elevator = new Image(elevatorWidth, floorHeight);
        elevator.src = "./assets/elevator_shaft.png";
        elevator.setAttribute("class", "floor");

        var src = document.getElementById("elementid");
        src.appendChild(elevator);
    }  

    drawFloorImg("right_floor", numOfFloors - floorNum - 1);
    drawElevatorsImg(numElevators);
  }
}


// this function adds the elevators images according to the num of elevators' input
function drawElevatorsImg( amount ) {

    for ( elevatorNum = 0 ; elevatorNum < amount ; elevatorNum ++){

        var elevator_img = "elevator" + elevatorNum ;
        document.getElementById(elevator_img).style.display = "block";
    }
}

// draws the right and left apartments of the specific floor (floorNum)
function drawFloorImg(side , floorNum) {

    var floor = new Image(apartmentWidth, floorHeight);
    floor.setAttribute("class", "floor");

    // due to UI design issues (different building background)
    if ( floorNum > FLOOR_IMAGES_STOCK ) {
        floorNum = ( floorNum % FIRST_SKY_IMAGE ) + FIRST_SKY_IMAGE;
    }

    floor.src = "./assets/" + side + "/" + floorNum + ".png";

    var src = document.getElementById("elementid");
    src.appendChild(floor);
}
    

// hides or displays the current timer div
function switchTimerDisplay(btnFloorNum){

    let currentTimer = arrayOfFloors[btnFloorNum].id;

    if (document.getElementById(currentTimer).style.display === "block"){
        document.getElementById(currentTimer).style.display = "none";
    }

    else{
        document.getElementById(currentTimer).style.display = "block";
    }
}



//////////////////// HELP FUNCTIONS ////////////////

// initializes arrays of floors and elevators
function setAllButtons() {

    // initialize all floors dictionaries
    for (floor = 0; floor < numOfFloors; floor++ ){

        arrayOfFloors[floor] = {
            id: "timerFloor" + floor,
            isTimerOn: false,
            interval: null,
            button: "btnFloor" + floor,
            redButton: "redBTNFloor" + floor,
        }; 

        createButtons(floor);
    }

    // initialize all elevators
    for (elevator = 0; elevator < numElevators; elevator++ ){
        arrayOfElevators[elevator] = {
            id: "elevator" + elevator,
            queue: [],
            isBusy: false,
            totalQueueTime: 0,
            globalInterval: null,
            currentFloor: Math.floor(Math.random() * Math.floor(numOfFloors)),   // random initial floor location of elevator
        };
        let currElevator = arrayOfElevators[elevator];
        document.getElementById(currElevator.id).style.top = convertFloorToCoordinate(currElevator.currentFloor);
    }

    firstInitial = false;
}


// returns the top % of the current floor, for the css position
function convertFloorToCoordinate(floorNum){  

    return (( HIGHEST_ELEVATOR_PERCENTAGE + (( numOfFloors - 1 - floorNum) * FLOOR_HEIGHT_PERCENTAGE)) + "%" );
}


// when calls the elevator - changes the button color and sets the timer
function onBTNpress(btnFloorNum){

    document.getElementById(arrayOfFloors[btnFloorNum].redButton).style.visibility="visible";

    let bestElevator = getNearestElevator(btnFloorNum);
    bestElevator.queue.push(btnFloorNum);

    calculateElevatorQueueTime(bestElevator, btnFloorNum);
    setSpecificFloorTimer(btnFloorNum, bestElevator);

    switchTimerDisplay(btnFloorNum);
}


// when adding a new floor to the queue - adds to totalQueueTime the current duration, and delay if needed
function calculateElevatorQueueTime(elevator, btnFloorNum){

    let finalDest; // initialize

    // gets the last destination of the elevator from its queue, with considering that the last element is 'btnFloorNum' itself 
    if (elevator.queue.length > 1) {
        finalDest = elevator.queue[elevator.queue.length - 2] 
    }
    else {
        finalDest = elevator.currentFloor;
    }

    // adds the current duration from the last destination of elevator to 'btnFloorNum'
    elevator.totalQueueTime += (Math.abs(btnFloorNum - finalDest) * timePerFloorInMilli );   
    
    if (elevator.queue.length > 0 && elevator.queue[0] !== btnFloorNum){
        elevator.totalQueueTime += delayAfterArrivalInMilli; // delay between floors.
    }

    if (elevator.interval == null){

        // sets global interval for the elevator's queue
        elevator.interval = setInterval( function checkTimerRight() {
            if (elevator.queue.length !== 0 && elevator.totalQueueTime > REFRESH_RATE){
                elevator.totalQueueTime -= REFRESH_RATE;
            }
                
            else{
                clearInterval(elevator.interval);
                elevator.interval = null;
            }
        
        }, REFRESH_RATE); // implements a countdown timer
    }
}


// returns the nearest elevator to the specific requested btnFloorNum (distance, not time)
function getNearestElevator(btnFloorNum){
    
    let minDistance = numOfFloors;
    let bestElevator = null;

    for (elevator = 0; elevator < numElevators; elevator++ ){

        let currElevator = arrayOfElevators[elevator];
        let finalDest = currElevator.queue.length !== 0 ? currElevator.queue[currElevator.queue.length - 1] : currElevator.currentFloor;
        let dist = Math.abs(btnFloorNum - finalDest);

        // checks if min value needs to be updated
        if (dist < minDistance) {

            minDistance = dist;
            bestElevator = currElevator;
        }
    }
    return bestElevator;
}


// sets countdown timer per requested floor
function setSpecificFloorTimer(requestedFloor, elevator){   

    let currFloor = arrayOfFloors[requestedFloor];
    let elevatorQueueTime = elevator.totalQueueTime;
    let currTime = elevatorQueueTime / SECOND_IN_MILLI ; 

    currFloor.interval = setInterval( function checkTimer() {

        if (currTime > 0){

            currTime = currTime - ( REFRESH_RATE / SECOND_IN_MILLI );  // updates the timer every interval ( REFRESH_RATE ) 
            currTime = currTime.toFixed(1);
            document.getElementById(currFloor.id).innerText = currTime;
        }

        else{
            clearInterval(currFloor.interval);
        }
    
    }, REFRESH_RATE);
}


// checks the validity of the user's inputs, and alerts if needed
function checkValues() {

    numOfFloors = document.getElementById("numOfFloors").value; // gets input from user
    numElevators = document.getElementById("numElevators").value;  // gets input from user

    if (numOfFloors == "" || numElevators == "")
        document.getElementById("alert").innerHTML = "You must fill all fields."; 

    else if (isNaN(numOfFloors) || isNaN(numElevators))
        document.getElementById("alert").innerHTML = "You must enter valid numbers. Please try again."; 

    else if ( numOfFloors < minFloors )
        document.getElementById("alert").innerHTML = "You must have at least " +  minFloors + " floors in your building. Please try again.";  // gets input from user

    else if ( numOfFloors > maxFloors )
        document.getElementById("alert").innerHTML = "Your building is too high and it might fall. Please enter a smaller number of floors (" + minFloors + "-" + maxFloors + ").";


    else if ( numElevators < minElevators )
        document.getElementById("alert").innerHTML = "Your tenants are old, you must create at least " + minElevators + " elevator. Please try again.";

    else if ( numElevators > maxElevators )
        document.getElementById("alert").innerHTML = "Sorry, this is too expansive and you can't afford this. Please enter a smaller number of elevators (" + minElevators + "-" + maxElevators + ").";

    // both bumners are good, building is ready to go
    else if ( (minFloors <= numOfFloors <= maxFloors) && ( minElevators <= numElevators <= maxElevators) )
        initialState();
}


// hides the configuration form before displaying the building
function hideForm() {
    document.getElementById("config").style.display = "none";  // gets input from user
}


// adds image of the green and red buttons, and a timer div, with attributes and eventListener, if any.
function createButtons(floor){

    let container = document.getElementById("buttons"); // to add elements to

    // computes specific 'top' css value, to locate floor's button 
    let computeCurrBTN = HIGHEST_BTN_PERCENTAGE + (PERCENTAGE_BETWEEN_BTNS * ( numOfFloors - 1 - floor )) ; 
    let BTNpercentage = computeCurrBTN + "%" ;

    createBTNElement(container, floor, "button", BTNpercentage);
    createBTNElement(container, floor, "redButton", BTNpercentage);

    // timer
    let timerId = "timerFloor" + floor;
    let timerElem = document.createElement("div");

    timerElem.setAttribute("class", "text-block");
    timerElem.id = timerId;

    container.appendChild(timerElem);

    let computeCurrTimer = computeCurrBTN + DIFFERENCE_BTN_AND_TIMER; // computes specific 'top' css value, to locate floor's timer
    let timerPercentage = computeCurrTimer + "%" ;

    let elementTimer = document.getElementById(arrayOfFloors[floor].id);
    elementTimer.style.top = timerPercentage;
}


// creates the correct button - green / red, with the specific location and id, and adds it to the container
function createBTNElement(container, floor, type, BTNpercentage){

    let btnImage = document.createElement("img");
    let elementBTN;

    if (type == "button"){

        btnImage.setAttribute("src","./assets/greenBTN.png");
        btnImage.setAttribute("class", "btnImg");

        let greenBtnId = "btnFloor" + floor;
        btnImage.id = greenBtnId;

        container.appendChild(btnImage);

        elementBTN = document.getElementById(arrayOfFloors[floor].button);
    }

    else if ( type == "redButton"){

        btnImage.setAttribute("src","./assets/redBTN.png");
        btnImage.setAttribute("class", "btnImgRED");

        let redBtnId = "redBTNFloor" + floor;
        btnImage.id = redBtnId;

        container.appendChild(btnImage);

        elementBTN = document.getElementById(arrayOfFloors[floor].redButton);
    }

    elementBTN.style.display = "block";
    elementBTN.style.top = BTNpercentage;

    elementBTN.addEventListener("click", onBTNpress.bind(this, floor), false);
}
