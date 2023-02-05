import { useEffect, useState } from "react";
//import { gameIn } from "../services/axiosService";
import io from "socket.io-client";
import styled from "styled-components";

const socket = io.connect('http://localhost:5000/');

export default function Home() {

    const [board, setBoard] = useState([]);
    const [ready, setReady] = useState(false);
    const [score, setScore] = useState([]);

    useEffect(()=> {

        socket.on('receiveAct', (data) => {
            setBoard(data);
        });

        socket.on('resetGame', (data) => {
            setBoard([]);
            setReady(false);
            setScore([]);
        });

        socket.on('status', (data) => {
            alert('Acabou o tempo!');
            setScore(data);
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
        <>
            <button onClick={() => {
                let auth = JSON.parse(localStorage.getItem("gamestar"));
                sendMsg();
                setReady(!ready);
                socket.emit('ready', auth.googleId);
            } }> Clicke Aqui!</button>
            {ready? <div>Ready!</div> : ''}
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
        </>
    );
}

const Score = styled.div`
    & > div{
        display: flex;
    }
`;

const GameBoard = styled.div`
    & > div {
        display: flex;
    }
    & > div > div {
        height: 30px;
        width: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: white;
    }
    img, .color {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;