import { useEffect, useState } from "react";
//import { gameIn } from "../services/axiosService";
import io from "socket.io-client";
import styled from "styled-components";

const socket = io.connect('http://app_node:5000');

export default function Home() {

    const [board, setBoard] = useState([]);
    const [ready, setReady] = useState(false);
    const [score, setScore] = useState([]);
    const [mirror, setMirror] = useState({ mirrorBoard:[], mirrorColors: [] });
    const [time, setTime] = useState(0);

    useEffect(() => {
        setTimeout( () => {
            if(time){
               setTime(time-1); 
            }
        }, 1000);
    }, [time]);

    useEffect(()=> {

        socket.on('receiveAct', (data) => {
            setBoard(data);
        });

        socket.on('mirror', (data) => {
            setMirror(data);
        });

        socket.on('time', (data) => {
            setTime(data/1000);
        });

        socket.on('resetGame', (data) => {
            setBoard([]);
            setReady(false);
            setScore([]);
            setMirror({ mirrorBoard:[], mirrorColors: [] });
        });

        socket.on('status', (data) => {
            alert('Acabou o tempo!');
            if(data){
              setScore(data);  
            }
        });
        
        window.addEventListener('keydown', (event) => {
            if(event.key === 'W' || event.key === 'w' || event.key === 'ArrowUp'){
                sendMsg('up');
            }
            if(event.key === 'S' || event.key === 's' || event.key === 'ArrowDown'){
                sendMsg('down');
            }
            if(event.key === 'D' || event.key === 'd' || event.key === 'ArrowRight'){
                sendMsg('right');
            }
            if(event.key === 'A' || event.key === 'a' || event.key === 'ArrowLeft'){
                sendMsg('left');
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    const sendMsg = (key = null)=> {
        let obj = JSON.parse(localStorage.getItem("gamestar"));
        if(key){
            obj = {...obj, key};
        }
        socket.emit('act', obj); 
    }

    return (
        <Page>
            <button onClick={() => {
                let auth = JSON.parse(localStorage.getItem("gamestar"));
                sendMsg();
                setReady(!ready);
                socket.emit('ready', auth.googleId);
            } }> Clicke Aqui!</button>
            {ready? <div>Ready!</div> : ''}
            {time}
            <GameBoard>
                {board.map((e,i) => {
                    return <div key={i}>
                        {e.map( (ele, ind) => {
                            return <div key={ind}>
                                {ele.length>8?
                                    <img alt="item" src={ele}/> :
                                    <div className="color" style={{backgroundColor: ele}}></div>
                                }
                            </div>;
                        })}
                    </div>;
                })}
            </GameBoard>
            <Score>
                {score.length? score.map( (e,i) => {
                    return <div key={i}>
                        <div>{e.name} :</div>
                        <div>{e.score}</div>
                    </div>;
                }) : ''}
            </Score>
            <GameBoard>
                {mirror.mirrorBoard.map((e,i) => {
                    return <div key={i}>
                        {e.map( (ele, ind) => {
                            return <div key={ind}>
                                <div className="mirror" style={{backgroundColor: mirror.mirrorColors[ele]}}></div>
                            </div>;
                        })}
                    </div>;
                })}
            </GameBoard>
        </Page>
    );
}

const Score = styled.div`
    margin-top: 20px;

    & > div{
        display: flex;
    }
`;

const Page = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const GameBoard = styled.div`
    margin-top: 20px;

    & > div {
        display: flex;
    }
    & > div > div {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
    }
    img, .color {
        height: 20px;
        width: 20px;
        object-fit: cover;
    }
    .mirror {
        height: 10px;
        width: 10px;
    }
`;
