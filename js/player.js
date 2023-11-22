"use strict";

const password = localStorage.getItem("password");
const username = localStorage.getItem("name");

//Create eventlistener
    // Get the parent div
    const parentDiv = document.getElementById("users");

        // Loop through the children and add an event listener to each one
        for (let i = 0; i < parentDiv.children.length; i++) {
            const child = parentDiv.children[i];

            // Add an event listener (e.g., click event)
            child.addEventListener("click", voteForPlayer);
        }

        async function voteForPlayer (event) {

            for (let i = 0; i < parentDiv.children.length; i++) {
                const child = parentDiv.children[i];
    
                child.setAttribute("disabled", true)
            }

            console.log(event.target.textContent);
            let votedPlayer = event.target.textContent;
            
            let response = await fetcha (`api/user.php?server_code=${password}`, "GET");
            let data = await response.json();
            console.log(data.users);
            let users = data.users;

            let foundUser = null;

            users.forEach(user => {
                if (user.username === votedPlayer) {
                    console.log("10 points to slytherin!");
                    foundUser = user;
                }})

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

async function startPlayerPage () {

   // child.setAttribute("disabled", false);

    const interval = 1000; // 1000 milliseconds = 1 second

    async function fetchData() {

        let response = await fetcha (`api/user.php?server_code=${password}`, "GET");
        console.log(response);
        let data = await response.json();
        let questionNumber = data.current_question_nr;
        console.log(data);
        //console.log(data.quiz[questionNumber].alternatives);

        if (data.quiz[questionNumber] === "start") {
            document.getElementById("feedback").textContent = "Waiting for game to start...";
        } else {
            let userArray = data.quiz[questionNumber].alternatives;

            // Iterate through userArray and update the content of <p> elements
            userArray.forEach((user, index) => {
                const userParagraph = document.getElementById(`user${index + 1}`);
                if (userParagraph) {
                    userParagraph.textContent = ""; // Clear existing content
                    userParagraph.textContent = user; // Set new content        
                    userParagraph.disabled = false; // Re-enable the button    
                }
            });
            document.getElementById("feedback").textContent = data.quiz[questionNumber].question;
        }

    }
    
    const intervalId = setInterval(fetchData, interval);
}


startPlayerPage();

