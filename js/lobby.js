"use strict";

let hostName;
//Events on buttons
document.getElementById("join").addEventListener("click", () => {
    document.querySelector("body").innerHTML = `
        <button id="back">Back</button>
        <div id="box">
            <h3>Join a lobby</h3>
            <p class="message" id="joinLobbyMessage"></p>
            <label for="lobby">Enter your name</label>
            <input type="text" id="userName" name="userName">
            <label for="lobby">Enter the lobby code</label>
            <input type="text" id="lobbycode" name="lobbycode">
            <button onclick="submitUser()">Join</button>
        </div>
        <div id="waves"></div>
    `;

    document.getElementById("back").addEventListener("click", () => {
        location.reload();
    })
})

document.getElementById("start").addEventListener("click", () => {
    document.querySelector("body").innerHTML = `
        <button id="back">Home</button>
        <div id="box">
            <h3>Create a lobby</h3>
            <p class="message" id="createLobbyMessage"></p>
            <label for="lobby">Enter your name</label>
            <input type="text" id="hostName" name="hostName" required maxlength="10">
            <button type="submit" onclick="chooseCategory()">Nästa</button>
            </div>
            <div id="waves"></div>
            `;
    document.getElementById("back").addEventListener("click", () => {
        location.reload();
    })
})

function chooseCategory() {
    hostName = document.getElementById("hostName").value;
    document.querySelector("body").innerHTML = `
            <button id="back">Home</button>
            <div id="box">
            <h3>Välj kategori</h3>
            <p class="message" id="createLobbyMessage"></p>
            <button onclick="createLobby('Random')">Random</button>
            <button onclick="createLobby('Fest')">Fest</button>
            <button onclick="createLobby('Familj')">Familj</button>
            <button onclick="createLobby('Sport')">Sport</button>
            <button onclick="createLobby('Hjärngympa')">Hjärngympa</button>
            </div>
            <div id="waves"></div>
            `;

    document.getElementById("back").addEventListener("click", () => {
        location.reload();
    })


}

//Collecting the users information
function submitUser() {
    const password = document.getElementById("lobbycode").value;
    const user = document.getElementById("userName").value;
    document.getElementById('lobbycode').value = '';
    document.getElementById('userName').value = '';
    joinLobby(password, user);
}

//The user joins the lobby
async function joinLobby(password, user) {
    let response = await fetcha(`api/game.php?server_code=${password}&user=${user}`, "GET");
    console.log(response);

    //Wrong code
    if (response.ok) {
        document.getElementById("joinLobbyMessage").innerHTML = "Joining lobby...";
        let data = await response.json();
        console.log(data);
        localStorage.setItem("password", password);
        localStorage.setItem("name", user);

        window.location = "../player.html";

    } else {
        //Correct code
        document.getElementById("joinLobbyMessage").innerHTML = "Wrong password...";
    }
}


//Creates a lobby
async function createLobby(category) {
    const infobody = {
        host: hostName,
        quiz: category
    };

    let response = await fetcha(`api/game.php`, "POST", infobody);

    let data = await response.json();
    console.log(data);

    localStorage.setItem("category", category);
    localStorage.setItem("name", hostName);
    localStorage.setItem("serverCode", data.server_code);

    if (response.ok) {
        window.location = "../host.html";
    } else {
        document.getElementById("createLobbyMessage").innerHTML = "Something went wrong... Try again.";
    }
}


function renderHostPage() {

}

clearLocalStorage();
