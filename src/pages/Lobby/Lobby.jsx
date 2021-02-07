import React, { useState } from 'react';
import Container from '../../components/Container/Container';
import Chatting from '../../components/Chatting/Chatting';
import RoomList from '../../components/RoomList/RoomList';
import styles from './lobby.module.scss';

function Lobby() {
  const [roomId, setRoomId] = useState(null);

  return (
    <Container>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <div>sidebar</div>
        </div>
        <div className={styles.rightBody}>
          {roomId ? (
            <Chatting roomId={roomId} setRoomId={setRoomId}></Chatting>
          ) : (
            <RoomList setRoomId={setRoomId}></RoomList>
          )}
        </div>
      </div>
    </Container>
  );
}

export default Lobby;
