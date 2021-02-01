import React, { useState, useEffect } from 'react';
import getSocket from '../../utils/util';
import Room from '../../components/Room/Room';
import ReactModal from 'react-modal';
import { useRecoilValue } from 'recoil';
import { UsernameState } from '../../recoil/atoms';

function RoomList({ setRoomId }) {
  const username = useRecoilValue(UsernameState);
  const [totalRoomData, setTotalRoomData] = useState([]);
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    roomTitle: '',
    roomPw: '',
    roomCapacity: 5,
  });

  const fetchRoomList = () => {
    getSocket().then((socket) => {
      socket.emit('room.list', (res) => {
        if (res.result) {
          setTotalRoomData(res.packet);
        } else {
          alert('Could not get room list');
        }
      });
    });
  };

  const refreshRoomList = () => {
    console.log('refresh room list');
    getSocket().then((socket) => {
      console.log('here');
      socket.on('room.list.refresh', (res) => {
        console.log('ROOM LIST REFRESH');
        console.log(res);
      });
    });
  };

  useEffect(() => {
    fetchRoomList();
    refreshRoomList();
  }, []);

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
      roomOwner: username,
    };
    getSocket().then((socket) => {
      socket.emit('room.create', roomData, (res) => {
        if (res.result) {
          alert('방 생성 성공');
          closeNewRoomModal();
          setRoomId(parseInt(res.packet));
        }
      });
    });
  };

  return (
    <div>
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
      <button onClick={handleNewRoomClick}>New Room +</button>
      {totalRoomData.map((room, i) => (
        <Room key={i} room={room} num={i} setRoomId={setRoomId} />
      ))}
    </div>
  );
}

export default RoomList;
