"use strict";
console.log("Inizializzato");

// Registering Service Worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}
