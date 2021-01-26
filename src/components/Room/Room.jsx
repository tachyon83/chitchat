import React from 'react';
import getSocket from '../../utils/util';
import styles from './room.module.scss';

function Room({ room, num }) {
  const handleRoomClick = () => {
    const roomId = room.roomId;
    getSocket().then((socket) => {
      socket.emit('room.join', roomId, (res) => {
        console.log(res);
        if (res.result) {
          alert('ROOM ENTERED');
        } else {
          alert('Could not enter room');
        }
      });
    });
    console.log(roomId);
    console.log('enter room');
  };

  return (
    <div className={styles.room} onClick={handleRoomClick}>
      <p>{num + 1}</p>
      <p>{room.roomTitle}</p>
      <p>{room.roomOwner}</p>
      <p>
        {room.roomCnt} / {room.roomCapacity}
      </p>
    </div>
  );
}

export default Room;
