"use strict";

function submitUser () {
    const password = document.getElementById("lobbycode").value;
    const user = document.getElementById("userName").value;
    document.getElementById('lobbycode').value = '';
    document.getElementById('userName').value = '';
    joinLobby(password, user);
}


async function joinLobby (password, user) {
    let response = await fetcha(`api/game.php?game=${password}&user=${user}`, "GET");
    console.log(response);

    if(response.ok) {
        document.getElementById("joinLobbyMessage").innerHTML = "Joining lobby...";
        renderLobbyPage();
        let data = await response.json();
        console.log(data);
    } else {
        document.getElementById("joinLobbyMessage").innerHTML = "Wrong password...";
    }


}

function submitLobby (category) {
    const hostName = document.getElementById("hostName").value;
    document.getElementById('hostName').value = '';
    createLobby(hostName, category);
}

async function createLobby (hostName, category){
    const infobody = {
        host: hostName,
        quiz: category
    };

    let response = await fetcha (`api/game.php`, "POST", infobody);

    if(response.ok) {
        document.getElementById("createLobbyMessage").innerHTML = "Creating lobby...";
        renderHobbyPage();
    } else {
        document.getElementById("createLobbyMessage").innerHTML = "Something went wrong... Try again.";
    }

    let data = await response.json();
    console.log(data);
}

function renderLobbyPage () {
    document.body.innerHTML = `
    <p>Waiting for game to start...</p>
    `;
}

function renderHostPage () {
    
}