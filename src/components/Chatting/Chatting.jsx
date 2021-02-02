import React, { useEffect, useState } from 'react';
import getSocket from '../../utils/util';
import { useRecoilValue } from 'recoil';
import { UsernameState } from '../../recoil/atoms';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

function Chatting({ roomId, setRoomId }) {
  const username = useRecoilValue(UsernameState);
  const [roomInfo, setRoomInfo] = useState({});
  const [userInput, setUserInput] = useState({
    roomTitle: '',
    roomPw: '',
    roomCapacity: 0,
  });
  const [userUpdate, setUserUpdate] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInput({ ...userInput, [name]: value });
  };

  const handleEditButton = () => {
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const { roomTitle, roomPw, roomCapacity } = userInput;
    if (roomTitle === '') {
      alert('Enter a valid name');
      return;
    } else if (!roomCapacity) {
      alert('Enter valid room capacity');
      return;
    }
    const roomDto = {
      ...roomInfo,
      roomTitle,
      roomPw: roomPw || null,
      roomCapacity: parseInt(roomCapacity),
    };
    console.log(roomDto);
    getSocket().then((socket) => {
      socket.emit('room.update', roomDto, (res) => {
        if (res.result) {
          closeEditModal();
          setUserUpdate(true);
        } else {
          alert('Failed to leave room');
        }
      });
    });
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setUserInput({
      roomTitle: roomInfo.roomTitle,
      roomPw: '',
      roomCapacity: roomInfo.roomCapacity,
    });
  };

  const handleLeave = () => {
    getSocket().then((socket) => {
      socket.emit('room.leave', (res) => {
        if (res.result) {
          setRoomId(null);
        } else {
          alert('Failed to leave room');
        }
      });
    });
  };

  const getRoomInfo = () => {
    getSocket().then((socket) => {
      socket.emit('room.info', (res) => {
        setRoomInfo(res.packet);
        const { roomTitle, roomCapacity } = res.packet;
        setUserInput({ ...userInput, roomTitle, roomCapacity });
      });
    });
  };

  useEffect(() => {
    getRoomInfo();

    return () => {
      getSocket().then((socket) => {
        socket.emit('room.leave', (res) => {
          if (!res.result) {
            alert('Failed to leave room');
          }
        });
      });
    };
  }, []);

  useEffect(() => {
    if (userUpdate) {
      console.log('user update');
      getRoomInfo();
      setUserUpdate(false);
    }
  }, [userUpdate]);

  if (!roomInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={handleLeave}>Leave room</button>
      <p>Currently in room {roomId}</p>
      <p>
        {roomInfo.roomOwner === username && (
          <button onClick={handleEditButton}>정보 바꾸기</button>
        )}
      </p>

      {/* Modal */}
      <Rodal visible={showEditModal} onClose={closeEditModal}>
        <form>
          <div>
            <label>Room name:</label>
            <input
              type="text"
              name="roomTitle"
              value={userInput.roomTitle}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Room password:</label>
            <input
              type="password"
              name="roomPw"
              value={userInput.roomPw}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Room capacity:</label>
            <input
              type="number"
              name="roomCapacity"
              value={userInput.roomCapacity}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" onClick={handleEditSubmit}>
            수정
          </button>
        </form>
      </Rodal>
    </div>
  );
}

export default Chatting;
