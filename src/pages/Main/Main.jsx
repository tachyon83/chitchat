import React, { useEffect, useState } from 'react';
import Container from '../../components/Container/Container';
import socketIo from '../../utils/util';
import { withRouter } from 'react-router';
import ChattingImage from '../../assets/room-wrap-bg.png';
import styles from './main.module.scss';

function Main() {
  const username = localStorage.getItem('username');
  const [currentGroup, setCurrentGroup] = useState('');

  const fetchUserInfo = () => {
    console.log('fetch user info function');
    socketIo.getSocket().then((socket) => {
      socket.emit('user.read', (res) => {
        console.log('USER READ');
        localStorage.setItem('username', res.packet.id);
        setCurrentGroup(res.packet.groupId);
        console.log(res.packet);
      });
    });
  };

  const leaveGroup = () => {
    socketIo.getSocket().then((socket) => {
      socket.emit('user.disjoinGroup', (res) => {
        if (res.result) {
          fetchUserInfo();
        } else {
          alert('Failed to leave group');
        }
      });
    });
  };

  useEffect(() => {
    console.log('MAIN USE EFFECT');
    fetchUserInfo();
  }, []);

  return (
    <Container>
      <div>
        <img src={ChattingImage} alt="chatting" className={styles.image} />
        <p className={styles.text}>
          Welcome,
          <span className={styles.name}>{username}</span>!
        </p>
        {currentGroup && <p>Current Group: {currentGroup}</p>}
        {currentGroup && (
          <button onClick={leaveGroup}>Leave Current Group</button>
        )}
        {!currentGroup && 'Currently not in a group'}
      </div>
    </Container>
  );
}

export default withRouter(Main);
