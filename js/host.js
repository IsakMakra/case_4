
//* intergers
let nIntervId; // stores the setInterval id to be later used to delete the interval
let questionNr = 0;
let started = false;

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
const homeBtn = document.querySelector(".home");



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

    mainHtml.innerHTML =
        `
    <section class="lobby">
            <p id="serverCode" class="h2">LOBBY ID: <span class="serverCode">${serverCode}</span></p>
            <div id="kategoryBox">
                <p class="h2NoMargin">KATEGORI</p>
                <div class="categoryImgTextBox">
                    <div class="iconInLobby"></div>
                    <p id="kategori" class="h4">${category}</p>
                </div>
            </div>
        </section>
        <section id="players">
            <div class="playersTextIconContainer">
                <p class="h3">SPELARE</p>
                <div class="timeGlass"></div>
            </div>
            <div id="playerNames">
            </div>
        </section>
        <p class="message"></p>
    `
    document.querySelector("footer").innerHTML =
        `
    <button id="startQuiz" class="allBtn buttonNext">STARTA</button>
    `
    document.querySelector(".iconInLobby").classList.add(category);

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
        // checkVotes();
    }
}

//Fetches the gameobject with the differnt keys
async function fetchGameObject() {
    const response = await fetcha(`api/host.php?server_code=${serverCode}&host=${hostName}`, "GET");
    // const response = await fetcha(`api/host.php?server_code=6739&host=addeee`, "GET");
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
    console.log(allPlayers);
    if (allPlayers.length < 4) {
        document.querySelector(".message").innerHTML = "Det måste vara minst 4 spelare för att starta quizet";
        return
    }
    document.querySelector(".steps").classList.add("hidden")
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
        console.log(gameObject);
        displayQuestion(gameObject);
    }
}

function displayQuestion(object) {
    let questionNumber = object.current_question_nr; //question number so we know which question to display

    if (!started) {
        document.querySelector(".joinLobby").classList.add("started");
        started = true;
    }

    const currentQuestion = object.quiz[questionNumber].question;
    const playingUsers = object.quiz[questionNumber].alternatives;


    if (object.quiz[questionNumber] === "end") {
        window.removeEventListener("beforeunload", beforeUnloadHandler);
        clearInterval(nIntervId);
        displayLeaderBoard(object.users, true);
        return;
    }
    displayLeaderBoard(object.users);

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

    let questionNrInPercentage = questionNumber / object.quiz.length * 100;
    document.querySelector("main").innerHTML =
        `
    <div class="questionBarContainer">
        <div class="questionBarChild" style="width: ${questionNrInPercentage}%;"></div>
    </div>
    <div class="cardContainer">
        <h3>${currentQuestion}</h3>
    </div>
    `
    document.querySelector("footer").innerHTML =
        `
        <button id="startGameBtn" class="allBtn">STARTA SPELET</button>
    `

    //* this gives eventlisteners to the buttons to be able to select the winner
    createPlayerBtn(playingUsers, object, false)

    document.querySelector("#startGameBtn").addEventListener("click", () => {
        if (20) {
            document.querySelector("main").innerHTML =
                `
        <div class="cardContainer timer">
            <p class="h2">DUELLDAGS</p> 
            <div class="timerIcon"></div>
            <div id="timerContainer">
                <div class="timerValue" id="timerdef">0</div>
                <div class="timerValue" id="timerdef">0</div>
                <span class="timerValue">:</span>
                <div class="timerValue" id="timer1"></div>
                <div class="timerValue" id="timer2"></div>
            </div>
        </div>
        `
            document.querySelector("footer").innerHTML =
                `
        <button id="nextBtn" class="allBtn startTimer">STARTA TIMER</button>
        `
            document.querySelector(".startTimer").addEventListener("click", () => {
                startTimer(20).then(() => {
                    // Code to execute after the timer ends
                    displayChooseWinner();
                })
            })
        } else {
            displayChooseWinner()
        }

        function displayChooseWinner() {
            document.querySelector("main").innerHTML =
                `
            <div class="cardContainer vinnare">
                <p class="h2">VÄLJ VINNARE</p>
            </div>
            `
            document.querySelector("footer").innerHTML =
                `
            <button id="nextBtn" class="allBtn">NÄSTA FRÅGA</button>
            `
            createPlayerBtn(playingUsers, object, true)

            document.querySelector("#nextBtn").addEventListener("click", () => {
                cancelQuestionFetch = true;
                firstInterval = true;
                Object.keys(currentPlayers).forEach(key => {
                    delete currentPlayers[key];
                });
                usersWhoVoted = [];
                document.querySelector(".cardContainer").classList.remove("vinnare")
                incrementQuestionNr();
                nextQuestion();
            })
        }

    })

}

function createPlayerBtn(playingUsers, object, decider) {
    playingUsers.forEach(user => {
        const playerColor = object.users.find(objekt => objekt.username === user);
        const button = document.createElement("button");
        button.classList.add("playerBtn");
        button.id = user;
        button.textContent = user;
        button.style.color = playerColor.color;
        button.style.borderColor = playerColor.color;
        if (decider) {
            button.addEventListener("click", function (e) {
                let playerColor = e.currentTarget.style.color;
                button.style.backgroundColor = playerColor;
                button.style.color = "white";
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
            })

        }

        mainHtml.querySelector(".cardContainer").append(button);
    })

    if (playingUsers.length === 2) {
        let vs = document.createElement("p");
        vs.textContent = "VS";
        document.querySelector(".playerBtn").after(vs);
    }
}

function displayLeaderBoard(users, forever) {
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
    } else {
        let top3Winners = document.querySelectorAll(".player");
        for (let i = 0; i < 3; i++) {
            top3Winners[i].classList.add("winner" + i);
        }

        let quitQuiz = document.createElement("button");
        quitQuiz.classList.add("allBtn");
        quitQuiz.textContent = "AVSULTA QUIZ";
        quitQuiz.addEventListener("click", function (e) {
            clearLocalStorage();
            const deleteBody = {
                host: hostName,
                server_code: serverCode
            }
            fetcha("api/game.php", "DELETE", deleteBody);
            window.location = "./index.html";
        })
        section.after(quitQuiz);
    }

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

function startTimer(seconds) {


    // Update timers and divs every second
    const intervalId = setInterval(() => {
        let timer1 = seconds[0];
        let timer2 = seconds[1];
        seconds--;

        if (seconds < 10) {
            document.getElementById('timer2').textContent = seconds;
            document.getElementById('timer1').textContent = 0;
        } else {
            // Display updated values in divs
            document.getElementById('timer1').textContent = timer1;
            document.getElementById('timer2').textContent = timer2;
        }

        // Check if timer has reached zero
        if (timer1 === 0) {
            clearInterval(intervalId); // Stop the interval
            console.log("Finished");
        }
    }, 1000); // Interval set to 1000 milliseconds (1 second)
}




