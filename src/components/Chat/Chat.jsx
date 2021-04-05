import React, { useState } from 'react';
import styles from './chat.module.scss';
import { useRecoilValue } from 'recoil';
import { UsernameState } from '../../recoil/atoms';
import socketIo from '../../utils/util';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';

function Chat({ chat, setCurrentGroup }) {
  const username = useRecoilValue(UsernameState);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [userGroup, setUserGroup] = useState(null);

  const handleFromClick = () => {
    socketIo.getSocket().then((socket) => {
      socket.emit('user.info', chat.from, (res) => {
        setUserGroup(res.packet.groupId);
      });
    });
    setShowInfoModal(true);
  };

  const closeInfoModal = () => {
    setShowInfoModal(false);
  };

  const handleJoinGroup = () => {
    socketIo.getSocket().then((socket) => {
      socket.emit('user.read', (res) => {
        if (res.packet.groupId === userGroup) {
          alert('You are already in the same group');
          return;
        }
        if (res.packet.groupId) {
          alert('You are already in a group');
          return;
        }
        socketIo.getSocket().then((socket) => {
          socket.emit('user.joinGroup', userGroup, (res) => {
            if (res.result) {
              alert(`You have joined the following group: ${userGroup}`);
              setCurrentGroup(userGroup);
            }
          });
        });
      });
    });
  };

  if (chat.from === null) {
    return (
      <div className={styles.system}>
        <span>--- </span>
        <span>{chat.text}</span>
        <span> ---</span>
      </div>
    );
  }

  if (chat.from === username) {
    return (
      <div
        className={`${styles.myChat} ${
          chat.type === 'all'
            ? styles.myChatToAll
            : chat.type === 'group'
            ? styles.myChatToGroup
            : styles.myChatToWhisper
        }`}
      >
        <div className={styles.myChatFrom}>
          {username}{' '}
          {chat.type === 'group'
            ? '[Group]'
            : chat.type === 'all'
            ? ''
            : `[${chat.type}]`}
        </div>
        {chat.text}
      </div>
    );
  }

  return (
    <div
      className={`${styles.otherChat} ${
        chat.type === 'all'
          ? styles.otherChatToAll
          : chat.type === 'group'
          ? styles.otherChatToGroup
          : styles.otherChatToWhisper
      }`}
    >
      <div className={styles.otherChatFrom} onClick={handleFromClick}>
        {chat.from} {chat.type === 'group' && '[Group]'}
        {chat.type === 'whisper' && '[Whisper]'}
      </div>
      <div>{chat.text}</div>
      <Rodal visible={showInfoModal} onClose={closeInfoModal}>
        <div className={styles.userInfo}>
          <p>Name: {chat.from}</p>
          <p>Current Group: {userGroup || 'None'}</p>
        </div>
        {userGroup && (
          <button onClick={handleJoinGroup}>Join same group</button>
        )}
      </Rodal>
    </div>
  );
}

export default Chat;
