


var audio = new Audio('/assets/ElevatorBell.mp3');

function startMusic() {
    audio.play();
}

function elevatorArrived(floorNum) {

    const btnFloor = "redBTNFloor" + floorNum;

    startMusic();
    document.getElementById(btnFloor).style.visibility="hidden";
}


const btnLeft0 = document.getElementById("btnFloor0");
btnLeft0.addEventListener("click", function() {
    document.getElementById("elevatorRight").style.top = "140%";
    document.getElementById("redBTNFloor0").style.visibility="visible";

    setTimeout(function(){ 
        elevatorArrived(0);
     }, 4000);
});

const btnLeft1 = document.getElementById("btnFloor1");
btnLeft1.addEventListener("click", function() {
    document.getElementById("elevatorLeft").style.top = "122%";
    document.getElementById("redBTNFloor1").style.visibility="visible";

    setTimeout(function(){ 
        elevatorArrived(1);
     }, 4000);
});

const btnLeft2 = document.getElementById("btnFloor2");
btnLeft2.addEventListener("click", function() {

    document.getElementById("elevatorLeft").style.top = "102%";
    document.getElementById("redBTNFloor2").style.visibility="visible";

    setTimeout(function(){ 
        elevatorArrived(2);
     }, 4000);
});

const btnLeft3 = document.getElementById("btnFloor3");
btnLeft3.addEventListener("click", function() {

    document.getElementById("elevatorLeft").style.top = "82%";
    document.getElementById("redBTNFloor3").style.visibility="visible";

    setTimeout(function(){ 
        elevatorArrived(3);
     }, 4000);
});

const btnLeft4 = document.getElementById("btnFloor4");
btnLeft4.addEventListener("click", function() {

    document.getElementById("elevatorLeft").style.top = "62%";
    document.getElementById("redBTNFloor4").style.visibility="visible";

    setTimeout(function(){ 
        elevatorArrived(4);
     }, 4000);
});

const btnLeft5 = document.getElementById("btnFloor5");
btnLeft5.addEventListener("click", function() {

    document.getElementById("elevatorLeft").style.top = "42%";
    document.getElementById("redBTNFloor5").style.visibility="visible";

    setTimeout(function(){ 
        elevatorArrived(5);
     }, 4000);
});

const btnLeft6 = document.getElementById("btnFloor6");
btnLeft6.addEventListener("click", function() {

    document.getElementById("elevatorLeft").style.top = "21%";
    document.getElementById("redBTNFloor6").style.visibility="visible";

    setTimeout(function(){ 
        elevatorArrived(6);
     }, 4000);
});


