"use strict";

const interval = 1000; // 1000 milliseconds = 1 second
const password = localStorage.getItem("password");
const username = localStorage.getItem("name");
document.querySelector("#namn").textContent = username;
let watingForGameToStart = true;
let intervalId;
let OldQuestionNumber = 0;
//Create eventlistener
// Get the parent div
const parentDiv = document.getElementById("users");

// Loop through the children and add an event listener to each one
// for (let i = 0; i < parentDiv.children.length; i++) {
//     const child = parentDiv.children[i];

//     // Add an event listener (e.g., click event)
//     child.addEventListener("click", voteForPlayer);
// }

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

    if (dataObject.quiz[currentQuestionuestionNumber] === "start") {
        document.getElementById("feedback").textContent = "Väntar på att spelet ska starta";
    }

    if (dataObject.quiz[currentQuestionuestionNumber] === "end") {
        document.getElementById("feedback").textContent = "Quizet är slut";
    }

    if (currentQuestionuestionNumber > OldQuestionNumber) {
        document.getElementById("feedback").textContent = dataObject.quiz[currentQuestionuestionNumber].question;

        let usersContainer = document.querySelector("#users");
        let userArray = dataObject.quiz[currentQuestionuestionNumber].alternatives;

        usersContainer.innerHTML = "";
        // Iterate through userArray and update the content of <p> elements
        if (userArray.includes(username)) {
            usersContainer.innerHTML = "Du ska spela"
        } else {
            userArray.forEach((user) => {
                const button = document.createElement("button");
                button.classList.add("voteBtn");
                button.id = user;
                button.textContent = user;
                button.addEventListener("click", voteForPlayer)
                usersContainer.append(button);
            });

            OldQuestionNumber++;
        }
    }
}




async function voteForPlayer(event) {

    // for (let i = 0; i < parentDiv.children.length; i++) {
    //     const child = parentDiv.children[i];

    //     child.setAttribute("disabled", true)
    // }

    console.log(event.target.textContent);
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

        let response2 = await fetcha(`api/user.php`, "POST", infoData);
        let data2 = await response2.json();
        console.log(data2);
    } else {
        console.log("oops");
    }
}
