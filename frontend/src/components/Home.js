import { useEffect, useState } from "react";
//import { gameIn } from "../services/axiosService";
import io from "socket.io-client";
import styled from "styled-components";

const socket = io.connect('http://localhost:5000/');

export default function Login() {

    const [board, setBoard] = useState([]);

    useEffect(()=> {
        socket.on('receiveMsg', (data) => {
            console.log(data);
            setBoard(data);
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

    console.log(board);

    const sendMsg = (key = null)=> {
        const auth = JSON.parse(localStorage.getItem("gamestar"));
        let obj = {...auth};
        if(key){
            obj = {...obj, key};
        }
        socket.emit('msg', obj); 
    }

    return (
        <>
            <button onClick={() => sendMsg() }> Clicke Aqui!</button>
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
        </>
    );
}

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