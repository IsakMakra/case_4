
const interval = 1000;
const players = ["Adam", "Isak", "Kajsa", "Tanner"];
async function startHostPage() {

    document.querySelector("#title").textContent = "Vem kan mest?";
    document.querySelector("#kategori").textContent = "Party";

    const hostName = localStorage.getItem("name");
    const category = localStorage.getItem("category");
    // setInterval(async () => {
    // const response = await fetcha(`api/game.php`, "POST", { host: hostName, quiz: category });

    // const data = await response.json();
    // console.log(data);
    // const users = data.users
    // users.forEach(user => {
    //     document.querySelector("#playerNames").innerHTML += `<p>Adam</p>`;
    // });

    // }, interval);

    // Initialize an array to store the players
    let allPlayers = [];

    // Function to fetch new players (replace this with your actual implementation)
    async function fetchNewPlayers() {
        // const response = await fetcha(`api/game.php`, "POST", { host: hostName, quiz: category });

        // const data = await response.json();
        // console.log(data);
        // const players = data.users

        // return players
        // Simulate fetching new players, replace this with your logic
        const newPlayers = [generate()];
        return newPlayers;
    }

    setInterval(async () => {
        const newPlayers = await fetchNewPlayers();
        newPlayers.forEach(player => {
            document.querySelector("#playerNames").innerHTML += `<p>${player}</p>`;
        });
        // Update the player list
        allPlayers = [...allPlayers, ...newPlayers];
    }, 1000);
}

var nameList = [
    'Time', 'Past', 'Future', 'Dev',
    'Fly', 'Flying', 'Soar', 'Soaring', 'Power', 'Falling',
    'Fall', 'Jump', 'Cliff', 'Mountain', 'Rend', 'Red', 'Blue',
    'Green', 'Yellow', 'Gold', 'Demon', 'Demonic', 'Panda', 'Cat',
    'Kitty', 'Kitten', 'Zero', 'Memory', 'Trooper', 'XX', 'Bandit',
    'Fear', 'Light', 'Glow', 'Tread', 'Deep', 'Deeper', 'Deepest',
    'Mine', 'Your', 'Worst', 'Enemy', 'Hostile', 'Force', 'Video',
    'Game', 'Donkey', 'Mule', 'Colt', 'Cult', 'Cultist', 'Magnum',
    'Gun', 'Assault', 'Recon', 'Trap', 'Trapper', 'Redeem', 'Code',
    'Script', 'Writer', 'Near', 'Close', 'Open', 'Cube', 'Circle',
    'Geo', 'Genome', 'Germ', 'Spaz', 'Shot', 'Echo', 'Beta', 'Alpha',
    'Gamma', 'Omega', 'Seal', 'Squid', 'Money', 'Cash', 'Lord', 'King',
    'Duke', 'Rest', 'Fire', 'Flame', 'Morrow', 'Break', 'Breaker', 'Numb',
    'Ice', 'Cold', 'Rotten', 'Sick', 'Sickly', 'Janitor', 'Camel', 'Rooster',
    'Sand', 'Desert', 'Dessert', 'Hurdle', 'Racer', 'Eraser', 'Erase', 'Big',
    'Small', 'Short', 'Tall', 'Sith', 'Bounty', 'Hunter', 'Cracked', 'Broken',
    'Sad', 'Happy', 'Joy', 'Joyful', 'Crimson', 'Destiny', 'Deceit', 'Lies',
    'Lie', 'Honest', 'Destined', 'Bloxxer', 'Hawk', 'Eagle', 'Hawker', 'Walker',
    'Zombie', 'Sarge', 'Capt', 'Captain', 'Punch', 'One', 'Two', 'Uno', 'Slice',
    'Slash', 'Melt', 'Melted', 'Melting', 'Fell', 'Wolf', 'Hound',
    'Legacy', 'Sharp', 'Dead', 'Mew', 'Chuckle', 'Bubba', 'Bubble', 'Sandwich', 'Smasher', 'Extreme', 'Multi', 'Universe', 'Ultimate', 'Death', 'Ready', 'Monkey', 'Elevator', 'Wrench', 'Grease', 'Head', 'Theme', 'Grand', 'Cool', 'Kid', 'Boy', 'Girl', 'Vortex', 'Paradox'
];

function generate() {
    var finalName = nameList[Math.floor(Math.random() * nameList.length)];
    return finalName;
};

// startHostPage();