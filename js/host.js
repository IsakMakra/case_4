
const interval = 1000;
const players = ["Adam", "Isak", "Kajsa", "Tanner"];
function startHostPage() {

    document.querySelector("#title").textContent = "Fråga 1 | Armhövningar";
    document.querySelector("#question").textContent = "Vem kan gör flest armhövningar?";



    // setInterval(() => {
    //     // fetching()
    //     document.querySelector("#playerNames").innerHTML += `<p>Adam</p>`;
    // }, interval);
}

startHostPage();