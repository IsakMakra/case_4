"use strict";

const password = localStorage.getItem("password");

async function startPlayerPage () {

    const interval = 1000; // 1000 milliseconds = 1 second

    async function fetchData() {

        let response = await fetcha (`api/user.php?server_code=${password}`, "GET");
        console.log(response);
        let data = await response.json();
        let questionNumber = data.current_question_nr;
        console.log(data);
        //console.log(data.quiz[questionNumber].alternatives);

        let userArray = data.quiz[questionNumber].alternatives;

        // Iterate through userArray and update the content of <p> elements
        userArray.forEach((user, index) => {
            const userParagraph = document.getElementById(`user${index + 1}`);
            if (userParagraph) {
                userParagraph.textContent = ""; // Clear existing content
                userParagraph.textContent = user; // Set new content            
            }
        });

        document.getElementById("feedback").textContent = data.quiz[questionNumber].question;

        if (questionNumber === 0) {
            console.log("Not ready yet");
        } else {
            console.log("Game is active");
        }
    }
    
    const intervalId = setInterval(fetchData, interval);
}

startPlayerPage();

