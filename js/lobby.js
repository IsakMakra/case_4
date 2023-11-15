"use strict";

function submitPassword () {
    const password = document.getElementById("lobbycode").value;
    console.log(password);
    joinLobby(password);
}

function joinLobby (password) {
    fetching(`api/game.php?game=${password}`, "GET");
}   

function submitLobby (category) {
    const hostName = document.getElementById("hostName").value;
    console.log(hostName);
    console.log(category);
    createLobby(hostName, category);
}

function createLobby (hostName, category){

    const infobody = {
        host: hostName,
        quiz: category
    };
    fetching(`api/game.php`, "POST", infobody);
}