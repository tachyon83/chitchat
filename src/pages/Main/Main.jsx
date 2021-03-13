import React, { useEffect, useState } from 'react';
import Container from '../../components/Container/Container';
import getSocket from '../../utils/util';
import { useRecoilValue } from 'recoil';
import { UsernameState } from '../../recoil/atoms';
import { withRouter } from 'react-router';
import ChattingImage from '../../assets/room-wrap-bg.png';
import styles from './main.module.scss';

function Main() {
  const username = useRecoilValue(UsernameState);
  const [currentGroup, setCurrentGroup] = useState('');

  const fetchUserInfo = () => {
    console.log('fetch user info function');
    getSocket().then((socket) => {
      socket.emit('user.read', (res) => {
        setCurrentGroup(res.packet.groupId);
        console.log(res.packet);
      });
    });
  };

  const leaveGroup = () => {
    getSocket().then((socket) => {
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
      </div>
    </Container>
  );
}

export default withRouter(Main);
