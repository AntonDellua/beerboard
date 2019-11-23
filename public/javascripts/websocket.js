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
    console.log('JSON from client side: ', payload.Batch);
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

function moneyPlay (data) {
    console.log('Hello from the Moneyplay...');
    let batchContainer = document.getElementById('batchContainer');
    let timeContainer = document.getElementById('timeContainer');

    batchContainer.innerHTML = data.Batch;
    timeContainer.innerHTML = data.Date;

    //let a = $('batchContainer').after(data.Batch);
    //let b = $('timeContainer').after(data.Date);
}

/*
window.onload = function() {
    w.send('Open WebSocket');
}
*/