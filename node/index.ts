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
const board = [
  ['','','','',''],
  ['','','','',''],
  ['','','','',''],
  ['','','','',''],
  ['','','','','']
]; //sempre x por x
const boardInf = {
  players: [],
};

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

    if(boardInf.players.filter((e)=> e.googleId === data.googleId).length){
      move(data.googleId, data.key);
    }else{
      let positionX = 0;
      let positionY = 0;
      boardInf.players.push({...data, positionX, positionY});
      board[positionX][positionY] = data.picture;
    }

    socket.emit('receiveMsg', board); //n ta mandando pra tds
  });
});

function move( playerId, direction){
  const player = boardInf.players.filter((e)=> e.googleId === playerId)[0];
  if(direction === 'up' && player.positionX !== 0){
    board[player.positionX][player.positionY] = player.color;
    player.positionX--;
  }
  if(direction === 'down' && player.positionX < board.length-1){
    board[player.positionX][player.positionY] = player.color;
    player.positionX++;
  }
  if(direction === 'right' && player.positionY < board.length-1){
    board[player.positionX][player.positionY] = player.color;
    player.positionY++;
  }
  if(direction === 'left' && player.positionY !== 0){
    board[player.positionX][player.positionY] = player.color;
    player.positionY--;
  }
  board[player.positionX][player.positionY] = player.picture;
}

server.listen(5000, () => {
  console.log("Running on 5000");
});