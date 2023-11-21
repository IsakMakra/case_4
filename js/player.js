"use strict";

function renderLobbyPage(password) {
    document.body.innerHTML = `
    <p>Waiting for game to start...</p>
    `;
    QuizQuestion(password);
}

//Function to keep up with what question is active in game
async function QuizQuestion (password) {

    //This function checks which question is active every second to update the user with information
    async function checkQuizStatus () {
        let response = await fetcha(`api/user.php?server_code=${password}`, "GET");
        let data = await response.json();
        console.log(data.current_question_nr);
        let questionNumber = data.current_question_nr;
    
        if (questionNumber === 0) {
            console.log("not ready yet");
        } else {
            console.log("Let's play");
            document.body.innerHTML = `
            <p>Game is live</p>
            `;
        }
    }

    // Set up an interval to call the function every second
    const intervalId = setInterval(async () => {
        await checkQuizStatus();
    }, 1000);

}