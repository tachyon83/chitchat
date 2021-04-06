import React, { useEffect } from 'react';
import HomeIcon from '../../assets/menu-icon-home.png';
import ChatIcon from '../../assets/menu-icon-chat.png';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import socketIo from '../../utils/util';
import axios from 'axios';
import styles from './container.module.scss';
import { useSetRecoilState } from 'recoil';
import { UsernameState } from '../../recoil/atoms';

function Container({ children }) {
  const setUsernameState = useSetRecoilState(UsernameState);

  const handleSignout = () => {
    axios
      .get('/user/signout', { withCredentials: true })
      .then((res) => {
        if (res.data.result) {
          socketIo.removeSocket();
          setUsernameState('');
        } else {
          alert('Failed to signout');
        }
      })
      .catch((err) => console.log(err));
  };

  const handleHomeClick = () => {
    socketIo.getSocket().then((socket) => {
      socket.emit('user.read', (res) => {
        if (res.packet.pos !== 0) {
          socket.emit('room.leave', (res) => {
            if (!res.result) {
              alert('Failed to leave room');
            }
            socket.off();
          });
        }
      });
    });
  };

  return (
    <div className={styles.container}>
      <button className={styles.signout} onClick={handleSignout}>
        Sign Out
      </button>
      <div className={styles.body}>
        <div className={styles.iconContainer}>
          <div className={styles.icons}>
            <Link to="/main">
              <img src={HomeIcon} alt="Home" onClick={handleHomeClick} />
            </Link>
            <Link to="/lobby">
              <img src={ChatIcon} alt="Chat" />
            </Link>
          </div>
        </div>
        <div className={styles.children}>{children}</div>
      </div>
    </div>
  );
}

export default withRouter(Container);
