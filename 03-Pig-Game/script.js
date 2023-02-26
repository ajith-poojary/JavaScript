"use strict";

const player0El = document.querySelector(".player--0");
const player1El = document.querySelector(".player--1");
const score0El = document.getElementById("score--0"); // selecting the element using Id selector

const score1El = document.querySelector("#score--1"); // instead of dot, now # cz srore--1 is id

const current0El = document.getElementById("current--0");
const current1El = document.getElementById("current--1");

const diceEl = document.querySelector(".dice");

const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");

//initial set up, setting default score to zero
// score0El.textContent = 0;
// score1El.textContent = 0;

// let playing = true; // holding the state of game

//hiding the image of dice-->initially, so created hidden element in css file
// diceEl.classList.add("hidden");

// let currentScore = 0; //score of the player
// let activePlayer = 0; // 0--> player 0, 1---> player 1

// const totalScores = [0, 0]; //score of the player 1 is stored in zeroth index, 2nd player scrore is stored in 1st index

//default state of the program/initializing the game setup

let playing, currentScore, activePlayer, totalScores;

const init = function () {
  totalScores = [0, 0];

  playing = true;
  currentScore = 0;
  activePlayer = 0;

  score0El.textContent = 0;
  score1El.textContent = 0;

  current0El.textContent = 0;
  current1El.textContent = 0;

  diceEl.classList.add("hidden");
  player0El.classList.remove("player--winner");
  player1El.classList.remove("player--winner");
  player0El.classList.add("player--active");
  player1El.classList.remove("player--active");
};
init();

//switching the player functionality
const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  //switch to next player
  activePlayer = activePlayer == 0 ? 1 : 0; // assuming active player is zero, if zero switch it 1, else switvh to zero

  player0El.classList.toggle("player--active");
  player1El.classList.toggle("player--active");
};

//implementing rolling die functionality

btnRoll.addEventListener("click", function () {
  if (playing) {
    //Generating the random diceNumber
    const dice = Math.trunc(Math.random() * 6) + 1;

    //display the dice number
    diceEl.classList.remove("hidden");
    diceEl.src = `dice-${dice}.png`;

    // check if dice roll is 1, if true switch to next player, else add the score to the current source

    if (dice !== 1) {
      //add the dice number to the current score

      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      // document.getElementById(`current--${activePlayer}`).textContent = 0;
      // currentScore = 0;
      // //switch to next player
      // activePlayer = activePlayer == 0 ? 1 : 0; // assuming active player is zero, if zero switch it 1, else switvh to zero

      // player0El.classList.toggle("player--active");
      // player1El.classList.toggle("player--active");
      switchPlayer();
    }
  }
});

//implementing holding button functionality

btnHold.addEventListener("click", function () {
  if (playing) {
    // add the current score to player score
    totalScores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      totalScores[activePlayer];

    // check if the scores>=100
    if (totalScores[activePlayer] >= 100) {
      //Finish the game
      playing = false;
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add("player--winner");
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add("player--active");

      // hiding the dice image, once the game completes
      diceEl.classList.add("hidden");
    } else {
      // switching the player
      switchPlayer();
    }
  }
});

//Reseting the game

btnNew.addEventListener("click", init);
