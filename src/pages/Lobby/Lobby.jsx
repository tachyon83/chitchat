import React, { useEffect } from 'react';
import getSocket from '../../utils/util';

function Lobby() {
  useEffect(() => {
    console.log('useEffect');

    getSocket().then((socket) =>
      socket.emit('room.list', (res) => {
        console.log(res);
      })
    );

    getSocket().then((socket) => console.log(socket));
  }, []);

  return <div>lobby</div>;
}

export default Lobby;
