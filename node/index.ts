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
function newGame(){
  return {
    players: [],
    board: [
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','',''],
      ['','','','','','','','','','','','','','','','','','','','']
    ]
  };
}
const game = newGame();

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

  socket.on('msg', (data)=> {
    if(game.players.filter((e)=> e.googleId === data.googleId).length){
      move(data.googleId, data.key);
    }else{
      let positionX = getRandomInt(game.board.length);
      let positionY = getRandomInt(game.board.length);
      game.players.push({...data, positionX, positionY, color:'#'+(game.players.length+3)*111});
      game.board[positionX][positionY] = data.picture;
    }
    io.sockets.emit('receiveMsg', game.board); 
  });

});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function move( playerId, direction){
  const player = game.players.filter((e)=> e.googleId === playerId)[0];
  if(direction === 'up' && player.positionX !== 0){
    game.board[player.positionX][player.positionY] = player.color;
    player.positionX--;
  }
  if(direction === 'down' && player.positionX < game.board.length-1){
    game.board[player.positionX][player.positionY] = player.color;
    player.positionX++;
  }
  if(direction === 'right' && player.positionY < game.board.length-1){
    game.board[player.positionX][player.positionY] = player.color;
    player.positionY++;
  }
  if(direction === 'left' && player.positionY !== 0){
    game.board[player.positionX][player.positionY] = player.color;
    player.positionY--;
  }
  game.board[player.positionX][player.positionY] = player.picture;
}

server.listen(5000, () => {
  console.log("Running on 5000");
});