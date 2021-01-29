import React from 'react';
import getSocket from '../../utils/util';
import styles from './room.module.scss';

function Room({ room, num, setRoomId }) {
  const handleRoomClick = () => {
    const roomId = room.roomId;
    console.log(`joining room ${roomId}...`);
    getSocket()
      .then((socket) => {
        socket.emit('room.join', roomId, (res) => {
          console.log(res);
          if (res.result) {
            setRoomId(parseInt(roomId));
            console.log(`enter room ${roomId}`);
          } else {
            alert('Could not enter room');
          }
        });
      })
      .catch((err) => console.log(err));
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
