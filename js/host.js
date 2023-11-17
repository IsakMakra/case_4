
// const interval = 1000;
// let nIntervId; // stores the setInterval id to be later used to delete the interval
// const players = ["Adam", "Isak", "Kajsa", "Tanner"];

// //Starts the functions to create the host page and track the joined players
// async function startHostPage() {

//     document.querySelector("#title").textContent = "Vem kan mest?";
//     document.querySelector("#kategori").textContent = "Party";

//     const hostName = localStorage.getItem("name");
//     const category = localStorage.getItem("category");

//     // Initialize an array to store the players
//     let allPlayers = [];

//     // Function to fetch new players
//     async function fetchNewPlayers() {
//         const response = await fetcha(`api/game.php`, "POST", { host: hostName, quiz: category });

//         const data = await response.json();
//         console.log(data);
//         const players = data.users

//         return players
//         // Simulate fetching new players, replace this with your logic
//         // const newPlayers = ["Adam", generate(), generate(), generate()];
//         // return newPlayers;
//     }

//     //Sets a interval every 1000ms, it fetches players that join the lobby
//     nIntervId = setInterval(async () => {
//         const newPlayers = await fetchNewPlayers();
//         const length1 = allPlayers.length;
//         const length2 = newPlayers.length;

//         // if this is true there is new players in the lobby and we dispaly their names
//         if (length2 > length1) {
//             const numOfNewPlayers = length2 - length1;
//             const startIndex = length2 - numOfNewPlayers;
//             const players = newPlayers.slice(startIndex, length2);
//             players.forEach(player => {
//                 document.querySelector("#playerNames").innerHTML += `<p>${player}</p>`;
//             });
//         }
//         // Update the player list
//         allPlayers = newPlayers;
//     }, interval);
// }

// var nameList = [
//     'Time', 'Past', 'Future', 'Dev',
//     'Fly', 'Flying', 'Soar', 'Soaring', 'Power', 'Falling',
//     'Fall', 'Jump', 'Cliff', 'Mountain', 'Rend', 'Red', 'Blue',
//     'Green', 'Yellow', 'Gold', 'Demon', 'Demonic', 'Panda', 'Cat',
//     'Kitty', 'Kitten', 'Zero', 'Memory', 'Trooper', 'XX', 'Bandit',
//     'Fear', 'Light', 'Glow', 'Tread', 'Deep', 'Deeper', 'Deepest',
//     'Mine', 'Your', 'Worst', 'Enemy', 'Hostile', 'Force', 'Video',
//     'Game', 'Donkey', 'Mule', 'Colt', 'Cult', 'Cultist', 'Magnum',
//     'Gun', 'Assault', 'Recon', 'Trap', 'Trapper', 'Redeem', 'Code',
//     'Script', 'Writer', 'Near', 'Close', 'Open', 'Cube', 'Circle',
//     'Geo', 'Genome', 'Germ', 'Spaz', 'Shot', 'Echo', 'Beta', 'Alpha',
//     'Gamma', 'Omega', 'Seal', 'Squid', 'Money', 'Cash', 'Lord', 'King',
//     'Duke', 'Rest', 'Fire', 'Flame', 'Morrow', 'Break', 'Breaker', 'Numb',
//     'Ice', 'Cold', 'Rotten', 'Sick', 'Sickly', 'Janitor', 'Camel', 'Rooster',
//     'Sand', 'Desert', 'Dessert', 'Hurdle', 'Racer', 'Eraser', 'Erase', 'Big',
//     'Small', 'Short', 'Tall', 'Sith', 'Bounty', 'Hunter', 'Cracked', 'Broken',
//     'Sad', 'Happy', 'Joy', 'Joyful', 'Crimson', 'Destiny', 'Deceit', 'Lies',
//     'Lie', 'Honest', 'Destined', 'Bloxxer', 'Hawk', 'Eagle', 'Hawker', 'Walker',
//     'Zombie', 'Sarge', 'Capt', 'Captain', 'Punch', 'One', 'Two', 'Uno', 'Slice',
//     'Slash', 'Melt', 'Melted', 'Melting', 'Fell', 'Wolf', 'Hound',
//     'Legacy', 'Sharp', 'Dead', 'Mew', 'Chuckle', 'Bubba', 'Bubble', 'Sandwich', 'Smasher', 'Extreme', 'Multi', 'Universe', 'Ultimate', 'Death', 'Ready', 'Monkey', 'Elevator', 'Wrench', 'Grease', 'Head', 'Theme', 'Grand', 'Cool', 'Kid', 'Boy', 'Girl', 'Vortex', 'Paradox'
// ];

// function generate() {
//     var finalName = nameList[Math.floor(Math.random() * nameList.length)];
//     return finalName;
// };

// // startHostPage();

// //Start quiz btn when clicked stops the interval and goes on to the questions
// document.querySelector("#startQuiz").addEventListener("click", (e) => {
//     clearInterval(nIntervId);
//     nIntervId = null;
//     nextQuestion();
// })

// function nextQuestion() {

// }

const interval = 1000;
let nIntervId; // stores the setInterval id to be later used to delete the interval
let allPlayers = []; // Initialize an array to store the players
const playersArray = ["Adam", "Isak", "Kajsa", "Tanner", "jacob", "love", "mackan", "johan"];
const hostName = localStorage.getItem("name");
const category = localStorage.getItem("category");
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
    const response = await fetcha(`api/game.php`, "POST", { host: hostName, quiz: category });

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

// startHostPage();

//Start quiz btn when clicked stops the interval and goes on to the questions
document.querySelector("#startQuiz").addEventListener("click", (e) => {
    clearInterval(nIntervId);
    nIntervId = null;

    nIntervId = setInterval(myCallback, interval, false, true);

})

async function nextQuestion() {
    console.log("hello");
    // first time it is true so we can display the question, second time it is false so it doesent update every second
    if (cancelQuestionFetch) {
        cancelQuestionFetch = false;
        const gameObject = await fetchGameObject();
        displayQuestion(gameObject);
    }
}

function displayQuestion(object) {
    //!fix this function
    questionNr = object.current_question_nr;
    const currentQuestion = object.quiz[questionNr];
    const playingUsers = getRandomPlayers(4, playersArray);
    console.log(playingUsers);
}

function getRandomPlayers(players, users) {
    //! fix this function
    let playingUsers = allPlayers.splice(getRandomInt(users.length - 1), players);
    console.log(playingUsers);
    console.log(players);
    return playingUsers;
    // for(let i = 0; i < players; i++){

    // }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}