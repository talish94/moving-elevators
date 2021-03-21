

let audio = new Audio('/assets/ElevatorBell.mp3');

let timePerFloor = 4;  // in seconds
let delayAfterArrival = 2000;  // in miliseconds

let firstInitial = true;

let arrayOfFloors = [];
let numOfFloors = 7; // default.

let arrayOfElevators = [];
let numElevators = 2;

let time_elapsed;

initialState();

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

        let elementBTN = document.getElementById(arrayOfFloors[floor].button);
        elementBTN.addEventListener("click", onBTNpress.bind(this, floor), false);
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
        };
        let currElevator = arrayOfElevators[elevator];
        document.getElementById(currElevator.id).style.top = convertFloorToPlace(currElevator.currentFloor);
    }

    firstInitial = false;
}

function initialState(){

    if (firstInitial){
        setAllButtons();
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



function moveElevator(elevator, fromFloorNum, toFloorNum){

    elevator.isBusy = true;

    let topRate = convertFloorToPlace(toFloorNum);  
    document.getElementById(elevator.id).style.top = topRate;

    let time = (Math.abs(fromFloorNum - toFloorNum)) * timePerFloor;
    document.getElementById(elevator.id).style.transition = time + "s ease-in-out"; // sets duration depends on distance between the 2 floors

    setTimeout(function(){ 
        completeMove(elevator, toFloorNum);
     }, time * 1000);  // only after the elevator gets to its destination

     return time;
}


// returns the top % of the current floor
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
    setTimer(btnFloorNum);

    setSpecificFloorTimer(btnFloorNum, bestElevator);
}

// when adding a new floor to queue - adds to the totalQueueTime the current duration, and delay if needed (2s)
function calculateElevatorQueueTime(elevator, btnFloorNum){

    let finalDest = -1; // initialize

    if (elevator.queue.length > 1){
        finalDest = elevator.queue[elevator.queue.length - 2]
    }
    else {
        finalDest = elevator.currentFloor;
    }

    elevator.totalQueueTime += (Math.abs(btnFloorNum - finalDest) * timePerFloor * 1000);   // global timer !
    
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
        
        }, 100); // implements a countdown timer
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
    let currTime = elevatorQueueTime / 1000 ;

    currFloor.interval = setInterval( function checkTimer() {

        if (currTime > 0){

            console.log(currTime);
            currTime = currTime - 0.1;
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
