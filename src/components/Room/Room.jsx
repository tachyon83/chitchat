import React, { useState } from 'react';
import socketIo from '../../utils/util';
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

  const requestRoomJoin = () => {
    const roomId = room.roomId;
    const roomDto = {
      roomId,
      roomPw: room.roomPw ? roomPwInput : null,
    };
    socketIo
      .getSocket()
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

  const handleFormSubmit = (e) => {
    e.preventDefault();
    requestRoomJoin();
  };

  return (
    <div className={styles.room} onClick={handleRoomClick}>
      <Rodal
        isOpen={showRoomPwModal}
        onRequestClose={closeRoomPwModal}
        ariaHideApp={false}
      >
        <form onSubmit={handleFormSubmit}>
          <label>Password:</label>
          <input
            type="password"
            value={roomPwInput}
            onChange={handleRoomPwInput}
          />
          <button type="submit">Enter room</button>
        </form>
      </Rodal>

      <p className={styles.roomNum}>00{num + 1}</p>
      <p className={styles.roomTitle}>
        {room.roomTitle} {room.roomPw && <span>Locked</span>}
      </p>
      <p className={styles.roomOwner}>{room.roomOwner}</p>
      <p className={styles.roomCount}>
        {room.roomCnt} / {room.roomCapacity}
      </p>
    </div>
  );
}

export default Room;
