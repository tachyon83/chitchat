import React, { useState, useEffect } from 'react';
import socketIo from '../../utils/util';
import Room from '../../components/Room/Room';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import styles from './roomlist.module.scss';
import { useRecoilValue } from 'recoil';
import { UsernameState } from '../../recoil/atoms';

function RoomList({
  roomFoldId,
  setRoomFoldId,
  setRoomId,
  setUserList,
  setGroupList,
}) {
  const username = useRecoilValue(UsernameState);
  const [roomList, setRoomList] = useState([]);
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    roomTitle: '',
    roomPw: '',
    roomCapacity: 5,
  });

  const fetchRoomList = () => {
    socketIo.getSocket().then((socket) => {
      socket.emit('room.list', (res) => {
        if (res.result) {
          setRoomList(res.packet);
        } else {
          alert('Could not get room list');
        }
      });
    });
  };

  const refreshRoomList = () => {
    socketIo.getSocket().then((socket) => {
      socket.on('room.list.refresh', (res) => {
        fetchRoomList();
      });
    });
  };

  const fetchUserList = () => {
    socketIo.getSocket().then((socket) => {
      socket.emit('user.listInLobby', (res) => {
        if (res.result) {
          setUserList(res.packet);
        }
      });
    });
  };

  const refreshUserList = () => {
    socketIo.getSocket().then((socket) => {
      socket.on('user.listInLobby.refresh', (res) => {
        if (res.result) {
          const { userId, isOnline } = res.packet;
          if (isOnline) {
            setUserList((prevState) => [userId, ...prevState]);
          } else {
            setUserList((prevState) =>
              prevState.filter((name) => name !== userId)
            );
          }
        }
      });
    });
  };

  const fetchGroupList = () => {
    socketIo.getSocket().then((socket) => {
      socket.emit('group.list', (res) => {
        if (res.result) {
          setGroupList(res.packet);
        }
      });
    });
  };

  const refreshGroupList = () => {
    socketIo.getSocket().then((socket) => {
      socket.on('group.list.refresh', (res) => {
        if (res.result) {
          const { groupId, isOnline } = res.packet;
          if (isOnline) {
            setGroupList((prevState) => [groupId, ...prevState]);
          } else {
            setGroupList((prevState) =>
              prevState.filter((group) => group !== groupId)
            );
          }
        }
      });
    });
  };

  useEffect(() => {
    fetchRoomList();
    refreshRoomList();
    fetchUserList();
    refreshUserList();
    fetchGroupList();
    refreshGroupList();

    return () => {
      // socketIo.getSocket().then((socket) => {
      //   socket.off('room.list.refresh');
      //   socket.off('user.listInLobby.refresh');
      //   socket.off('group.list.refresh');
      // });
    };
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
    socketIo.getSocket().then((socket) => {
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
      <button className={styles.newRoomButton} onClick={handleNewRoomClick}>
        New Room +
      </button>
      {roomList.map((room, i) => (
        <Room
          key={i}
          room={room}
          num={i}
          setRoomId={setRoomId}
          roomFoldId={roomFoldId}
          setRoomFoldId={setRoomFoldId}
        />
      ))}

      <Rodal visible={showNewRoomModal} onClose={closeNewRoomModal}>
        <form onSubmit={handleAddNewRoom} className={styles.newRoomModalForm}>
          <div className={styles.row}>
            <label>Name:</label>
            <input
              type="text"
              name="roomTitle"
              value={newRoomData.roomTitle}
              onChange={handleNewRoomInputChange}
              placeholder={'Enter room name'}
            />
          </div>
          <div className={styles.row}>
            <label>Password:</label>
            <input
              type="password"
              name="roomPw"
              value={newRoomData.roomPw}
              onChange={handleNewRoomInputChange}
              placeholder={'Enter room password'}
            />
          </div>
          <div className={styles.row}>
            <label>Capacity:</label>
            <input
              type="text"
              name="roomCapacity"
              value={newRoomData.roomCapacity}
              onChange={handleNewRoomInputChange}
              placeholder={'Enter room capacity'}
            />
          </div>
          <button type="submit">Add New Room</button>
        </form>
      </Rodal>
    </div>
  );
}

export default RoomList;
