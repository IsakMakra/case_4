
//* intergers
let nIntervId; // stores the setInterval id to be later used to delete the interval
let timerIntervalId;
let questionNr = 0;

//* Booleans
let cancelQuestionFetch = true; // decides if the next question should be displayed
let firstInterval = true;

//* Arrays
let allPlayers = []; // Initialize an array to store the players
let usersWhoVoted = [];
let currentPlayers = {};

//* unchangabel varibles
const interval = 1000; //the interval time for the setInterval
const hostName = localStorage.getItem("name"); // hostname for the user whi created the game
const category = localStorage.getItem("category"); // category of the game
const serverCode = localStorage.getItem("serverCode"); // servercode for the game
const mainHtml = document.querySelector("main");
const homeBtn = document.querySelector("#home");

//the home button opens the dialog element to make sure if the host wants to quit the quiz
homeBtn.addEventListener("click", function quitQuiz() {
    document.querySelector("dialog").show();
    document.querySelector("dialog #quit").addEventListener("click", () => {
        window.location = "./index.html";
    })
})

document.querySelector("dialog #close").addEventListener("click", () => {
    document.querySelector("dialog").close();
})


//Starts to create the host page and track the joined players
async function startHostPage() {
    document.querySelector("#kategori").textContent += category;
    document.querySelector("#serverCode").textContent += serverCode;

    console.log(hostName, serverCode);

    //!fix so when the host refreshes it should come back to the quiz
    // const object = await fetchGameObject();


    nIntervId = setInterval(intervalFunction, interval, true, false);
}
startHostPage();


// This is the setInterval function wich diside if it should display players or display question
function intervalFunction(displayPlayer, displayQuestion) {
    //fetches players that join the lobby
    if (displayPlayer) {
        dispalyNewPlayers();
    }
    //nextQuestion should only be called one time per round
    //checkVotes get called every second to collect and save the votes 
    if (displayQuestion) {
        nextQuestion();
        checkVotes();
    }
}

//Fetches the gameobject with the differnt keys
async function fetchGameObject() {
    const response = await fetcha(`api/host.php?server_code=${serverCode}&host=${hostName}`, "GET");
    const data = await response.json();

    return data
}

