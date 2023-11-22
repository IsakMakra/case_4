"use strict";


async function fetcha(url, type, info) {
    let response;

    try {

        if (type === "GET") {
            response = await fetch(url);
        } else {
            response = await fetch(url, {
                method: type,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(info),
            });
        }

        // console.log(response);
        return response;

    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

function clearLocalStorage() {
    localStorage.clear();
}