"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

const account1 = {
  owner: "Ajith Poojary",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Ganesh M",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Chandan Gowda",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Jayakumar Mr",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// const now = new Date();
// const year = now.getFullYear();
// const month = now.getMonth() + 1;
// const day = now.getDate();
// const hours = now.getHours();
// const minutes = now.getMinutes();

const displayMovements = function (movements, sort = false) {
  //clearing the old transaction , i,e initial trastaction block made during project setup
  containerMovements.innerHTML = " ";
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (element, i) {
    const type = element > 0 ? "deposit" : "withdrawal";
    const html = ` <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${element.toFixed(2)}\u{20AC}</div>
  </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//Generating the user names
const createUserNmaes = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUserNmaes(accounts);
// calculating and displying the total balance for a currently logged in user

const calDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(
    (accumaltor, currentEl) => accumaltor + currentEl,
    0
  );
  labelBalance.textContent = `${acc.balance.toFixed(2)}\u{20AC} `;
};

// calulating the sumary, total deposit, withdrawal and interest
const calDisplaySummary = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const outgoing = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);

  //calulating interset on each deposit-->1.2%
  //interset below one are discarded

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1) //interset below 1 is filtered
    .reduce((acc, interest) => acc + interest, 0);

  labelSumIn.textContent = `${income.toFixed(2)}\u{20AC}`;
  labelSumOut.textContent = `${outgoing.toFixed(2)}\u{20AC}`;
  labelSumInterest.textContent = `${interest.toFixed(2)}\u{20AC}`;
};

//refactor --> creating one generic function to updateUI

const updateUI = function (currentAcount) {
  if (currentAcount) {
    calDisplaySummary(currentAcount);
    displayMovements(currentAcount.movements);
    calDisplayBalance(currentAcount);
  }
};

//implementing the login features

let currentAcount, timer;
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAcount = accounts.find(
    (acc) =>
      acc.userName === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );

  if (currentAcount) {
    //Display the UI and welcome the user
    labelWelcome.textContent = `Welcome back , ${currentAcount.owner
      .split(" ")
      .at(0)} 🤩`;

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    };
    const locale = navigator.language;
    console.log(locale);
    containerApp.style.opacity = 100;
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );

    //clearing the input field
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    // labelDate.textContent = `${day}/${month}/${year}, ${hours}:${minutes}`;

    //loading the account details, once the customer login
    // calDisplaySummary(currentAcount);
    // displayMovements(currentAcount.movements);
    // calDisplayBalance(currentAcount);
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    updateUI(currentAcount);
  }
});

//implementing the transferof money--> sending money tothe other user

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  let amount = Number(inputTransferAmount.value);
  let receiverAccount = accounts.find(
    (acc) => acc.userName === inputTransferTo.value
  );

  inputTransferTo.value = inputTransferAmount.value = "";
  // console.log(amount, receiverAccount);

  // if (amount < 0) {
  //   alert("Transatctions failed..Negative denomination not allowed");
  // }
  if (
    amount > 0 &&
    receiverAccount &&
    currentAcount.balance >= amount &&
    currentAcount.userName !== receiverAccount.userName
  ) {
    console.log("Valid transatctions");
    currentAcount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    //updating the UI
    updateUI(currentAcount);
  } else {
    alert("Transatctions failed ⛔");
  }

  //reseting timer
  clearInterval(timer);
  timer = startLogoutTimer();
});

//closing the account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAcount.userName &&
    Number(inputClosePin.value) == currentAcount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.userName === currentAcount.userName
    );

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
  labelWelcome.textContent = `Account deleted sucessfully!!`;
});

//implementing loan feature
// to grant loan --at least one deposit must be greater than 10% of int
//aproval of loan takes so time, so inclding timer

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAcount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // add the loan ammount to currentAccount and update the UI
    //loan approval taking 2.5 sec
    setTimeout(function () {
      currentAcount.movements.push(amount);
      updateUI(currentAcount);
    }, 2500);
  }
  inputLoanAmount.value = "";

  //reseting timer
  clearInterval(timer);
  timer = startLogoutTimer();
});

//implementing sort functionality

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAcount.movements, !sorted);
  sorted = !sorted;

  //reseting timer
  clearInterval(timer);
  timer = startLogoutTimer();
});

// implementing logout functionality
const startLogoutTimer = function () {
  //set time to 5 minute

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //in each call print the remaining timer to UI
    labelTimer.textContent = `${min}:${sec}`;
    // when time equal to zero , logout-->hide the UI
    if (time === 0) {
      containerApp.style.opacity = 0;
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
    }
    //decrease 1s
    time--;
  };
  let time = 500;
  tick();

  //call the timer every second
  let timerVal = setInterval(tick, 1000);
  //   const min = String(Math.trunc(time / 60)).padStart(2, 0);
  //   const sec = String(time % 60).padStart(2, 0);
  //   //in each call print the remaining timer to UI
  //   labelTimer.textContent = `${min}:${sec}`;
  //   //decrease 1s
  //   time--;
  //   // when time equal to zero , logout-->hide the UI
  //   if (time === 0) {
  //     containerApp.style.opacity = 0;
  //     clearInterval(timer);
  //     labelWelcome.textContent = `Log in to get started`;
  //   }
  // }, 1000);
  return timerVal;
};
