// server.js
const cryptoTracker = require('./src/cryptoTracker');

// Ejecutar cada hora (3600000 milisegundos)
setInterval(() => {
    cryptoTracker();
}, 3600000);
