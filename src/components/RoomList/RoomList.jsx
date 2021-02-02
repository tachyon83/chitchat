import React, { useState, useEffect } from 'react';
import getSocket from '../../utils/util';
import Room from '../../components/Room/Room';
import Rodal from 'react-modal';
import { useRecoilValue, useRecoilState } from 'recoil';
import { UsernameState, RoomListState } from '../../recoil/atoms';

function RoomList({ setRoomId }) {
  // Recoil Values
  const username = useRecoilValue(UsernameState);
  const [roomListState, setRoomListState] = useRecoilState(RoomListState);

  // useState Values
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
          console.log(res.packet);
          setRoomListState(res.packet);
        } else {
          alert('Could not get room list');
        }
      });
    });
  };

  // const refreshRoomList = () => {
  //   console.log('refresh room list');
  //   getSocket().then((socket) => {
  //     console.log('here');
  //     socket.on('room.list.refresh', (res) => {
  //       console.log('ROOM LIST REFRESH');
  //       console.log(res);
  //     });
  //   });
  // };

  useEffect(() => {
    fetchRoomList();
    // refreshRoomList();
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
          closeNewRoomModal();
          setRoomId(parseInt(res.packet));
        }
      });
    });
  };

  return (
    <div>
      <Rodal
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
      </Rodal>
      <button onClick={handleNewRoomClick}>New Room +</button>
      {roomListState.map((room, i) => (
        <Room key={i} room={room} num={i} setRoomId={setRoomId} />
      ))}
    </div>
  );
}

export default RoomList;
