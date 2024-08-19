
import clonerSocketHandler from "./routes/cloner.js";
import WebSocket from 'ws';
import express from "express";
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


app.use(express.json());
app.use('/sc', express.static('screenshots'))

/* app.use("/cloners", clonerRouter);
 */
app.get("/health", (req, res) => {
    res.status(200).send("OK");
});

server.listen(process.env.PORT_NUMBER, () => {
    console.log("Listening on port " + process.env.PORT_NUMBER);
}); 

wss.on('connection', (ws) => {
    console.log('Client connected');
    clonerSocketHandler(ws);
});