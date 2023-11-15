"use strict";

function submitUser () {
    const password = document.getElementById("lobbycode").value;
    const user = document.getElementById("userName").value;
    joinLobby(password, user);
}

function joinLobby (password, user) {
    fetching(`api/game.php?game=${password}&${user}`, "GET");
}   

function submitLobby (category) {
    const hostName = document.getElementById("hostName").value;
    createLobby(hostName, category);
}

function createLobby (hostName, category){
    const infobody = {
        host: hostName,
        quiz: category
    };
    fetching(`api/game.php`, "POST", infobody);
}