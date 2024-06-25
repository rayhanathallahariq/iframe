const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret";

let token = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
let client; // Deklarasikan variabel client di tingkat atas

function sendMessage(message) {
  if (!client || client.readyState !== WebSocket.OPEN) {
    console.log("WebSocket not connected. Cannot send message.");
    return;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.exp * 1000 <= Date.now()) {
        console.log("Token expired before sending message. Requesting new token.");
        client.send("requestNewToken");
        return;
      }
    } catch (error) {
      console.log("Invalid token before sending message. Requesting new token:", error.message);
      client.send("requestNewToken");
      return;
    }
  }
  client.send(message);
}
function connect() {
  const client = new WebSocket("ws://localhost:8081");

  client.on("open", () => {
    console.log("Connected to server");
    reconnectAttempts = 0;

    // Jika ini adalah reconnect, minta token baru
    if (token) {
      sendMessage("requestNewToken");
    }

    client.on("message", (message) => {
      const data = JSON.parse(message);

      if (data.type === "setToken") {
        token = data.token;
        console.log("Received new JWT token");

        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          console.log("JWT verified. Cookie data:", decoded.cookie);
          console.log("Token expiration:", new Date(decoded.exp * 1000));
          console.log("Current time:", new Date());
          console.log("Token : ", token);
        } catch (error) {
          console.log("Invalid JWT:", error.message);
          if (error.name === 'TokenExpiredError') {
            console.log("Token expired. Requesting new token.");
            sendMessage("requestNewToken");
          } else {
            console.log("Invalid JWT. Requesting new token:", error.message);
            sendMessage("requestNewToken");
          }
        }
      } else if (data.type === "data") {
        if (token) {
          try {
            const decoded = jwt.verify(token, JWT_SECRET);
            console.log("Token payload:", decoded);
            console.log("Token expiration:", new Date(decoded.exp * 1000));
            console.log("Current time:", new Date());

            if (decoded.exp * 1000 > Date.now()) {
              console.log("Valid token. Received data:", data.payload);
            } else {
              console.log("Token expired. Requesting new token.");
              sendMessage("requestNewToken");
            }
          } catch (error) {
            console.log("Invalid JWT. Requesting new token:", error.message);
            sendMessage("requestNewToken");
          }
        } else {
          console.log("No JWT token. Ignoring data.");
        }
      }
    });

    client.on("close", (code) => {
      console.log(`Connection Lost with Code : ${code}`);
      token = null; // Reset token on disconnect
      reconnect();
    });
  });

  client.on("error", (error) => {
    console.log(`ERROR : ${error.message}`);
    reconnect();
  });
}

function reconnect() {
  if (reconnectAttempts < maxReconnectAttempts) {
    reconnectAttempts++;
    console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`);
    setTimeout(connect, 5000); // Wait 5 seconds before reconnecting
  } else {
    console.log("Max reconnect attempts reached. Stopping.");
  }
}

connect();