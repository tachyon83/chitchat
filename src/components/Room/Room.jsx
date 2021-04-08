import React, { useState } from 'react';
import socketIo from '../../utils/util';
import { FaLock } from 'react-icons/fa';
import Rodal from 'react-modal';
import styles from './room.module.scss';

function Room({ room, num, setRoomId, roomFoldId, setRoomFoldId }) {
  const [roomPwInput, setRoomPwInput] = useState('');
  const [showRoomPwModal, setShowRoomPwModal] = useState(false);

  const handleRoomClick = () => {
    // 접어두기 상태
    if (roomFoldId) {
      // 접어두기와 동일한 방
      if (roomFoldId === parseInt(room.roomId)) {
        socketIo.getSocket().then((socket) => {
          socket.off();
        });
        setRoomId(roomFoldId);
        setRoomFoldId(null);
      } else {
        // 접어두기와 다른 방
        alert('접어두기한 방이 있습니다. ');
      }
    } else {
      if (room.roomPw) {
        setShowRoomPwModal(true);
      } else {
        requestRoomJoin();
      }
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
          if (res.result) {
            socketIo.getSocket().then((socket) => {
              socket.off();
            });
            setRoomId(parseInt(roomId));
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
        {room.roomPw && (
          <span className={styles.lock}>
            <FaLock />
          </span>
        )}
        {room.roomTitle}
      </p>
      <p className={styles.roomOwner}>{room.roomOwner}</p>
      <p className={styles.roomCount}>
        {room.roomCnt} / {room.roomCapacity}
      </p>
    </div>
  );
}

export default Room;
