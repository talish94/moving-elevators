
//---------------- variables decaleration ---------------//

let audio = new Audio('./assets/ElevatorBell.mp3');

let timePerFloor = 4000;  // in miliseconds
let delayAfterArrival = 2000;  // in miliseconds

let firstInitial = true;

let arrayOfFloors = [];
let numOfFloors; // gets input from user

let arrayOfElevators = [];
let numElevators;  // gets input from user

let time_elapsed;

var elevatorWidth = 114;
var apartmentWidth = 395;
var floorHeight = 145;

let highestFloorTopBTN = 35; // always the same number
let highestFloorTopTimer = 45; // always the same number

//---------------- constants decaleration ---------------//

let ONE_SECOND = 1000;




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
    }, 100); 
}


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
            currentFloor: Math.floor(Math.random() * Math.floor(numOfFloors)),   // random initial place of elevator
            // currentFloor: 6
        };
        let currElevator = arrayOfElevators[elevator];
        document.getElementById(currElevator.id).style.top = convertFloorToPlace(currElevator.currentFloor);
    }

    firstInitial = false;
}

function drawBuilding()
{

  for (floorNum = 0; floorNum < numOfFloors; floorNum++)
  {

    drawFloorImg("left_floor", numOfFloors - floorNum - 1);
        
    for (elevatorNum = 0; elevatorNum < numElevators; elevatorNum++){
        var elevator = new Image(elevatorWidth, floorHeight);
        elevator.src = "./assets/single_elevator.png";
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


    if ( floorNum > 15 ){
        floorNum = floorNum - 10;
    }

    else if ( floorNum > 10 ) {
        floorNum = floorNum - 5;
    }

    floor.src = "./assets/" + side + "/" + floorNum + ".png";

    var src = document.getElementById("elementid");
    src.appendChild(floor);
}
    


function moveElevator(elevator, fromFloorNum, toFloorNum){

    elevator.isBusy = true;

    let topRate = convertFloorToPlace(toFloorNum);  
    document.getElementById(elevator.id).style.top = topRate;

    let time = (Math.abs(fromFloorNum - toFloorNum)) * timePerFloor;
    document.getElementById(elevator.id).style.transition = time + "ms ease-in-out"; // sets duration depends on distance between the 2 floors

    setTimeout(function(){ 
        completeMove(elevator, toFloorNum);
     }, time);  // only after the elevator gets to its destination

     return time;
}


// returns the top % of the current floor, for the css position
function convertFloorToPlace(floorNum){  

    return (( 18.3 + (( numOfFloors - 1 - floorNum) * 25.2)) + "%" );
}

// removes first element from queue and plays bell ring
function completeMove(elevator, toFloorNum){

    audio.play();
    document.getElementById(arrayOfFloors[toFloorNum].redButton).style.visibility="hidden";

    setTimer(toFloorNum);
    elevator.isBusy = true;

    setTimeout(function(){ 

        elevator.isBusy = false;
        elevator.currentFloor = elevator.queue.shift();

        if (elevator.queue.length === 0){
            elevator.totalQueueTime = 0;
        }

    }, delayAfterArrival);  // waits 2 seconds before ready to move again
}

// when calls the elevator - changes the button color and sets the timer
function onBTNpress(btnFloorNum){

    document.getElementById(arrayOfFloors[btnFloorNum].redButton).style.visibility="visible";

    let bestElevator = getBestElevator(btnFloorNum);
    bestElevator.queue.push(btnFloorNum);

    calculateElevatorQueueTime(bestElevator, btnFloorNum);
    setSpecificFloorTimer(btnFloorNum, bestElevator);

    setTimer(btnFloorNum);
}

// when adding a new floor to queue - adds to the totalQueueTime the current duration, and delay if needed (2s)
function calculateElevatorQueueTime(elevator, btnFloorNum){

    let finalDest; // initialize

    if (elevator.queue.length > 1){
        finalDest = elevator.queue[elevator.queue.length - 2]
    }
    else {
        finalDest = elevator.currentFloor;
    }

    elevator.totalQueueTime += (Math.abs(btnFloorNum - finalDest) * timePerFloor );   // global timer !
    
    if (elevator.queue.length > 0 && elevator.queue[0] !== btnFloorNum){
        elevator.totalQueueTime += delayAfterArrival; // delay between floors.
    }

    if (elevator.interval == null){

        // sets global interval for current elevator's queue
        elevator.interval = setInterval( function checkTimerRight() {
            if (elevator.queue.length !== 0 && elevator.totalQueueTime > 100){
                elevator.totalQueueTime -= 100;
            }
                
            else{
                clearInterval(elevator.interval);
                elevator.interval = null;
            }
        
        }, 100); // implements a countdown timer, every 100 ms
    }
}

// return the closest elevator to the specific requested btnFloorNum (distance, not time)
function getBestElevator(btnFloorNum){
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
    let currTime = elevatorQueueTime / ONE_SECOND ;  // converts ms to seconds, for display 

    currFloor.interval = setInterval( function checkTimer() {

        if (currTime > 0){

            console.log(currTime);
            currTime = currTime - 0.1;  // subtracts 0.1 second (100 ms) every interval 
            currTime = currTime.toFixed(1);
            document.getElementById(currFloor.id).innerText = currTime;
        }

        else{
            clearInterval(currFloor.interval);
        }
    
    }, 100);
}

// hides or displays the current timer div
function setTimer(btnFloorNum){

    let currentTimer = arrayOfFloors[btnFloorNum].id;

    if (document.getElementById(currentTimer).style.display === "block"){
        document.getElementById(currentTimer).style.display = "none";
    }

    else{
        document.getElementById(currentTimer).style.display = "block";
    }
}

// checks the validity of the user's inputs, and alerts if needed
function checkValues() {

    numOfFloors = document.getElementById("numOfFloors").value; // gets input from user
    numElevators = document.getElementById("numElevators").value;  // gets input from user

    if ( numOfFloors <= 0 )
        document.getElementById("alert").innerHTML = "You must have at least one floor in your building. Please try again.";  // gets input from user


    else if ( numOfFloors > 21 )
        document.getElementById("alert").innerHTML = "Your building is too high and it might fall. Please enter a smaller number of floors (1-21).";

    else if ( numElevators < 1 )
        document.getElementById("alert").innerHTML = "Your tenants are old, you must add at least one elevator. Please try again.";

    else if ( numElevators > 4 )
        document.getElementById("alert").innerHTML = "Sorry, this is too expansive and you can't afford this. Please enter a smaller number of elevators (1-4).";

    else if ( 1 <= numOfFloors <= 21 && 1 <= numElevators <= 4 )
        initialState();
}

function hideForm() {
    document.getElementById("config").style.display = "none";  // gets input from user
}


// adds image of the green and red buttons, with attributes and eventListener, if any.
function createButtons(floor){

    let containter = document.getElementById("buttons"); // to add elements to

    let computeTopBTN = highestFloorTopBTN + (24.9 * ( numOfFloors - 1 - floor )) ; // computes specific top value, to locate element
    console.log(computeTopBTN);
    let topBTN = computeTopBTN + "%" ;

    let greenBtnId = "btnFloor" + floor;
    let btnImage = document.createElement("img");

    btnImage.setAttribute("src","./assets/greenBTN.png");
    btnImage.setAttribute("class", "btnImg");
    btnImage.id = greenBtnId ;
    
    containter.appendChild(btnImage);

    let elementBTN = document.getElementById(arrayOfFloors[floor].button);
    elementBTN.addEventListener("click", onBTNpress.bind(this, floor), false);

    elementBTN.style.display = "block";
    elementBTN.style.top = topBTN;

    //////////////////////////////////

    let redBtnId = "redBTNFloor" + floor;
    let redBtnImage = document.createElement("img");

    redBtnImage.setAttribute("src","./assets/redBTN.png");
    redBtnImage.setAttribute("class", "btnImgRED");
    redBtnImage.id = redBtnId ;
    
    containter.appendChild(redBtnImage);

    let elementRedBTN = document.getElementById(arrayOfFloors[floor].redButton);
    elementRedBTN.style.top = topBTN;

    //////////////////////////////////

    let timerId = "timerFloor" + floor;
    let timerElem = document.createElement("div");

    timerElem.setAttribute("class", "text-block");
    timerElem.id = timerId;

    containter.appendChild(timerElem);

    let computeTopTimer = computeTopBTN + 5 ; // computes specific top value, to locate element
    let topTimer = computeTopTimer + "%" ;

    let elementTimer = document.getElementById(arrayOfFloors[floor].id);
    elementTimer.style.top = topTimer;
}