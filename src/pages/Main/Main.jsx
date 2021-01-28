import React from 'react';
import Container from '../../components/Container/Container';
import { useRecoilValue } from 'recoil';
import { UsernameState } from '../../recoil/atoms';
import { withRouter } from 'react-router';
import ChattingImage from '../../assets/room-wrap-bg.png';
import styles from './main.module.scss';

function Main() {
  const username = useRecoilValue(UsernameState);

  return (
    <Container>
      <div>
        <img src={ChattingImage} alt="chatting" className={styles.image} />
        <p className={styles.text}>
          <span className={styles.name}>{username}</span> 님<br />
          기다리고 있었어요!
        </p>
      </div>
    </Container>
  );
}

export default withRouter(Main);
