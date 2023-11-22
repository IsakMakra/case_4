
let nIntervId; // stores the setInterval id to be later used to delete the interval
let allPlayers = []; // Initialize an array to store the players
let questionNr = 0;
let cancelQuestionFetch = true; // decides if the next question should be displayed
let firstInterval = true;
let usersWhoVoted = [];
let currentPlayers = {};

const interval = 1000; //the interval time for the setInterval
const playersArray = ["Adam", "Isak", "Kajsa", "Tanner", "jacob", "love", "mackan", "johan"];
const hostName = localStorage.getItem("name"); // hostname for the user whi created the game
const category = localStorage.getItem("category");
const serverCode = localStorage.getItem("serverCode"); // servercode for the game
const mainHtml = document.querySelector("main");


//Starts the functions to create the host page and track the joined players
async function startHostPage() {

    document.querySelector("#title").textContent = "Vem kan mest?";
    document.querySelector("#kategori").textContent = category;
    document.querySelector("#serverCode").textContent = serverCode;

    nIntervId = setInterval(myCallback, interval, true, false);
}
startHostPage();

// This is the setInterval function wich diside if it should display players or display question
function myCallback(displayPlayer, displayQuestion) {
    //fetches players that join the lobby
    if (displayPlayer) {
        dispalyNewPlayers();
    }

    //should only be one time per question
    if (displayQuestion) {
        nextQuestion();
        checkVotes();
    }
}

//Fetches the gameobject with the differnt keys
async function fetchGameObject() {
    const response = await fetcha(`api/host.php?server_code=${serverCode}&host=${hostName}`, "GET");

    const data = await response.json();
    console.log(data);

    return data
}

async function dispalyNewPlayers() {
    const gameObject = await fetchGameObject();
    const newPlayers = gameObject.users
    const length1 = allPlayers.length;
    const length2 = newPlayers.length;

    // if this is true there is new players in the lobby and we dispaly their names
    if (length2 > length1) {
        const numOfNewPlayers = length2 - length1;
        const startIndex = length2 - numOfNewPlayers;
        const players = newPlayers.slice(startIndex, length2);
        players.forEach(player => {
            document.querySelector("#playerNames").innerHTML += `<p>${player.username}</p>`;
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

    nIntervId = setInterval(myCallback, interval, false, true);
})


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

// displayQuestion()
function displayQuestion(object) {
    questionNr = object.current_question_nr; //question number so we know which question to display
    const currentQuestion = object.quiz[questionNr].question;
    const playingUsers = object.quiz[questionNr].alternatives;
    console.log(object.quiz[questionNr]);
    if (object.quiz[questionNr] === "end") {
        console.log("end quiz");
        endQuiz(object);
        return;
    }

    if (questionNr >= 0 && questionNr <= object.quiz.length) {
        window.addEventListener('beforeunload', function (event) {
            event.preventDefault();
            var customMessage = 'Are you sure you want to leave? Your quiz will be lost if you leave.';
            event.returnValue = customMessage; // Standard for most browsers
            return customMessage; // For some older browsers
        });
    }

    //* Makes the new html for the display of questions
    mainHtml.innerHTML =
        `
        <header class="question">
            <h1>Vem kan Mest?</h1>
            <h3>Question ${questionNr} / ${object.quiz.length - 1}</h3>
            <p>${currentQuestion}</p>
        </header>
        <section class="question" id="middleSection">
            <img src="" alt="">
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
        button.textContent = user;
        button.addEventListener("click", function (e) {
            console.log("winner");
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
    })

    mainHtml.querySelector("#nextBtn").addEventListener("click", function (e) {
        cancelQuestionFetch = true;
        incrementQuestionNr();
        nextQuestion();
    })
}

function endQuiz(object) {
    clearInterval(nIntervId);
    const players = object.users;

    const leaderboard = players.sort((a, b) => { return b.points - a.points });
    console.log(leaderboard);
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
        fetcha("api/.game.php", "DELETE", deleteBody);
        window.location = "./index.html";
    })
}

// {
//     "host": "Isak",
//     "id": 1,
//     "server_code": "7163",
//     "quiz": [],
//     "current_question_nr": 0,
//     "current_votes": [
//         {
//             "vote": "Isak",
//             "user": "Isak"
//         },
//         {
//             "vote": "Isak",
//             "user": "Adam"
//         }
//     ],
//     "users": [
//         {
//             "username": "Isak",
//             "points": 0
//         }
//     ],
//     "active": true
// }
async function checkVotes() {
    //*gå igenom currentvotes arrayen och lägg till de användare som har röstat och lägg en de i den andra arrayen userWhoVoted
    //*skapa en array eller objekt där du sparar hur många röster varje aktiv spelare har och uppdatera css efter det
    //*jämför hur lång allPlayers är genom hur lång userWhoVoted är för att veta så att alla har röstat
    //* uppdatera hosten om vem som inte har röstat?
    const object = await fetchGameObject();
    const players = object.quiz[object.current_question_nr].alternatives;
    const allvotes = object.current_votes;

    if (object.quiz[object.current_question_nr] === "end") {
        return;
    }

    if (firstInterval) {
        firstInterval = false;
        players.forEach(player => { currentPlayers[player] = 0 })
        console.log(currentPlayers);
    }

    // if (allvotes.length > 0) {
    allvotes.forEach(voteObject => {
        if (!usersWhoVoted.includes(voteObject.user)) {
            usersWhoVoted.push(user);
            currentPlayers[user]++
        }
    })
    // }
    // console.log(currentPlayers);
    if (allvotes.length === object.users.length - players.length) {
        console.log("all players have voted");
    }
}


function getRandomPlayers(players, users) {
    //! fix this function
    let playingUsers = users.splice(getRandomInt(users.length - 1), players);
    return playingUsers;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}