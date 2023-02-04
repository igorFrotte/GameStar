import { useEffect, useState } from "react";
//import { gameIn } from "../services/axiosService";
import io from "socket.io-client";

const socket = io.connect('http://localhost:5000/');

export default function Login() {

    const [page, setPage] = useState();

    useEffect(()=> {
        socket.on('receiveMsg', (data) => {
            console.log(data);
            setPage(data.msg);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    const sendMsg = ()=> {
       socket.emit('msg', { msg:'oi' }); 
    }

    return (
        <>
            <button onClick={sendMsg}> Clicke Aqui!</button>
            <p>{page}</p>
        </>
    );
}