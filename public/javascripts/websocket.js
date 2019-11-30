/**
 * This file serves to open and mantain a websocket
 * to showcase real-time information of the server.
 */

// WebSocket vars
let url = 'ws://localhost:3000';       // The url must be an endpoint on the back-end
let w = new WebSocket(url);

console.log('Hello from WebSocket.js');

// WebSocket functions
w.onopen = function() {
    console.log('WebSocket Open from Client side...');
    // Functionality:
}

w.onmessage = function(e) {
    console.log('WebSocket Message Received from Client Side...');
    // Functionality:
    let payload = JSON.parse(e.data)
    console.log('JSON from client side: ', payload.status.batch);
    moneyPlay(payload);
}

w.onclose = function(e) {
    console.log('Web Socket Closed from Client Side...');
    // Functionality:
}

w.onerror = function(e) {
    console.log('Web Socket Error from Client Side...');
    // Functionality:
}

function moneyPlay (beer) {
    console.log('Hello from the Moneyplay...');
    
    let batchContainer = document.getElementById('batchContainer');
    let timeContainer = document.getElementById('timeContainer');
    let runningContainer = document.getElementById('runningContainer');
    let overallContainer = document.getElementById('overallContainer');
    let temp1Container = document.getElementById('temp1Container');
    let temp2Container = document.getElementById('temp2Container');
    let temp3Container = document.getElementById('temp3Container');
    let temp4Container = document.getElementById('temp4Container');

    batchContainer.innerHTML = beer.status.batch;
    timeContainer.innerHTML = beer.status.datetime;
    runningContainer.innerHTML = beer.status.runningTime;
    overallContainer.innerHTML = beer.status.overall;

    temp1Container.innerHTML = beer.data.temp1;
    temp2Container.innerHTML = beer.data.temp2;
    temp3Container.innerHTML = beer.data.temp3;
    temp4Container.innerHTML = beer.data.temp4;

}

wsTimer = setInterval(timerFunction, 2000);

function timerFunction() {
    console.log('Message sent from client to server ws');
    w.send('Request beer');
}

window.onload = wsTimer;
