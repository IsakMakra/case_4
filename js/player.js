"use strict";

const interval = 1000; // 1000 milliseconds = 1 second
const password = localStorage.getItem("password");
const username = localStorage.getItem("name");
document.querySelector("#namn").textContent = username;
let watingForGameToStart = true;
let intervalId;
let leaderBoardIntervalId = 0;
let timerIntervalId;
let q_nr = 0;

let timerStarted = false;
let leaderBoardCreated = false;
let buttonsCreated = false;
let usersContainer = document.querySelector("#users");

window.addEventListener('beforeunload', beforeUnloadHandler);

function beforeUnloadHandler(event) {
    event.preventDefault();
    var customMessage = 'Are you sure you want to leave? Your points will not be saved.';
    event.returnValue = customMessage; // Standard for most browsers
    return customMessage; // For some older browsers
}

async function fetchData() {
    let response = await fetcha(`api/user.php?server_code=${password}`, "GET");
    let data = await response.json();
    return data
}

async function startPlayerPage() {
    intervalId = setInterval(callBack, interval);
}
startPlayerPage();

async function callBack() {
    const dataObject = await fetchData()
    const currentQuestionuestionNumber = dataObject.current_question_nr;

    if(q_nr != currentQuestionuestionNumber) {
        leaderBoardCreated = false;
        timerStarted = false;
        usersContainer.innerHTML = "";
        buttonsCreated = false;
        displayLeaderBoard(dataObject.users);
        q_nr = currentQuestionuestionNumber;
    }

    if (dataObject.quiz[currentQuestionuestionNumber] === "start") {
        document.getElementById("feedback").textContent = "Väntar på att spelet ska starta";
        return;
    }

    if (dataObject.quiz[currentQuestionuestionNumber] === "end") {
        document.getElementById("feedback").textContent = "Quizet är slut";
        clearInterval(intervalId);
        return;
    }

    if (currentQuestionuestionNumber == q_nr) {
        displayLeaderBoard(dataObject.users);
        
        document.getElementById("feedback").textContent = dataObject.quiz[currentQuestionuestionNumber].question;
        let userArray = dataObject.quiz[currentQuestionuestionNumber].alternatives;

        // Iterate through userArray and update the content of <p> elements
        if (userArray.includes(username)) {
            usersContainer.innerHTML = "Du ska spela"
        } 
        else {
            
            if(!buttonsCreated) {
                userArray.forEach((user) => {
                    const button = document.createElement("button");
                    button.classList.add("voteBtn");
                    button.id = user;
                    button.textContent = user;
                    button.addEventListener("click", voteForPlayer)
                    usersContainer.append(button);
                });
                buttonsCreated = true;
            }
    
            if(!timerStarted) {
                startTimer();
                timerStarted = true;
            }
        }
    }
}

function displayLeaderBoard(users) {
    if(!leaderBoardCreated) {
        leaderBoardCreated = true;
        let number = 1;
        users.sort((a, b) => b.points - a.points);
    
        let leaderBoard = document.createElement("div");
    
        users.forEach ((user) => {
            let p = `<p>${number}. <b style="background-color: ${user.color}">${user.username}</b>, Points: ${user.points}</p>`
            leaderBoard.innerHTML += p;
            number++;
        })
    
        document.querySelector("body").append(leaderBoard);
        let main = document.querySelector("main");
        main.classList.add("hidden");
    
        let second = 0
        leaderBoardIntervalId = setInterval(() => {
            if (second === 5) {
                clearInterval(leaderBoardIntervalId);
                leaderBoard.remove();
                main.classList.remove("hidden");
            }
    
            second++;
        }, interval);
    }
}

function startTimer() {
    let second = 0
    timerIntervalId = setInterval(() => {
        if (second === 10) {
            clearInterval(timerIntervalId)
            document.querySelectorAll(".voteBtn").forEach(btn => {
                btn.setAttribute("disabled", true);
            })
        }

        second++;
    }, interval);
}

async function voteForPlayer(event) {
    let votedPlayer = event.target.textContent;

    let response = await fetcha(`api/user.php?server_code=${password}`, "GET");
    let data = await response.json();
    console.log(data.users);
    let users = data.users;

    let foundUser = null;

    users.forEach(user => {
        if (user.username === votedPlayer) {
            console.log("10 points to slytherin!");
            foundUser = user;
        }
    })

    if (foundUser) {
        let infoData = {
            server_code: password,
            vote: votedPlayer,
            user: username
        };

        document.querySelectorAll(".voteBtn").forEach(btn => {
            btn.setAttribute("disabled", true);
        })

        let response2 = await fetcha(`api/user.php`, "POST", infoData);
        let data2 = await response2.json();
        console.log(data2);
    } else {
        console.log("oops");
    }
}
