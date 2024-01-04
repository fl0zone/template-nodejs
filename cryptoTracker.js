const axios = require('axios');
const { WebClient } = require('@slack/web-api');

// Configuración de la API de criptomonedas
const apiUrl = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd";

// Cliente de Slack
const slackToken = 'tu-token-de-slack';
const slackChannel = 'tu-canal-de-slack';
const slackClient = new WebClient(slackToken);

// Obtiene los precios actuales de las criptomonedas
async function obtenerPreciosActuales() {
    try {
        const response = await axios.get(apiUrl);
        console.log(response.data); // Imprime los datos en la consola
        return response.data;
    } catch (error) {
        console.error('Error al obtener precios:', error);
    }
}

// Calcula el porcentaje de ganancia
function calcularGanancia(precioEntrada, precioActual) {
    return ((precioActual - precioEntrada) / precioEntrada) * 100;
}

// Envía un mensaje a Slack
async function enviarMensajeSlack(mensaje) {
    try {
        await slackClient.chat.postMessage({
            channel: slackChannel,
            text: mensaje
        });
    } catch (error) {
        console.error('Error al enviar mensaje a Slack:', error);
    }
}

(async () => {
    const preciosActuales = await obtenerPreciosActuales();

    // Aquí debes obtener el precio medio de entrada de tu base de datos o archivo
    const precioEntradaBitcoin = 30000; // Ejemplo
    const precioEntradaEthereum = 1000; // Ejemplo

    const gananciaBitcoin = calcularGanancia(precioEntradaBitcoin, preciosActuales.bitcoin.usd);
    const gananciaEthereum = calcularGanancia(precioEntradaEthereum, preciosActuales.ethereum.usd);

    let mensaje = `Bitcoin: Precio Actual: ${preciosActuales.bitcoin.usd}, Ganancia: ${gananciaBitcoin}%\n`;
    mensaje += `Ethereum: Precio Actual: ${preciosActuales.ethereum.usd}, Ganancia: ${gananciaEthereum}%`;

    // Envía el mensaje a Slack
    await enviarMensajeSlack(mensaje);
})();
