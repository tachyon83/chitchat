import React, { useEffect, useState } from 'react';
import Container from '../../components/Container/Container';
import socketIo from '../../utils/util';
import { useRecoilValue } from 'recoil';
import { UsernameState } from '../../recoil/atoms';
import { withRouter } from 'react-router';
import ChattingImage from '../../assets/room-wrap-bg.png';
import styles from './main.module.scss';

function Main() {
  const username = useRecoilValue(UsernameState);

  return (
    <Container>
      <div className={styles.mainDiv}>
        <img src={ChattingImage} alt="chatting" className={styles.image} />
        <div className={styles.textContainer}>
          <p className={styles.text}>
            Welcome,
            <span className={styles.name}>{username}</span>!
          </p>
        </div>
      </div>
    </Container>
  );
}

export default withRouter(Main);
