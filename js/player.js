"use strict";

const password = localStorage.getItem("password");

function startPlayerPage () {

    const interval = 1000; // 1000 milliseconds = 1 second

    function fetchData(password) {
        console.log("Before fetch");
        fetch(`api/user.php?server_code=${password}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Fetch failed');
                }
                return response.json();
            })
            .then(data => {
                console.log("After fetch");
                // Check the condition (more than 0 or not)
                if (data.current_question_nr > 0) {
                    console.log("yes");
                } else {
                    console.log("no");
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }
    
    const intervalId = setInterval(fetchData, interval);


}

startPlayerPage();

