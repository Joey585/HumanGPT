const express = require("express");
const {io} = require("socket.io-client");
const app = express();
const config = require("../config.json");
const cors = require('cors');

app.use(express.json());

app.use((req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    console.log(`Endpoint accessed: ${req.method} ${req.url} | IP: ${clientIp}`);
    next();
});

app.use(cors({
    origin: 'http://localhost:5003', // Allow only this origin
}));

app.post("/message", (req, res) => {
    res.header("Content-Type", "text/event-stream");
    res.header("Cache-Control", "no-cache");
    res.header("Connection", "keep-alive");

    if(!req.body) return res.status(400).json({error: "No conversation provided", code: 400});

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

app.listen(5004, () => {
    console.log("API ON")
})
