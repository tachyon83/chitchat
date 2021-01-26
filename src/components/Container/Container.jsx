import React from 'react';
import HomeIcon from '../../assets/menu-icon-home.png';
import ChatIcon from '../../assets/menu-icon-chat.png';
import { Link } from 'react-router-dom';
import styles from './container.module.scss';

function Container({ children }) {
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.icons}>
          <Link to="/main">
            <img src={HomeIcon} alt="Home" />
          </Link>
          <Link to="/lobby">
            <img src={ChatIcon} alt="Chat" />
          </Link>
        </div>
        <div className={styles.children}>{children}</div>
      </div>
    </div>
  );
}

export default Container;
