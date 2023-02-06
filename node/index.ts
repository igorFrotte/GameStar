import cors from "cors";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());
app.use(express.json());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://18.204.13.63/api',
    methods: ["GET", "POST"]
  }
});

//vou tirar daqui
function newGame(mirrorMode, time){
  const obj = {
    players: [],
    time,
    started: false,
    gameOver: false,
    mirrorMode,
    mirror: {
      mirrorBoard: [],
      mirrorColors: []
    },
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

  if(mirrorMode){
    obj.mirror = drivenMirror();
  }

  return obj;
}
let game = newGame(false, 60000);

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
  let { gameMode, gameTime } = req.body;

  if(!gameTime || isNaN(gameTime)){
    gameTime = 60000;
  }

  if( gameMode === 'mirror' ){
    game = newGame(true, gameTime);
  }else {
    game = newGame(false, gameTime);
  } 

  io.sockets.emit('resetGame', true);
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
    if(game.mirrorMode){
      io.sockets.emit('mirror', game.mirror);
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
  io.sockets.emit('time', game.time);
  setTimeout(() => {
    game.gameOver = true;
    if(!game.mirrorMode){
      io.sockets.emit('status', getWinner());
    }else {
      io.sockets.emit('status', false);
    }
  }, game.time);
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

function drivenMirror(){ //simulação do BD
  return {
    mirrorBoard: [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,1,1,1,0],
      [0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0],
      [0,1,0,0,0,1,0,0,1,0,0,1,0,0,0,0,1,0,0,0],
      [0,1,0,0,0,1,0,0,1,1,1,1,0,0,0,0,1,0,0,0],
      [0,1,0,0,0,1,0,0,1,1,0,0,0,0,0,0,1,0,0,0],
      [0,1,0,0,1,0,0,0,1,0,1,0,0,0,0,0,1,0,0,0],
      [0,1,1,1,0,0,0,0,1,0,0,1,0,0,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,0,0,0,1,0,0,1,1,1,1,0,0,1,0,0,0,1,0],
      [0,1,0,0,0,1,0,0,1,0,0,0,0,0,1,1,0,0,1,0],
      [0,0,1,0,1,0,0,0,1,0,0,0,0,0,1,1,1,0,1,0],
      [0,0,1,0,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,0],
      [0,0,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,1,1,0],
      [0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,1,0],
      [0,0,0,1,0,0,0,0,1,1,1,1,0,0,1,0,0,0,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ],
    mirrorColors: ['#484848','#f23e93']
  }
}

function newPlayer(data) {
  let positionX = getRandomInt(game.board.length);
  let positionY = getRandomInt(game.board.length);
  const player = {
    ...data, 
    positionX, 
    positionY, 
    color: getRandomColor(),
    ready: false
  };

  if(game.mirrorMode){
    player.color = game.mirror.mirrorColors[game.players.length % game.mirror.mirrorColors.length];
  }

  game.players.push(player);
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