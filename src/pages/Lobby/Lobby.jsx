import React, { useEffect } from 'react';
import io from 'socket.io-client';
import socketIo from '../../utils/util';

const host = require('../../host');

async function getSocket() {
  return await socketIo.getSocket();
}

const ENDPOINT = host.SERVER;

console.log('here');

function Lobby() {
  useEffect(() => {
    console.log('useEffect');

    // getSocket().then((socket) =>
    //   socket.emit('roomList', (res) => {
    //     console.log('hello');
    //     console.log(res);
    //   })
    // );

    // console.log('a');

    // getSocket().then((socket) =>
    //   socket.emit('room.list', (res) => {
    //     console.log(res);
    //   })
    // );

    const socket = io(ENDPOINT, {
      withCredentials: true,
    });

    console.log(socket);

    socket.emit('room.list', (res) => {
      console.log('aaa');
      console.log(res);
    });

    socket.emit('room.list', (res) => {
      console.log('bbbb');
      console.log(res);
    });

    const testing = () => {
      console.log('testing');
      socket.on('roomList', (res) => console.log(res));
      socket.emit('roomList', (res) => console.log(res));
    };

    testing();
  }, []);

  return <div>lobby</div>;
}

export default Lobby;
