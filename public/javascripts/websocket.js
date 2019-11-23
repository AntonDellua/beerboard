/**
 * This file serves to open and mantain a websocket
 * to showcase real-time information of the server.
 */

// WebSocket vars
let url = "";       // The url must be an endpoint on the back-end
let w = new WebSocket(url);

// WebSocket functions
w.onopen = function() {
    console.log("Web Socket Open...");
    // Functionality:
}

w.onmessage = function() {
    console.log("Web Socket Message Received...");
    // Functionality:
}

w.onclose = function() {
    console.log("Web Socket Closed...");
    // Functionality:
}

w.onerror = function() {
    console.log("Web Socket Error...");
    // Functionality:
}
