"use strict";

const interval = 1000; // 1000 milliseconds = 1 second
const password = localStorage.getItem("password");
const username = localStorage.getItem("name");
let allPlayers = []; // Initialize an array to store the players
let watingForGameToStart = true;
let intervalId;
let leaderBoardIntervalId = 0;
let timerIntervalId;
let q_nr = 0;

//Flags
let timerStarted = false;
let leaderBoardCreated = false;
let buttonsCreated = false;
let player_div_removed = false;

let mainContainer = document.querySelector("main");

window.addEventListener('beforeunload', beforeUnloadHandler);
document.querySelector(".home").addEventListener("click", () => {
    window.location = "../index.html";
})

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
    const currentQuestionNumber = dataObject.current_question_nr;

    if (q_nr != currentQuestionNumber) {
        leaderBoardCreated = false;
        timerStarted = false;
        // mainContainer.innerHTML = "";
        buttonsCreated = false;
        q_nr = currentQuestionNumber;
    }

    if (dataObject.quiz[currentQuestionNumber] === "start") {

        dispalyNewPlayers();

        async function dispalyNewPlayers() {
            const newPlayers = dataObject.users
            const length1 = allPlayers.length;
            const length2 = newPlayers.length;

            // if this is true there is a new players in the lobby and we dispaly their names
            if (length2 > length1) {
                const numOfNewPlayers = length2 - length1;
                const startIndex = length2 - numOfNewPlayers;
                const players = newPlayers.slice(startIndex, length2);
                //! give the players a color
                players.forEach(player => {
                    document.querySelector("#playerNames").innerHTML += `<p style="color: ${player.color}; border: 2px solid ${player.color};">${player.username}</p>`;
                });
            }
            // Update the player list
            allPlayers = newPlayers;
        }

        return;
    }

    if (dataObject.quiz[currentQuestionNumber] === "end") {
        clearInterval(intervalId);
        displayLeaderBoard(dataObject.users, true);
        return;
    }

    if (currentQuestionNumber == q_nr) {
        // if (!player_div_removed) {
        //     document.getElementById("players").remove();
        //     player_div_removed = true;
        // }

        displayLeaderBoard(dataObject.users, false);

        let userArray = dataObject.quiz[currentQuestionNumber].alternatives;
        console.log(currentQuestionNumber);
        // Iterate through userArray and update the content of <p> elements
        if (userArray.includes(username)) {
            //* här ändar vi layout för den som ska duellerar
            mainContainer.innerHTML = `<h3>Du ska spela</h3>`;
        }
        else {
            let questionNrInPercentage = currentQuestionNumber / dataObject.quiz.length * 100;
            let player = dataObject.users.find(objekt => objekt.username === username)
            mainContainer.classList.add("playerQuiz");
            if (!buttonsCreated) {
                document.querySelector("main").innerHTML =
                    `
                <div class="questionBarContainer">
                    <div class="questionBarChild" style="width: ${questionNrInPercentage}%;"></div>
                </div>
                <div class="cardContainer">
                    <h3>${dataObject.quiz[currentQuestionNumber].question}</h3>
                    <h4>RÖSTA</h4>
                </div>
                `
                document.querySelector("footer").innerHTML =
                    `
                <div class="scoreNameContainer">
                    <p>${player.points}</p>
                    <div id="playerIcon">${username[0].toLocaleUpperCase()}</div>
                    <p>${username}</p>
                </div>
                `

                userArray.forEach((user) => {
                    const playerColor = dataObject.users.find(objekt => objekt.username === user); // finds the right playerobject to get its color
                    const button = document.createElement("button");
                    button.classList.add("voteBtn");
                    button.style.color = playerColor.color;
                    button.style.borderColor = playerColor.color;
                    button.id = user;
                    button.textContent = user;
                    button.addEventListener("click", voteForPlayer)
                    document.querySelector(".cardContainer").append(button);
                });
                buttonsCreated = true;
            }

            if (!timerStarted) {
                startTimer();
                timerStarted = true;
            }
        }
    }
}

function displayLeaderBoard(users, forever) {
    if (!leaderBoardCreated) {
        leaderBoardCreated = true;
        let number = 1;
        users.sort((a, b) => b.points - a.points);

        let leaderBoard = document.createElement("div");
        leaderBoard.setAttribute("id", "leaderBoard");
        leaderBoard.innerHTML = `<h3>LEADERBOARD</h3>`;
        let section = document.createElement("section");
        section.innerHTML = `
        <div id="metrics">
            <p id="rank">Rank</p>
            <p id="name">Namn</p>
            <p id="points">Poäng</p>
        </div>
        `;
        section.setAttribute("id", "leaderBoardBox");
        leaderBoard.append(section);

        users.forEach((user) => {
            let user_dom = `
            <div class="player">
                <p class="leaderBoardNr">${number}.</p>
                <p class="leaderBoardName">${user.username}</p>
                <p class="leaderBoardPoints">${user.points}</p>
            </div>
            `;
            section.innerHTML += user_dom;
            number++;
        })

        document.querySelector("body").append(leaderBoard);
        let main = document.querySelector("main");
        main.classList.add("hidden");
        document.querySelector("footer").classList.add("hidden");

        if (!forever) {
            let second = 0
            leaderBoardIntervalId = setInterval(() => {
                if (second === 4) {
                    clearInterval(leaderBoardIntervalId);
                    leaderBoard.remove();
                    main.classList.remove("hidden");
                    document.querySelector("footer").classList.remove("hidden");
                }

                second++;
            }, interval);
        }
    }
}

function startTimer() {
    let second = 0
    timerIntervalId = setInterval(() => {
        if (second === 34) {
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
    let button = event.currentTarget;
    let playerColor = event.currentTarget.style.color;
    console.log(playerColor);
    button.style.backgroundColor = playerColor;
    button.style.color = "white";

    let response = await fetcha(`api/user.php?server_code=${password}`, "GET");
    let data = await response.json();
    let users = data.users;

    let foundUser = null;

    users.forEach(user => {
        if (user.username === votedPlayer) {
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
    } else {
        console.log("error");
    }
}
