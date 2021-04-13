import React, { useEffect, useState } from 'react';
import socketIo from '../../utils/util';
import { useRecoilValue } from 'recoil';
import { UsernameState } from '../../recoil/atoms';
import styles from './chatting.module.scss';
import ScrollToBottom, { useAtTop } from 'react-scroll-to-bottom';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import Chat from '../Chat/Chat';

const Content = ({ handleChatRead, chatData, setCurrentGroup }) => {
  const [top] = useAtTop();

  useEffect(() => {
    if (top) {
      handleChatRead();
    }
  }, [top]);

  return (
    <>
      {chatData.map((chat, i) => (
        <Chat key={i} chat={chat} setCurrentGroup={setCurrentGroup} />
      ))}
    </>
  );
};

function Chatting({
  roomId,
  setRoomId,
  userList,
  setUserList,
  setGroupList,
  setRoomFoldId,
  currentGroup,
  setCurrentGroup,
}) {
  const username = useRecoilValue(UsernameState);
  const [roomName, setRoomName] = useState('');
  const [roomInfo, setRoomInfo] = useState({});
  const [userEditInput, setUserEditInput] = useState({
    roomTitle: '',
    roomPw: '',
    roomCapacity: 0,
  });
  const [userUpdate, setUserUpdate] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [sendTo, setSendTo] = useState('all');
  const [whisperTarget, setWhisperTarget] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatData, setChatData] = useState([]);
  const [pastIdArr, setPastIdArr] = useState([]);

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
          socket.off();
          setRoomId(null);
        } else {
          alert('Failed to leave room');
        }
      });
    });
  };

  const handleFoldButton = () => {
    socketIo.getSocket().then((socket) => {
      socket.off();
      setRoomFoldId(roomId);
      setRoomId(null);
    });
  };

  const getRoomInfo = () => {
    socketIo.getSocket().then((socket) => {
      socket.emit('room.info', (res) => {
        setRoomInfo(res.packet);
        const { roomTitle, roomCapacity } = res.packet;
        setRoomName(roomTitle);
        setUserEditInput({ ...userEditInput, roomTitle, roomCapacity });
      });
    });
  };

  const refreshRoomInfo = () => {
    socketIo.getSocket().then((socket) => {
      socket.on('room.info.refresh', (res) => {
        console.log(res);
        if (res.result) {
          setRoomName(res.packet.roomTitle);
          setRoomInfo(res.packet);
        }
      });
    });
  };

  const handleChatInputChange = (e) => {
    setChatInput(e.target.value);
  };

  const setSendSelect = (e) => {
    setSendTo(e.target.value);
  };

  const onWhisperTargetSelect = (e) => {
    setWhisperTarget(e.target.value);
  };

  const handleSendChat = (e) => {
    e.preventDefault();

    if (!chatInput) {
      return;
    }

    const userListWithoutSelf = userList.filter((user) => user !== username);

    const chatDto = {
      from: username,
      to:
        sendTo === 'whisper'
          ? whisperTarget === ''
            ? userListWithoutSelf[0]
            : whisperTarget
          : null,
      text: chatInput,
      type: sendTo,
    };

    socketIo.getSocket().then((socket) => {
      socket.emit('chat.out', chatDto, (res) => {
        if (!res.result) {
          console.log(res);
        }
      });
    });
    setChatInput('');
  };

  const fetchUserList = () => {
    socketIo.getSocket().then((socket) => {
      socket.emit('user.listInRoom', (res) => {
        if (res.result) {
          setUserList(res.packet);
        }
      });
    });
  };

  const handleChatRead = () => {
    console.log(chatData);
    console.log('HANDLE CHAT READ');

    let pastId = null;
    if (chatData.length) {
      pastId = chatData[0].id;
    }

    if (!pastIdArr.includes(pastId)) {
      socketIo.getSocket().then((socket) => {
        socket.emit('chat.read', pastId, (res) => {
          if (res.result) {
            console.log('reading past chat');
            console.log(pastId);
            console.log(res.packet);
            setChatData((prevChatData) => [
              ...res.packet.reverse(),
              ...prevChatData,
            ]);
          }
        });
      });

      setPastIdArr((arr) => [...arr, pastId]);
    }
  };

  useEffect(() => {
    getRoomInfo();
    refreshRoomInfo();
    fetchUserList();
    setGroupList([]);

    socketIo.getSocket().then((socket) => {
      socket.on('chat.in', (res) => {
        if (res.result) {
          setChatData((prevChatData) => [...prevChatData, res.packet]);
          console.log(res.packet);
        }
      });
    });

    socketIo.getSocket().then((socket) => {
      socket.on('user.listInRoom.refresh', (res) => {
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
  }, []);

  useEffect(() => {
    if (userUpdate) {
      getRoomInfo();
      setUserUpdate(false);
    }
  }, [userUpdate]);

  if (!roomInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.chattingTop}>
        <p className={styles.roomName}>[{roomName}]</p>
        <div className={styles.topDesc}>
          <button onClick={handleLeave} className={styles.leaveButton}>
            Leave Room
          </button>
          <button onClick={handleEditButton} className={styles.leaveButton}>
            Edit Room
          </button>
          <button onClick={handleFoldButton}>접기</button>
        </div>
      </div>

      <ScrollToBottom className={styles.chattingContainer} debug={false}>
        <Content
          handleChatRead={handleChatRead}
          chatData={chatData}
          setCurrentGroup={setCurrentGroup}
        />
      </ScrollToBottom>

      <form onSubmit={handleSendChat} className={styles.inputWrapper}>
        <select value={sendTo} onChange={setSendSelect}>
          {chatType.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {sendTo === 'whisper' && userList.length > 1 && (
          <select value={whisperTarget} onChange={onWhisperTargetSelect}>
            {userList
              .filter((user) => user !== username)
              .map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
          </select>
        )}

        <input
          type="text"
          value={chatInput}
          onChange={handleChatInputChange}
          placeholder={
            sendTo === 'whisper' && userList.length <= 1
              ? "Can't send whisper"
              : sendTo === 'group' && currentGroup === null
              ? 'Not in a group'
              : ''
          }
          disabled={
            (sendTo === 'whisper' && userList.length <= 1) ||
            (sendTo === 'group' && currentGroup === null)
          }
        />
        <button type="submit" onClick={handleSendChat}>
          Send
        </button>
      </form>

      {/* Modal */}
      <Rodal visible={showEditModal} onClose={closeEditModal}>
        <form className={styles.editRoomModal}>
          <div className={styles.row}>
            <label>Name:</label>
            <input
              type="text"
              name="roomTitle"
              value={userEditInput.roomTitle}
              onChange={handleEditInputChange}
            />
          </div>
          <div className={styles.row}>
            <label>Password:</label>
            <input
              type="password"
              name="roomPw"
              value={userEditInput.roomPw}
              onChange={handleEditInputChange}
            />
          </div>
          <div className={styles.row}>
            <label>Capacity:</label>
            <input
              type="number"
              name="roomCapacity"
              value={userEditInput.roomCapacity}
              onChange={handleEditInputChange}
            />
          </div>
          <button type="submit" onClick={handleEditSubmit}>
            Edit
          </button>
        </form>
      </Rodal>
    </div>
  );
}

export default Chatting;
