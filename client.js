const WebSocket = require("ws");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "secret";

let token = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

function connect() {
  const client = new WebSocket("ws://localhost:8081");

  client.on("open", () => {
    console.log("Connected to server");
    reconnectAttempts = 0;

    // Jika ini adalah reconnect, minta token baru
    if (token) {
      client.send("requestNewToken");
    }

    client.on("message", (message) => {
      const data = JSON.parse(message);

      if (data.type === "setToken") {
        token = data.token;
        console.log("Received new JWT token");

        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          console.log("JWT verified. Cookie data:", decoded.cookie);
          console.log("Token : ", token);
        } catch (error) {
          console.log("Invalid JWT:", error.message);
        }
      } else if (data.type === "data") {
        if (token) {
          try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const cookieData = decoded.cookie;

            if (new Date(cookieData.expiresAt) > new Date()) {
              console.log("Valid cookie. Received data:", data.payload);
            } else {
              console.log("Cookie expired. Requesting new token.");
              client.send("requestNewToken");
            }
          } catch (error) {
            console.log("Invalid JWT. Requesting new token:", error.message);
            client.send("requestNewToken");
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