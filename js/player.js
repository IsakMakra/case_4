"use strict";

const interval = 1000; // 1000 milliseconds = 1 second
const password = localStorage.getItem("password");
const username = localStorage.getItem("name");
let allPlayers = []; // Initialize an array to store the players
let usersWhoVoted = [];
let currentPlayers = {};
let watingForGameToStart = true;
let intervalId;
let leaderBoardIntervalId = 0;
let timerIntervalId;
let q_nr = 0;
let homeBtn = document.querySelector(".home");

let allvotes = [
    {
        "vote": "pelle",
        "user": "sebbee"
    },
    {
        "vote": "pelle",
        "user": "lost"
    },
    {
        "vote": "hugo",
        "user": "wee"
    },
]

//Flags
let timerStarted = false;
let leaderBoardCreated = false;
let buttonsCreated = false;
let player_div_removed = false;
let firstInterval = true;

let mainContainer = document.querySelector("main");

window.addEventListener('beforeunload', beforeUnloadHandler);
homeBtn.addEventListener("click", function quitQuiz() {
    document.querySelector("dialog").show();
    document.querySelector("dialog #quit").addEventListener("click", () => {
        window.location = "./index.html";
    })
})

document.querySelector("dialog #close").addEventListener("click", () => {
    document.querySelector("dialog").close();
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
        // Iterate through userArray and update the content of <p> elements
        if (userArray.includes(username)) {
            //* här ändar vi layout för den som ska duellerar
            mainContainer.innerHTML = `
            <div id="playTime">
                <h3>DAGS</h3>
                <p>för</p>
                <h3>DUELL</h3>
            </div>
            `;
            document.querySelector("footer").innerHTML = " ";
        }
        else {
            // console.log("hej");
            if (!buttonsCreated) {
                firstInterval = true;
                let questionNrInPercentage = currentQuestionNumber / dataObject.quiz.length * 100;
                let player = dataObject.users.find(objekt => objekt.username === username)
                mainContainer.classList.add("playerQuiz");
                document.querySelector("main").innerHTML =
                    `
                <div class="questionBarContainer">
                    <div class="questionBarChild" style="width: ${questionNrInPercentage}%;"></div>
                </div>
                <div class="cardContainer">
                    <h3 class="questionPlayer">${dataObject.quiz[currentQuestionNumber].question}</h3>
                    <h4 class="questionPlayer">RÖSTA</h4>

                    <div class="votesAmount hidden"></div>
                </div>
                `
                document.querySelector("footer").innerHTML =
                    `
                <div class="scoreNameContainer">
                    <p>${player.points}</p>
                    <div id="playerIcon" style="background-color: ${player.color};">${username[0].toLocaleUpperCase()}</div>
                    <p>${username}</p>
                </div>
                `

                userArray.forEach((user) => {
                    const playerColor = dataObject.users.find(objekt => objekt.username === user); // finds the right playerobject to get its color
                    const button = document.createElement("button");
                    button.classList.add("voteBtn");
                    button.classList.add("questionPlayer");
                    button.style.color = playerColor.color;
                    button.style.borderColor = playerColor.color;
                    button.id = user;
                    button.textContent = user;
                    button.addEventListener("click", voteForPlayer)
                    document.querySelector(".cardContainer").append(button);
                });
                buttonsCreated = true;
                if (userArray.length === 2) {
                    let vs = document.createElement("p");
                    vs.classList.add("questionPlayer")
                    vs.textContent = "VS";
                    document.querySelector(".voteBtn").after(vs);
                }
            }
            checkVotes(dataObject);

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
            <div>
                <p id="rank">Rank</p>
                <div class="metricsIMG rank"></div>
            </div>
            <div>
                <p id="name">Namn</p>
                <div class="metricsIMG name"></div>
            </div>
            <div>
                <p id="points">Poäng</p>
                <div class="metricsIMG points"></div>
            </div>
        </div>
        `;
        section.setAttribute("id", "leaderBoardBox");
        leaderBoard.append(section);

        let player_wrapper = document.createElement("div");
        player_wrapper.setAttribute("id", "playerWrapper");
        section.append(player_wrapper);

        users.forEach((user) => {
            let user_dom = `
            <div class="player">
                <p class="leaderBoardNr">${number}.</p>
                <p class="leaderBoardName">${user.username}</p>
                <p class="leaderBoardPoints">${user.points}</p>
            </div>
            `;
            player_wrapper.innerHTML += user_dom;
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
    button.style.backgroundColor = playerColor;
    button.style.color = "white";
    document.querySelector(".votesAmount").classList.remove("hidden");
    document.querySelectorAll(".questionPlayer").forEach(element => {
        element.classList.add("hidden");
    })


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

async function checkVotes(object) {
    const playingUsers = object.quiz[object.current_question_nr].alternatives;
    // const allvotes = object.current_votes;
    // console.log(object);
    if (object.quiz[object.current_question_nr] === "end") {
        return;
    }

    if (firstInterval) {
        firstInterval = false;
        //*creates a object to keep track of the playing users votes
        playingUsers.forEach(player => { currentPlayers[player] = 0 })
        playingUsers.forEach((user) => {
            const playerColor = object.users.find(object => object.username === user); // finds the right playerobject to get its color

            document.querySelector(".votesAmount").innerHTML +=
                `
            <div class="voteContainer" style="color: ${playerColor.color}; border: 2px solid ${playerColor.color};">
                <p >${user}</p>
                <p class="voteNr" id=${user} style="color: ${playerColor.color};">0%</p>
            </div>
            `
        });

    }

    //! måste få alla röster via php isak
    //*double checks so a user cant vote multible times
    allvotes.forEach(voteObject => {
        if (!usersWhoVoted.includes(voteObject.user)) {
            usersWhoVoted.push(voteObject.user);
            currentPlayers[voteObject.vote]++
        }
    })

    //* this updates and displayes the votes for each player
    document.querySelectorAll(".voteNr").forEach(voteNr => {
        let playerName = voteNr.id;
        let playersPoints = currentPlayers[playerName];
        let pointsInPrecentage = playersPoints / allvotes.length * 100

        voteNr.textContent = Math.round(pointsInPrecentage) + "%";
    })

    //* Checks if all the player have voted
    if (allvotes.length === object.users.length - playingUsers.length) {
        console.log("all players have voted");
    }
}
