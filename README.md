# moving-elevators

The program implements a state machine that consists of three states: initialState, moveElevator, and completeMove.

When clicking on a floor button:
* The button turns to red,
* The algorithm computes the distances from each elevator,
* The closest elevator starts moving towards the required floor,
* Displays a timer that shows the time remaining untill the elevator will arrive.

When the elevator arrives to the floor:
* A bell sound plays,
* The button turns green again,
* The elevator waits for 2 seconds untill it can handle next call, if there is one.

