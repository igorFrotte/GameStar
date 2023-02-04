import cors from "cors";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});

//vou tirar daqui
const board = [['','',''],['','',''],['','','']];
board[0][1] = '#454545';
board[0][0] = "url('https://lh3.googleusercontent.com/a/AEdFTp5v9jKEaBtXiLRVPrdb2FajCm6KQD98pq0kSfo5Kg=s96-c') no-repeat";


app.get("/status", (req, res) => {
  res.sendStatus(200);
});

app.post("/login", (req, res) => {
  res.sendStatus(200);
});

app.get("/token", (req, res) => {
  res.sendStatus(200);
});

app.get("/game", (req, res) => {
  res.sendFile('htmlFile/index.html', { root: './' });
});

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('msg', (data)=> {
    console.log(data);
    socket.emit('receiveMsg', {board});
  });
});

server.listen(5000, () => {
  console.log("Running on 5000");
});