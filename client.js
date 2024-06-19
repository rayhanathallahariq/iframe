const WebSocket = require("ws");

const client = new WebSocket("ws://localhost:8081",{
    headers : {
        'Authorization': '123456789'
      }
});

//handling the event when the connection to server succsess
client.on("open", ()=>{
    console.log("connected");

    client.on("close", (code)=>{
        console.log(`Connection Lost with Code : ${code}`);
    })
})

client.on("message",(message)=>{
    console.log(`${message}`);
})

client.on("error", (error)=>{
    console.log(`ERROR : ${error.message}`);
})
