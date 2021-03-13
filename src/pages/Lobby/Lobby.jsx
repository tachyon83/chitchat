import React, { useState, useEffect } from 'react';
import Container from '../../components/Container/Container';
import Chatting from '../../components/Chatting/Chatting';
import RoomList from '../../components/RoomList/RoomList';
import getSocket from '../../utils/util';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import styles from './lobby.module.scss';

function Lobby() {
  const [roomId, setRoomId] = useState(null);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateNewGroup = () => {
    setShowNewGroupModal(true);
  };

  const handleAddNewGroup = (e) => {
    e.preventDefault();
    if (!newGroupName) {
      alert('Fill in the blank');
      return;
    }

    getSocket().then((socket) => {
      socket.emit('user.read', (res) => {
        if (res.packet.groupId) {
          alert('You are already in a group');
          return;
        }
      });
    });

    getSocket().then((socket) => {
      socket.emit('user.createGroup', newGroupName, (res) => {
        if (res.result) {
          closeNewGroupModal();
        } else {
          alert('Unable to create a group with the following group name.');
          setNewGroupName('');
        }
      });
    });
  };

  const fetchUserList = () => {
    console.log('fetching user list');
    getSocket().then((socket) => {
      socket.emit('user.list', (res) => {
        console.log(res);
      });
    });
  };

  const handleNewGroupInputChange = (e) => {
    setNewGroupName(e.target.value);
  };

  const closeNewGroupModal = () => {
    setShowNewGroupModal(false);
    setNewGroupName('');
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <Container>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <div>
            <button
              onClick={handleCreateNewGroup}
              className={styles.newGroupButton}
            >
              New Group +
            </button>
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
        <form onSubmit={handleAddNewGroup} className={styles.newGroupModalForm}>
          <div className={styles.row}>
            <label>Name:</label>
            <input
              type="text"
              value={newGroupName}
              onChange={handleNewGroupInputChange}
              placeholder={'Enter group name'}
            />
          </div>
          <button type="submit">Add New Group</button>
        </form>
      </Rodal>
    </Container>
  );
}

export default Lobby;
