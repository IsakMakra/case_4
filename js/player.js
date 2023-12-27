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


//Flags
let leaderBoardCreated = false;
let buttonsCreated = false;
let player_div_removed = false;
let firstInterval = true;
let pageCreated = false;

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
        pageCreated = false;
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

        displayLeaderBoard(dataObject.users);

        let userArray = dataObject.quiz[currentQuestionNumber].alternatives;
        // Iterate through userArray and update the content of <p> elements
        if (userArray.includes(username)) {
            //* här ändar vi layout för den som ska duellerar
            if (!pageCreated) {
                pageCreated = true;
                mainContainer.innerHTML = `
                <div id="playTime">
                    <p class="h1">DAGS</p>
                    <p class="h2NoMargin">för</p>
                    <p class="h1">DUELL</p>
                </div>
                `;
                document.querySelector("footer").innerHTML = " ";
                usersWhoVoted = [];
            }

        }
        else {
            if (!buttonsCreated) {
                firstInterval = true;
                usersWhoVoted = [];
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
        leaderBoard.innerHTML = `<p class="h2">LEADERBOARD</p>`;
        let section = document.createElement("section");
        section.innerHTML = `
        <div id="metrics">
            <div>
                <p id="rank" class="pppp">Rank</p>
                <div class="metricsIMG rank"></div>
            </div>
            <div>
                <p id="name" class="pppp">Namn</p>
                <div class="metricsIMG name"></div>
            </div>
            <div>
                <p id="points" class="pppp">Poäng</p>
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
                <p class="leaderBoardNr h4">${number}.</p>
                <p class="leaderBoardName h4">${user.username}</p>
                <p class="leaderBoardPoints h4">${user.points}</p>
            </div>
            `;
            player_wrapper.innerHTML += user_dom;
            number++;
        })

        document.querySelector("body").append(leaderBoard);
        let main = document.querySelector("main");
        main.id = "hidden";
        document.querySelector("footer").classList.add("hidden");

        if (!forever) {
            let second = 0
            leaderBoardIntervalId = setInterval(() => {
                if (second === 4) {
                    clearInterval(leaderBoardIntervalId);
                    leaderBoard.remove();
                    main.id = " ";
                    document.querySelector("footer").classList.remove("hidden");
                }

                second++;
            }, interval);
        } else {
            let top3Winners = document.querySelectorAll(".player");
            for (let i = 0; i < 3; i++) {
                top3Winners[i].classList.add("winner" + i);
            }
        }
    }
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
    const allvotes = object.current_votes;
    console.log(allvotes);
    if (object.quiz[object.current_question_nr] === "end") {
        return;
    }

    if (firstInterval) {
        firstInterval = false;
        //*creates a object to keep track of the playing users votes
        playingUsers.forEach(player => { currentPlayers[player] = 0 })
        allvotes.forEach(voteObject => {
            if (voteObject.user === username) {
                usersWhoVoted.push(voteObject.user);
                currentPlayers[voteObject.vote]++
                document.querySelector(".votesAmount").classList.remove("hidden");
                document.querySelectorAll(".questionPlayer").forEach(element => {
                    element.classList.add("hidden");
                })
            }
        })
        playingUsers.forEach((user) => {
            const playerColor = object.users.find(object => object.username === user); // finds the right playerobject to get its color

            document.querySelector(".votesAmount").innerHTML +=
                `
            <div class="voteContainer" style="color: ${playerColor.color}; border: 2px solid ${playerColor.color};">
                <p >${user}</p>
                <p class="voteNr" id=${user} style="color: ${playerColor.color};">0</p>
            </div>
            `
        });

    }

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
        // let pointsInPrecentage = playersPoints / allvotes.length * 100

        voteNr.textContent = playersPoints;
    })
}
