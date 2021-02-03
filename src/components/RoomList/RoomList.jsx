import React, { useState, useEffect } from 'react';
import getSocket from '../../utils/util';
import Room from '../../components/Room/Room';
import Rodal from 'react-modal';
import { useRecoilValue, useRecoilState } from 'recoil';
import {
  UsernameState,
  RoomListState,
  RoomListIdState,
  RefreshState,
} from '../../recoil/atoms';

function RoomList({ setRoomId }) {
  // Recoil Values
  const username = useRecoilValue(UsernameState);
  const [roomListState, setRoomListState] = useRecoilState(RoomListState);
  const roomListIdState = useRecoilValue(RoomListIdState);
  const [refreshState, setRefreshState] = useRecoilState(RefreshState);

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
          setRoomListState(res.packet);
        } else {
          alert('Could not get room list');
        }
      });
    });
  };

  const refreshRoomList = () => {
    getSocket().then((socket) => {
      socket.on('room.list.refresh', (res) => {
        const changedRoom = res.packet;
        const existingRoom =
          roomListState.filter((room) => room.roomId === changedRoom.roomId)
            .length > 0;
        // 기존 방
        if (existingRoom) {
          // 기존 방 - 삭제
          if (changedRoom.roomCnt === 0) {
            setRoomListState([
              ...roomListState,
              roomListState.filter(
                (room) => room.roomId !== changedRoom.roomId
              ),
            ]);
          } else {
            // 기존 방 - 업데이트
            setRoomListState([
              ...roomListState,
              roomListState.map((room) => {
                if (room.roomId === changedRoom.roomId) {
                  return changedRoom;
                }
                return room;
              }),
            ]);
          }
        } else {
          // 새로운 방
          setRoomListState([...roomListState, changedRoom]);
        }
      });
    });
  };

  useEffect(() => {
    fetchRoomList();
  }, []);

  useEffect(() => {
    if (!refreshState) {
      refreshRoomList();
      setRefreshState(true);
    }
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
