import React, { useState } from 'react';
import getSocket from '../../utils/util';
import Rodal from 'react-modal';
import styles from './room.module.scss';

function Room({ room, num, setRoomId }) {
  const [roomPwInput, setRoomPwInput] = useState('');
  const [showRoomPwModal, setShowRoomPwModal] = useState(false);

  const handleRoomClick = () => {
    if (room.roomPw) {
      setShowRoomPwModal(true);
    } else {
      requestRoomJoin();
    }
  };

  const closeRoomPwModal = () => {
    setShowRoomPwModal(false);
    setRoomPwInput('');
  };

  const handleRoomPwInput = (e) => {
    setRoomPwInput(e.target.value);
  };

  const requestRoomJoin = (e) => {
    e.preventDefault();
    const roomId = room.roomId;
    const roomDto = {
      roomId,
      roomPw: room.roomPw ? roomPwInput : null,
    };
    getSocket()
      .then((socket) => {
        socket.emit('room.join', roomDto, (res) => {
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
      <Rodal
        isOpen={showRoomPwModal}
        onRequestClose={closeRoomPwModal}
        ariaHideApp={false}
      >
        <form onSubmit={requestRoomJoin}>
          <label>Password:</label>
          <input
            type="password"
            value={roomPwInput}
            onChange={handleRoomPwInput}
          />
          <button type="submit">Enter room</button>
        </form>
      </Rodal>
      {room.roomPw && <p>Locked</p>}
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
