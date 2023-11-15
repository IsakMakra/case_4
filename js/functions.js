"use strict";

  
async function fetching(url, type, info) {

    let response; 

    try {

        if (type === "GET") {
            response = await fetch(url);
        }  else {
            response = await fetch(url, {
                method: type,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    info
                }),
            });
        }

        console.log(response);
        let data = await response.json();
        console.log(data);

        if (!response.ok) {
            console.log(`Oops! Something went wrong, we got this from the server <span>${data.message}</span>.`);
        } else {
            console.log(data);
        }
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }}