"use strict";

function submitPassword () {
    const password = document.getElementById("lobbycode").value;
    console.log(password);
    joinGame(password);
}

function joinGame (password) {
    fetching(`api/game.php?game=${password}`, "GET");
}   