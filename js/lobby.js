"use strict";

function submitPassword () {
    const password = document.getElementById("lobbycode").value;
    console.log(password);
    joinLobby(password);
}

function joinLobby (password) {
    fetching(`api/game.php?game=${password}`, "GET");
}   

function submitLobby () {
    const hostName = document.getElementById("hostName").value;
    console.log(hostName);

}

function createLobby (){

}