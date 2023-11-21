
const interval = 1000;
let nIntervId; // stores the setInterval id to be later used to delete the interval
let allPlayers = []; // Initialize an array to store the players
const playersArray = ["Adam", "Isak", "Kajsa", "Tanner", "jacob", "love", "mackan", "johan"];
const hostName = localStorage.getItem("name");
const category = localStorage.getItem("category");
const serverCode = localStorage.getItem("serverCode");

const mainHtml = document.querySelector("main");
let questionNr = 0;
let cancelQuestionFetch = true;

//Starts the functions to create the host page and track the joined players
async function startHostPage() {

    document.querySelector("#title").textContent = "Vem kan mest?";
    document.querySelector("#kategori").textContent = "Party";

    nIntervId = setInterval(myCallback, interval, true, false);
}

function myCallback(displayPlayer, displayQuestion) {
    //fetches players that join the lobby
    if (displayPlayer) {
        dispalyNewPlayers();
    }

    //should only be one time per question
    if (displayQuestion) {
        nextQuestion();
    }

    //make one for the votes that should update every second

}

async function fetchGameObject() {
    const response = await fetcha(`api/host.php?server_code=${serverCode}&host=${hostName}`, "GET");

    const data = await response.json();
    console.log(data);

    return data
    // Simulate fetching new players, replace this with your logic
    // const newPlayers = ["Adam", generate(), generate(), generate()];
    // return newPlayers;
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
            document.querySelector("#playerNames").innerHTML += `<p>${player}</p>`;
        });
    }
    // Update the player list
    allPlayers = newPlayers;
}

var nameList = [
    'Time', 'Past', 'Future', 'Dev',
    'Fly', 'Flying', 'Soar', 'Soaring', 'Power', 'Falling',
    'Fall', 'Jump', 'Cliff', 'Mountain', 'Rend', 'Red', 'Blue',
    'Green', 'Yellow', 'Gold', 'Demon', 'Demonic', 'Panda', 'Cat',
    'Kitty', 'Kitten', 'Zero', 'Memory', 'Trooper', 'XX', 'Bandit',
    'Fear', 'Light', 'Glow', 'Tread', 'Deep', 'Deeper', 'Deepest',
    'Mine', 'Your', 'Worst', 'Enemy', 'Hostile', 'Force', 'Video',
    'Game', 'Donkey', 'Mule', 'Colt', 'Cult', 'Cultist', 'Magnum',
    'Gun', 'Assault', 'Recon', 'Trap', 'Trapper', 'Redeem', 'Code',
    'Script', 'Writer', 'Near', 'Close', 'Open', 'Cube', 'Circle',
    'Geo', 'Genome', 'Germ', 'Spaz', 'Shot', 'Echo', 'Beta', 'Alpha',
    'Gamma', 'Omega', 'Seal', 'Squid', 'Money', 'Cash', 'Lord', 'King',
    'Duke', 'Rest', 'Fire', 'Flame', 'Morrow', 'Break', 'Breaker', 'Numb',
    'Ice', 'Cold', 'Rotten', 'Sick', 'Sickly', 'Janitor', 'Camel', 'Rooster',
    'Sand', 'Desert', 'Dessert', 'Hurdle', 'Racer', 'Eraser', 'Erase', 'Big',
    'Small', 'Short', 'Tall', 'Sith', 'Bounty', 'Hunter', 'Cracked', 'Broken',
    'Sad', 'Happy', 'Joy', 'Joyful', 'Crimson', 'Destiny', 'Deceit', 'Lies',
    'Lie', 'Honest', 'Destined', 'Bloxxer', 'Hawk', 'Eagle', 'Hawker', 'Walker',
    'Zombie', 'Sarge', 'Capt', 'Captain', 'Punch', 'One', 'Two', 'Uno', 'Slice',
    'Slash', 'Melt', 'Melted', 'Melting', 'Fell', 'Wolf', 'Hound',
    'Legacy', 'Sharp', 'Dead', 'Mew', 'Chuckle', 'Bubba', 'Bubble', 'Sandwich', 'Smasher', 'Extreme', 'Multi', 'Universe', 'Ultimate', 'Death', 'Ready', 'Monkey', 'Elevator', 'Wrench', 'Grease', 'Head', 'Theme', 'Grand', 'Cool', 'Kid', 'Boy', 'Girl', 'Vortex', 'Paradox'
];

function generate() {
    var finalName = nameList[Math.floor(Math.random() * nameList.length)];
    return finalName;
};

startHostPage();

//Start quiz btn when clicked stops the interval and goes on to the questions
document.querySelector("#startQuiz").addEventListener("click", (e) => {
    clearInterval(nIntervId);
    nIntervId = null;
    incrementQuestionNr();

    nIntervId = setInterval(myCallback, interval, false, true);

})

function incrementQuestionNr() {
    const nextQuestionBody = {
        next: questionNr++,
        server_code: serverCode,
        host: hostName
    }
    fetcha("api/host.php", "POST", nextQuestionBody);
}

async function nextQuestion() {
    // first time it is true so we can display the question, second time it is false so it doesent update every second
    if (cancelQuestionFetch) {
        console.log("hello");
        cancelQuestionFetch = false;
        const gameObject = await fetchGameObject();
        displayQuestion(gameObject);
    }
}

// displayQuestion()
function displayQuestion(object) {
    //!fix this function
    questionNr = 1;
    const currentQuestion = object.quiz[questionNr].question;
    const playingUsers = object.quiz[questionNr].numberOfPlayers;
    // getRandomPlayers(4, playersArray);
    // console.log(playingUsers);
    // console.log(playersArray);

    mainHtml.innerHTML =
        `
        <header class="question">
            <h1>Armhövningar</h1>
            <p>${currentQuestion}</p>
        </header>
        <section class="question" id="middleSection">
            <img src="" alt="">
            <div class="buttonContainer"></div>
        </section>
        <section class="question">
            <button id="nextBtn">Nästa fråga</button>
        </section>
    `

    //* this gives eventlisteners to the buttons to be able to select the winner
    playingUsers.forEach(user => {
        const button = document.createElement("button");
        button.classList.add("playerBtn");
        button.textContent = user;
        button.addEventListener("click", function (e) {
            console.log(e.currentTarget);
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
        console.log(this);
        cancelQuestionFetch = true;
        incrementQuestionNr();
        nextQuestion();
    })
}


function getRandomPlayers(players, users) {
    //! fix this function
    let playingUsers = users.splice(getRandomInt(users.length - 1), players);
    return playingUsers;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}