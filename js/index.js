"use strict";

document.getElementById("info").addEventListener("click", showInfo);

function showInfo() {
    console.log("hej kajsa");
    let infoBox = document.getElementById("infoBox");
    infoBox.classList.toggle("show");
}
