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
    started: false,
    gameOver: false,
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
let game = newGame();

app.get("/status", (req, res) => {
  res.sendStatus(200);
});

app.post("/login", (req, res) => {
  res.sendStatus(200);
});

app.get("/token", (req, res) => {
  res.sendStatus(200);
});

app.post("/adm", (req, res) => {
  game = newGame();
  res.send("game resetado! :)").status(200);
});

io.on('connection', (socket) => {

  socket.on('act', (data)=> {
    if(game.players.filter((e)=> e.googleId === data.googleId).length){
      if(game.started && !game.gameOver){
        move(data.googleId, data.key);
      }
    }else{
      if(!game.gameOver){
        newPlayer(data);
      }
    }
    io.sockets.emit('receiveAct', game.board);
  });

  socket.on('ready', (data)=> {
    const player = game.players.filter((e)=> e.googleId === data)[0];
    player.ready = !player.ready;
    if(game.players.filter((e)=> e.ready === true).length > 1 && !game.started){
      startGame();
    }
  });

});

function startGame(){
  game.started = true;
  setTimeout(() => {
    game.gameOver = true;
    io.sockets.emit('status', getWinner());
  }, 60000);
}

function getWinner() {
  const hashList = {};
  const aux = [];
  const obj = [];
  for(let i=0; i< game.board.length; i++){
    for(let j=0; j< game.board.length; j++){
      let item = game.board[i][j];
      if(item){
        if(hashList[item]){
          hashList[item] = hashList[item] + 1;
        }else {
          hashList[item] = 1;
          aux.push(item);
        }
      }
    }
  }
  for(let i=0; i< aux.length; i++){
    if(aux[i].length<8){
      let player = game.players.filter((e)=> e.color === aux[i])[0];
      obj.push({
        name: player.name,
        score: hashList[aux[i]]
      });
    }
  }
  return obj;
}

function newPlayer(data) {
  let positionX = getRandomInt(game.board.length);
  let positionY = getRandomInt(game.board.length);
  game.players.push({
    ...data, 
    positionX, 
    positionY, 
    color: getRandomColor(),
    ready: false
  });
  game.board[positionX][positionY] = data.picture;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
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