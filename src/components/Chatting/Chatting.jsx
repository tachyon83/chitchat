import React, { useEffect, useState } from 'react';
import socketIo from '../../utils/util';
import { useRecoilValue } from 'recoil';
import { UsernameState } from '../../recoil/atoms';
import styles from './chatting.module.scss';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import Chat from '../Chat/Chat';

function Chatting({ roomId, setRoomId }) {
  const username = useRecoilValue(UsernameState);
  const [roomInfo, setRoomInfo] = useState({});
  const [userEditInput, setUserEditInput] = useState({
    roomTitle: '',
    roomPw: '',
    roomCapacity: 0,
  });
  const [userUpdate, setUserUpdate] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sendTo, setSendTo] = useState('all');
  const [chatInput, setChatInput] = useState('');
  const [chatData, setChatData] = useState([]);

  const chatType = [
    { id: 'all', name: 'All' },
    { id: 'group', name: 'Group' },
    { id: 'whisper', name: 'Whisper' },
  ];

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setUserEditInput({ ...userEditInput, [name]: value });
  };

  const handleEditButton = () => {
    socketIo.getSocket().then((socket) => {
      socket.emit('room.info', (res) => {
        setRoomInfo(res.packet);
        const { roomTitle, roomCapacity } = res.packet;
        setUserEditInput({ ...userEditInput, roomTitle, roomCapacity });
        if (res.packet.roomOwner !== username) {
          alert("You don't have access.");
          return;
        } else {
          setShowEditModal(true);
        }
      });
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const { roomTitle, roomPw, roomCapacity } = userEditInput;
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
    socketIo.getSocket().then((socket) => {
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
    setUserEditInput({
      roomTitle: roomInfo.roomTitle,
      roomPw: '',
      roomCapacity: roomInfo.roomCapacity,
    });
  };

  const handleLeave = () => {
    socketIo.getSocket().then((socket) => {
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
    socketIo.getSocket().then((socket) => {
      socket.emit('room.info', (res) => {
        setRoomInfo(res.packet);
        const { roomTitle, roomCapacity } = res.packet;
        setUserEditInput({ ...userEditInput, roomTitle, roomCapacity });
      });
    });
  };

  const handleChatInputChange = (e) => {
    setChatInput(e.target.value);
  };

  const setSendSelect = (e) => {
    setSendTo(e.target.value);
  };

  const handleSendChat = (e) => {
    e.preventDefault();

    const chatDto = {
      from: username,
      to: null,
      text: chatInput,
      type: sendTo,
    };

    socketIo.getSocket().then((socket) => {
      socket.emit('chat.out', chatDto, (res) => {
        console.log(res);
      });
    });
    setChatInput('');
  };

  useEffect(() => {
    getRoomInfo();

    return () => {
      socketIo.getSocket().then((socket) => {
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
      getRoomInfo();
      setUserUpdate(false);
    }
  }, [userUpdate]);

  useEffect(() => {
    socketIo.getSocket().then((socket) => {
      socket.on('chat.in', (res) => {
        if (res.result) {
          console.log(res.packet);
          setChatData((prevChatData) => [...prevChatData, res.packet]);
        }
      });
    });
  }, []);

  if (!roomInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <p>Currently in Room {roomId}</p>
      <div className={styles.topDesc}>
        <button onClick={handleLeave} className={styles.leaveButton}>
          Leave Room
        </button>
        <button onClick={handleEditButton}>Edit Room</button>
      </div>

      <div className={styles.chattingContainer}>
        <div>
          {chatData.map((chat, i) => (
            <Chat key={i} chat={chat} />
          ))}
        </div>
      </div>

      <div className={styles.inputWrapper}>
        <form onSubmit={handleSendChat}>
          <select value={sendTo} onChange={setSendSelect}>
            {chatType.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={chatInput}
            onChange={handleChatInputChange}
          />
          <button type="submit" onClick={handleSendChat}>
            Send
          </button>
        </form>
      </div>

      {/* Modal */}
      <Rodal visible={showEditModal} onClose={closeEditModal}>
        <form>
          <div>
            <label>Room name:</label>
            <input
              type="text"
              name="roomTitle"
              value={userEditInput.roomTitle}
              onChange={handleEditInputChange}
            />
          </div>
          <div>
            <label>Room password:</label>
            <input
              type="password"
              name="roomPw"
              value={userEditInput.roomPw}
              onChange={handleEditInputChange}
            />
          </div>
          <div>
            <label>Room capacity:</label>
            <input
              type="number"
              name="roomCapacity"
              value={userEditInput.roomCapacity}
              onChange={handleEditInputChange}
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
