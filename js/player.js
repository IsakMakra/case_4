"use strict";

const password = localStorage.getItem("password");

async function startPlayerPage () {

    const interval = 1000; // 1000 milliseconds = 1 second

    async function fetchData() {

        let response = await fetcha (`api/user.php?server_code=${password}`, "GET");
        console.log(response);
        let data = await response.json();
        console.log(data.current_question_nr);
        let questionNumber = data.current_question_nr;

        if (questionNumber === 0) {
            console.log("Not ready yet");
        } else {
            console.log("Game is active");
        }
    }
    
    const intervalId = setInterval(fetchData, interval);
}

startPlayerPage();

