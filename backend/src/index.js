const express = require("express");
const {io} = require("socket.io-client");
const app = express();
const config = require("../config.json");
const cors = require('cors');

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000', // Allow only this origin
}));

app.post("/message", (req, res) => {
    res.header("Content-Type", "text/event-stream");
    res.header("Cache-Control", "no-cache");
    res.header("Connection", "keep-alive");

    if(!req.body) return res.status(400).json({error: "No conversation provided", code: 400});

    console.log(req.body)

    const sendEvent = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }

    const socket = io(config.socketURL);

    socket.on("connect", () => {
        sendEvent({event: 1, data: "Connected Successfully"});
    });

    socket.emit("message", req.body.conversation);

    socket.on("message", (data) => {
        if(data === "[END]"){
            return res.end();
        }
        sendEvent({event: 2, data})
    });



});

app.listen(5001, () => {
    console.log("API ON")
})