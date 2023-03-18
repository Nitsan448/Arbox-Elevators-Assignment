# Home assignment - elevators

## Table of Contents

- [How to run](#how-to-run)
- [Code design](#code-design)

## How to run

Clone the repository:
<pre><code>git clone https://github.com/Nitsan448/Arbox-Elevators-Assignment.git
</code></pre>

Install node modules:
<pre><code>cd ./Arbox-Elevators-Assignment
npm install
</code></pre>

Start the web app:
<pre><code>npm start
</code></pre>

## Project description

#### The main page of the app is the elevators.js file which is located in the src/pages folder.

The project manages the state of each elevator using an array called 'elevators'.</br>
 This array contains information such as the elevator's index, current floor, state, and a queue for its next destinations.

When a 'call' button is pressed, the elevator to be called is determined by checking which elevator will arrive first.</br>
This is done by calculating the time it will take the elevator to move between each destination in its queue,</br>
with the addition of the floor that called that elevator.

After an elevator receives an item in it's queue, it starts moving towards that floor,</br>
the elevator will always be at the first grid row,</br>
but it's position will be calculated according to the next floor it will arrive at in order to create the animation.

While the elevator is moving, it will update its current floor every 'floorTransitionTime' seconds.</br>
If it has arrived at its destination, it will update it's hasArrived state to true.

This will cause a new timeout to run after 2 seconds,</br>
which will change the elevator's hasArrived state back to false and remove the first destination from its queue.</br>
This enables it to either move to the next element in it's queue or wait for a new call if there isn't one.
