const WebSocket = require("ws");
const axios = require("axios");

const wsUri = "wss://monitoring.telehealth.universal-iot.com/web";
const authServerUrl = "https://monitoring.telehealth.universal-iot.com/api/chronos/GetToken";

let jwtToken = "";

async function getJwtToken() {
    try {
        const response = await axios.post(authServerUrl, {
            username: "user1",
            password: "User1!1234"
        });
        // console.log(response);
        return response.data.Data;
    } catch (error) {
        console.error("Error getting JWT token:", error);
        return null;
    }
}

async function connectWebSocket() {
    jwtToken = await getJwtToken();
    if (!jwtToken) {
        console.error("Failed to get JWT token. Cannot connect to WebSocket.");
        return;
    }

    const client = new WebSocket(wsUri);
    
    client.on("open", () => {
        console.log("Connected");
        let deviceCode = `2123`;
        let random = `545859653`;
        let patientCode = `01234567`;
        let arg = `${deviceCode},${random},${patientCode},${jwtToken}`;
        console.log(arg);
        client.send(arg);
    });

    client.on("message", (message) => {
        // console.log(`Received raw message: ${message}`);
        const obj = JSON.parse(message);
        console.log('Parsed message:', obj);
    });

    client.on("error", (error) => {
        console.log(`ERROR: ${error.message}`);
    });

    client.on("close", (code) => {
        console.log(`Connection Lost with Code: ${code}`);
    });


    return client;
}

let client;

(async () => {
    client = await connectWebSocket();
    setInterval(updateWaveforms, 4000);
    setInterval(aliveHandShake, 1000);
})();

function aliveHandShake() {
    if (client && client.readyState === WebSocket.OPEN) {
        client.send("Hi");
    } else {
        console.log("WebSocket connection is closed. Reconnecting...");
        connectWebSocket().then(newClient => {
            client = newClient;
            console.log("WebSocket reconnected.");
        });
    }
}

function updateWaveforms() {

}