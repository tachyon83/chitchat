import React, { useState } from 'react';
import Container from '../../components/Container/Container';
import Chatting from '../../components/Chatting/Chatting';
import RoomList from '../../components/RoomList/RoomList';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import styles from './lobby.module.scss';

function Lobby() {
  const [roomId, setRoomId] = useState(null);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    // 새로운 그룹 정보
  });

  const handleCreateNewGroup = () => {
    setShowNewGroupModal(true);
  };

  const handleAddNewGroup = (e) => {
    e.preventDefault();
    // Handle Add New Room
    // user.createGroup 사용하기
  };

  const closeNewGroupModal = () => {
    setShowNewGroupModal(false);
  };

  return (
    <Container>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <div>
            <button onClick={handleCreateNewGroup}>New Group +</button>
          </div>
        </div>
        <div className={styles.rightBody}>
          {roomId ? (
            <Chatting roomId={roomId} setRoomId={setRoomId}></Chatting>
          ) : (
            <RoomList setRoomId={setRoomId}></RoomList>
          )}
        </div>
      </div>
      <Rodal visible={showNewGroupModal} onClose={closeNewGroupModal}>
        <form onSubmit={handleAddNewGroup}>form</form>
      </Rodal>
    </Container>
  );
}

export default Lobby;
