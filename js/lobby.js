"use strict";

let hostName;
//Events on buttons
document.getElementById("join").addEventListener("click", () => {
    document.querySelector("body").innerHTML = `
        <div id="home"></div>
        <div id="box">
            
            <div id="steps">
                <div class=" step full"></div>
                <div class=" step"></div>
            </div>

            <div id="img"></div>

        
            <div class="wrapper">
                <label for="lobby" class="labels">lobby ID</label>
                <div class="inputContainer">
                    <input type="tel" id="0" class="serverCode" maxlength="1">
                    <input type="tel" id="1" class="serverCode" maxlength="1">
                    <input type="tel" id="2" class="serverCode" maxlength="1">
                    <input type="tel" id="3" class="serverCode" maxlength="1">
                </div>
            </div>

            <div class="wrapper">
                <label for="lobby" class="labels">användarnamn</label>
                <input type="text" id="userName" name="userName" class="inputNames" placeholder="ex. Pelle">
            </div>

            <p class="message" id="joinLobbyMessage"></p>

            <button class="buttonNext" id="joinBtn">STARTA</button>
        </div>
        <div id="waves"></div>
    `;

    let value = 0;
    const inputs = Array.from(document.querySelectorAll(".serverCode"));
    inputs[0].focus();

    //går igenom varje input och ger den keyup eventlistener
    inputs.forEach(input => {
        input.addEventListener("keyup", function (e) {
            let key = e.key;
            let id = parseInt(this.id) + 1;
            let previousSibling = this.previousElementSibling;
            let nextSibling = document.getElementById(id);
            if (key === "Backspace") {
                if (value < 2) {
                    return;
                } else {
                    previousSibling.focus();
                    value = 0;
                }

            } else {
                if (nextSibling === null) {
                    return
                }
                nextSibling.focus();
            }


        })
    })

    inputs.forEach(input => {
        input.addEventListener("keydown", function (e) {
            let key = e.key;
            if (key === "Backspace") {
                value++
            }
        })
    })

    document.querySelector("#joinBtn").addEventListener("click", () => {
        let serverCodeString = inputs.map(input => input.value).join("");
        console.log(serverCodeString);
        const password = serverCodeString;
        const user = document.getElementById("userName").value;
        document.getElementById('userName').value = '';
        joinLobby(password, user);
    })

    document.getElementById("home").addEventListener("click", () => {
        location.reload();
    })
})

document.getElementById("start").addEventListener("click", () => {
    document.querySelector("body").innerHTML = `
        <div id="home"></div>
        <div id="box">
            <div id="steps">
                <div class=" step full"></div>
                <div class=" step"></div>
                <div class=" step"></div>
            </div>
            <div id="img"></div>
            <label class="labelName labels" for="lobby">användarnamn</label>
            <input class="inputNames inputUserName" type="text" id="hostName" name="hostName" required maxlength="10" placeholder="ex. Pelle">
            <p class="message" id="errorMessage"></p>
            <button class="buttonNext" id="joinNextButton" type="submit" onclick="chooseCategory()">NÄSTA</button>
            </div>
            <div id="waves"></div>
            `;

    document.getElementById("hostName").addEventListener("keyup", (e) => {
        let errorMessage = "Max 10 characters in the name"
        controlName(e, errorMessage);
    });
    document.getElementById("home").addEventListener("click", () => {
        location.reload();
    })
})

function controlName(event, errorMessage, maxlength = 10, minlength = 3) {
    let input = event.currentTarget

    if (input.value.length === maxlength) {
        document.getElementById("errorMessage").textContent = errorMessage;
        runAnimation()
    }

    function runAnimation() {
        input.classList.add("maxCharacters");
        input.addEventListener("animationend", (event2) => {
            event2.currentTarget.classList.remove("maxCharacters");
        });
    }
}


function chooseCategory() {

    hostName = document.getElementById("hostName").value;
    document.querySelector("body").innerHTML = `
            <div id="home"></div>
            <div id="box">
                <div id="steps">
                    <div class=" step"></div>
                    <div class=" step full"></div>
                    <div class=" step"></div>
                </div>

                <h3>KATEGORIER</h3>
                <p>Välj en kategorier att spela</p>
                <p class="message" id="createLobbyMessage"></p>

                <div id="categoryWrapper">
                    <div class="categoryCard" onclick="createLobby('Random')">
                        <div class="categoryImg random"></div>
                        <div class="categoryTextBox">
                            <h3>RANDOM</h3>
                            <p>Gott och blandat! Något för alla!</p>
                        </div>
                    </div>

                    <div class="categoryCard" onclick="createLobby('Fest')">
                        <div class="categoryImg fest"></div>
                        <div class="categoryTextBox">
                            <h3>FESTLIGHETER</h3>
                            <p>Tävla mot varandra i festligheter!</p>
                        </div>
                    </div>

                    <div class="categoryCard" onclick="createLobby('Världen')">
                        <div class="categoryImg världen"></div>
                        <div class="categoryTextBox">
                            <h3>VÄRLDEN</h3>
                            <p>Dags att testa geografin, flaggor, länder och städer!</p>
                        </div>
                    </div>

                    <div class="categoryCard" onclick="createLobby('Historia')">
                        <div class="categoryImg historia"></div>
                        <div class="categoryTextBox">
                            <h3>Historia</h3>
                            <p>Res tillbaka i tiden och tävla om vem som har bäst minne!</p>
                        </div>
                    </div>

                    <div class="categoryCard" onclick="createLobby('Musik')">
                        <div class="categoryImg musik"></div>
                        <div class="categoryTextBox">
                            <h3>MUSIK</h3>
                            <p>Avgör vem som har störst musikkunskap!</p>
                        </div>
                    </div>

                    <div class="categoryCard" onclick="createLobby('Fysisk Aktivitet')">
                        <div class="categoryImg fysisk"></div>
                        <div class="categoryTextBox">
                            <h3>FYSISK AKTIVITET</h3>
                            <p>Tävla mot varandra i styrka och prestanda!</p>
                        </div>
                    </div>

                </div>
            </div>
            `;

    document.getElementById("home").addEventListener("click", () => {
        location.reload();
    })


}

// //Collecting the users information
// function submitUser() {
//     const password = document.getElementById("lobbycode").value;
//     const user = document.getElementById("userName").value;
//     document.getElementById('lobbycode').value = '';
//     document.getElementById('userName').value = '';
//     joinLobby(password, user);
// }

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

clearLocalStorage();
