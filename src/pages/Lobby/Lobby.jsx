import React, { useState, useEffect } from 'react';
import Container from '../../components/Container/Container';
import Chatting from '../../components/Chatting/Chatting';
import RoomList from '../../components/RoomList/RoomList';
import socketIo from '../../utils/util';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import styles from './lobby.module.scss';

function Lobby() {
  const [roomId, setRoomId] = useState(null);
  const [roomFoldId, setRoomFoldId] = useState(null);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [userList, setUserList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [currentGroup, setCurrentGroup] = useState('');

  const fetchUserInfo = () => {
    socketIo.getSocket().then((socket) => {
      socket.emit('user.read', (res) => {
        setCurrentGroup(res.packet.groupId);
      });
    });
  };

  const leaveGroup = () => {
    socketIo.getSocket().then((socket) => {
      socket.emit('user.disjoinGroup', (res) => {
        if (res.result) {
          setCurrentGroup('');
        } else {
          alert('Failed to leave group');
        }
      });
    });
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleCreateNewGroup = () => {
    if (currentGroup) {
      alert('You are already in a group');
      return;
    } else {
      setShowNewGroupModal(true);
    }
  };

  const handleAddNewGroup = (e) => {
    e.preventDefault();
    if (!newGroupName) {
      alert('Fill in the blank');
      return;
    }

    socketIo.getSocket().then((socket) => {
      socket.emit('user.createGroup', newGroupName, (res) => {
        if (res.result) {
          closeNewGroupModal();
          setCurrentGroup(newGroupName);
        } else {
          alert('Unable to create a group with the following group name.');
          setNewGroupName('');
        }
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

  const filterUserList = userList.filter(
    (item, index) => userList.indexOf(item) === index
  );

  return (
    <Container>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <div>
            {currentGroup && (
              <button onClick={leaveGroup} className={styles.newGroupButton}>
                Leave Current Group
              </button>
            )}
            {!currentGroup && (
              <button
                onClick={handleCreateNewGroup}
                className={styles.newGroupButton}
              >
                New Group +
              </button>
            )}
            {currentGroup && (
              <>
                <p>[Current Group]</p>
                <ul className={styles.list}>
                  <li>{currentGroup}</li>
                </ul>
                <hr className={styles.lobbyHr} />
              </>
            )}
            <p>[Current Users]</p>
            <ul className={styles.list}>
              {userList.map((user, i) => (
                <li key={`${user}-${i}`}>{user}</li>
              ))}
            </ul>
            <hr className={styles.lobbyHr} />

            <p>[Current Groups]</p>
            <ul className={styles.list}>
              {groupList.map((group, i) => (
                <li key={`${group}-${i}`}>{group}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.rightBody}>
          {roomId ? (
            <Chatting
              roomId={roomId}
              setRoomId={setRoomId}
              userList={filterUserList}
              setUserList={setUserList}
              setGroupList={setGroupList}
              setRoomFoldId={setRoomFoldId}
            />
          ) : (
            <RoomList
              setRoomId={setRoomId}
              setUserList={setUserList}
              setGroupList={setGroupList}
              roomFoldId={roomFoldId}
              setRoomFoldId={setRoomFoldId}
            />
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
