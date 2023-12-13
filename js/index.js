"use strict";

document.getElementById("info").addEventListener("click", showInfo);

function showInfo() {
    let infoBox = document.getElementById("infoBox");
    infoBox.classList.toggle("show");
}
