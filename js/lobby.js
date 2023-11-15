"use strict";

function submitPassword () {
    const password = document.getElementById("lobbycode").value;
    console.log(password);
    joinLame(password);
}

function joinLobby (password) {
    fetching(`api/game.php?game=${password}`, "GET");
}   


function createLobby {

}