async function dispalyNewPlayers() {
    const gameObject = await fetchGameObject();
    const newPlayers = gameObject.users
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

//Start quiz btn when clicked stops the interval and goes on to the questions
document.querySelector("#startQuiz").addEventListener("click", (e) => {
    clearInterval(nIntervId);
    nIntervId = null;
    incrementQuestionNr();

    nIntervId = setInterval(intervalFunction, interval, false, true);
})

//this function makes a new request for incrementing the currentquesiton number
//so the next question can be displayed
function incrementQuestionNr() {
    const nextQuestionBody = {
        next: 1,
        server_code: serverCode,
        host: hostName,
    }

    fetcha("api/host.php", "POST", nextQuestionBody);
}

async function nextQuestion() {
    // first time it is true so we can display the question, second time it is false so it doesent update every second
    if (cancelQuestionFetch) {
        cancelQuestionFetch = false;
        const gameObject = await fetchGameObject();
        displayQuestion(gameObject);
    }
}

function displayQuestion(object) {
    questionNumber = object.current_question_nr; //question number so we know which question to display
    const currentQuestion = object.quiz[questionNumber].question;
    const playingUsers = object.quiz[questionNumber].alternatives;
    console.log(object.quiz[questionNumber]);
    
    displayLeaderBoard(object.users);
    
    if (object.quiz[questionNumber] === "end") {

        window.removeEventListener("beforeunload", beforeUnloadHandler);
        endQuiz(object);
        return;
    }

    if (questionNumber >= 0 && questionNumber <= object.quiz.length) {
        window.addEventListener('beforeunload', beforeUnloadHandler);
    }

    function beforeUnloadHandler(event) {
        event.preventDefault();
        var customMessage = 'Are you sure you want to leave? Your quiz will be lost if you leave.';
        event.returnValue = customMessage; // Standard for most browsers
        return customMessage; // For some older browsers
    }

    //* Makes the new html for the display of questions
    mainHtml.innerHTML =
        `
        <header class="question">
            <h1>Vem kan Mest?</h1>
            <h3>Question ${questionNumber} / ${object.quiz.length - 1}</h3>
            <p>${currentQuestion}</p>
        </header>
        <section class="question" id="middleSection">
            <div class="voteContainer"></div>
            <div class="buttonContainer"></div>
        </section>
        <section class="question">
            <button id="nextBtn">Nästa fråga</button>
        </section>
    `;

    //* this gives eventlisteners to the buttons to be able to select the winner
    playingUsers.forEach(user => {
        const button = document.createElement("button");
        button.classList.add("playerBtn");
        button.id = user;
        button.textContent = user;
        button.addEventListener("click", function (e) {
            this.classList.add("winner");
            const winner = this.textContent;
            const winnerBody = {
                winner: winner,
                server_code: serverCode,
                host: hostName,
            }
            fetcha("api/host.php", "PATCH", winnerBody);
            document.querySelectorAll(".playerBtn").forEach(button => {
                button.setAttribute("disabled", true);
            })
        });
        mainHtml.querySelector(".buttonContainer").append(button);

        mainHtml.querySelector(".voteContainer").innerHTML +=
            `
        <div class="voteWrapper">
            <p class="voteNr" id="${user}">0</p>
            <h4>${user}</h4>
        </div>
        `
    })

    startTimer();

    mainHtml.querySelector("#nextBtn").addEventListener("click", function (e) {
        cancelQuestionFetch = true;
        firstInterval = true;
        Object.keys(currentPlayers).forEach(key => {
            delete currentPlayers[key];
        });
        usersWhoVoted = [];
        incrementQuestionNr();
        nextQuestion();
    })
}

function displayLeaderBoard(users, forever) {
    let number = 1;
    users.sort((a, b) => b.points - a.points);

    let leaderBoard = document.createElement("div");
    leaderBoard.setAttribute("id", "leaderBoard");
    leaderBoard.innerHTML = `<h3>Leaderboard</h3>`;
    let section = document.createElement("section");
    section.innerHTML = `
    <div id="metrics">
        <p>Rank</p>
        <p>Namn</p>
        <p>Poäng</p>
    </div>
    `;
    section.setAttribute("id", "leaderBoardBox");
    leaderBoard.append(section);

    users.forEach ((user) => {
        let user_dom = `
        <div class="player">
            <p class="leaderBoardNr">${number}.</p>
            <p class="leaderBoardName" style="color: ${user.color}; border: 2px solid ${user.color};">${user.username}</p>
            <p class="leaderBoardPoints">${user.points}</p>
        </div>
        `;
        section.innerHTML += user_dom;
        number++;
    })
    
    document.querySelector("body").append(leaderBoard);
    let main = document.querySelector("main");
    main.classList.add("hidden");

    if(!forever) {
        let second = 0
        leaderBoardIntervalId = setInterval(() => {
            if (second === 4) {
                clearInterval(leaderBoardIntervalId);
                leaderBoard.remove();
                main.classList.remove("hidden");
            }
    
            second++;
        }, interval);
    }
}

function endQuiz(object) {
    clearInterval(nIntervId);
    const players = object.users;

    const leaderboard = players.sort((a, b) => { return b.points - a.points });
    mainHtml.innerHTML =
        `
        <header class="question">
            <h1>Winners</h1>
            <h3>Good work ${leaderboard[0].username} you are the winner</h3>
        </header>
        <section class="question" id="middleSection">
            <div class="leaderboard"></div>
        </section>
        <section class="question">
            <button id="exitBtn">Avsluta Quiz</button>
        </section>
    `;
    leaderboard.forEach(user => {
        mainHtml.querySelector(".leaderboard").innerHTML += `<h4>User: ${user.username} Points: ${user.points}</h4>`
    })

    mainHtml.querySelector("#exitBtn").addEventListener("click", function (e) {
        clearLocalStorage();
        const deleteBody = {
            host: hostName,
            server_code: serverCode
        }
        fetcha("api/game.php", "DELETE", deleteBody);
        window.location = "./index.html";
    })
}

async function checkVotes() {
    const object = await fetchGameObject();
    const playingUsers = object.quiz[object.current_question_nr].alternatives;
    const allvotes = object.current_votes;

    if (object.quiz[object.current_question_nr] === "end") {
        return;
    }

    if (firstInterval) {
        firstInterval = false;
        //*creates a object to keep track of the playing users votes
        playingUsers.forEach(player => { currentPlayers[player] = 0 })
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
        voteNr.textContent = currentPlayers[playerName];
    })

    //* Checks if all the player have voted
    if (allvotes.length === object.users.length - playingUsers.length) {
        console.log("all players have voted");
    }
}


function startTimer() {
    let second = 0
    timerIntervalId = setInterval(() => {
        if (second === 34) {
            clearInterval(timerIntervalId)
            window.alert("times up");
        }
        second++;
    }, interval);
}