import React, { useEffect, useState } from 'react';
import getSocket from '../../utils/util';
import ReactModal from 'react-modal';
import Container from '../../components/Container/Container';
import Room from '../../components/Room/Room';
import styles from './lobby.module.scss';

function Lobby() {
  const [userUpdate, setUserUpdate] = useState(false);
  const [totalRoomData, setTotalRoomData] = useState([]);
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    roomTitle: '',
    roomPw: '',
    roomCapacity: 5,
  });

  const fetchRoomList = () => {
    console.log('Fetching room list');
    getSocket().then((socket) => {
      socket.emit('room.list', (res) => {
        if (res.result) {
          console.log(res.packet);
          setTotalRoomData(res.packet);
        } else {
          alert('Could not get room list');
        }
      });
    });
  };

  useEffect(() => {
    fetchRoomList();
  }, []);

  useEffect(() => {
    if (userUpdate) {
      fetchRoomList();
      setUserUpdate(false);
    }
  }, [userUpdate]);

  const handleNewRoomClick = () => {
    setShowNewRoomModal(true);
  };

  const closeNewRoomModal = () => {
    setShowNewRoomModal(false);
    setNewRoomData({
      roomTitle: '',
      roomPw: '',
      roomCapacity: 5,
    });
  };

  const handleNewRoomInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoomData({ ...newRoomData, [name]: value });
  };

  const handleAddNewRoom = (e) => {
    e.preventDefault();
    const { roomTitle, roomPw, roomCapacity } = newRoomData;
    if (!roomTitle || !roomCapacity) {
      alert('Fill in the blanks');
      return;
    }
    const roomData = {
      roomId: null,
      roomPw: roomPw === '' ? null : roomPw,
      roomTitle,
      roomCnt: null,
      roomCapacity,
      // ROOM OWNER ?????????
      roomOwner: 'paul',
    };
    getSocket().then((socket) => {
      socket.emit('room.create', roomData, (res) => {
        if (res.result) {
          alert('방 생성 성공');
          setUserUpdate(true);
          closeNewRoomModal();
        }
      });
    });
  };

  return (
    <Container>
      <ReactModal
        isOpen={showNewRoomModal}
        onRequestClose={closeNewRoomModal}
        ariaHideApp={false}
      >
        <form onSubmit={handleAddNewRoom}>
          <label>Name:</label>
          <input
            type="text"
            name="roomTitle"
            value={newRoomData.roomTitle}
            onChange={handleNewRoomInputChange}
          />
          <label>Password:</label>
          <input
            type="password"
            name="roomPw"
            value={newRoomData.roomPw}
            onChange={handleNewRoomInputChange}
          />
          <label>Capacity:</label>
          <input
            type="text"
            name="roomCapacity"
            value={newRoomData.roomCapacity}
            onChange={handleNewRoomInputChange}
          />
          <button type="submit">Add New Room</button>
        </form>
      </ReactModal>
      <div className={styles.body}>
        <div className={styles.sidebar}>sidebar</div>
        <div className={styles.rightBody}>
          <button onClick={handleNewRoomClick}>New Room +</button>
          {totalRoomData.map((room, i) => (
            <Room key={i} room={room} num={i} />
          ))}
        </div>
      </div>
    </Container>
  );
}

export default Lobby;
