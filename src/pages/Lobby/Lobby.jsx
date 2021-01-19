import React, { useEffect } from 'react';
import io from 'socket.io-client';

const host = require('../../host');

let socket;

function Lobby() {
  useEffect(() => {
    console.log('useEffect');

    socket = io(host.SERVER, { withCredentials: true });
    console.log(socket);
    // socket.emit('room.list', (res) => {
    //   console.log(res);
    // });
  }, []);

  return <div>lobby</div>;
}

export default Lobby;
