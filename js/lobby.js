"use strict";

function submitUser() {
    const password = document.getElementById("lobbycode").value;
    const user = document.getElementById("userName").value;
    document.getElementById('lobbycode').value = '';
    document.getElementById('userName').value = '';
    joinLobby(password, user);
}


async function joinLobby(password, user) {
    let response = await fetcha(`api/game.php?server_code=${password}&user=${user}`, "GET");
    console.log(response);

    if (response.ok) {
        document.getElementById("joinLobbyMessage").innerHTML = "Joining lobby...";
        renderLobbyPage(password);
        let data = await response.json();
        console.log(data);
    } else {
        document.getElementById("joinLobbyMessage").innerHTML = "Wrong password...";
    }


}

function submitLobby(category) {
    const hostName = document.getElementById("hostName").value;
    document.getElementById('hostName').value = '';
    createLobby(hostName, category);
}

async function createLobby(hostName, category) {
    const infobody = {
        host: hostName,
        quiz: category
    };

    let response = await fetcha(`api/game.php`, "POST", infobody);

    let data = await response.json();
    console.log(data);

    localStorage.setItem("name", data.host);
    localStorage.setItem("category", category);
    localStorage.setItem("serverCode", data.server_code);

    if (response.ok) {
        // document.getElementById("createLobbyMessage").innerHTML = "Creating lobby...";
        startHostPage();
        window.location = "../host.html";
        //renderHostPage();
    } else {
        document.getElementById("createLobbyMessage").innerHTML = "Something went wrong... Try again.";
    }
}


function renderHostPage() {

}

clearLocalStorage();