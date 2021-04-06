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
  const [clickUserInfo, setClickUserInfo] = useState({});
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);

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

  const handleUserClick = (user) => {
    socketIo.getSocket().then((socket) => {
      socket.emit('user.info', user, (res) => {
        setClickUserInfo(res.packet);
      });
    });
    setShowUserInfoModal(true);
  };

  const closeUserInfoModal = () => {
    setShowUserInfoModal(false);
  };

  const handleJoinGroup = () => {
    socketIo.getSocket().then((socket) => {
      socket.emit('user.read', (res) => {
        if (res.packet.groupId === clickUserInfo.groupId) {
          alert('You are already in the same group');
          return;
        }
        if (res.packet.groupId) {
          alert('You are already in a group');
          return;
        }
        socketIo.getSocket().then((socket) => {
          socket.emit('user.joinGroup', clickUserInfo.groupId, (res) => {
            if (res.result) {
              alert(
                `You have joined the following group: ${clickUserInfo.groupId}`
              );
              setCurrentGroup(clickUserInfo.groupId);
            }
          });
        });
      });
    });
  };

  return (
    <Container>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <div>
            {/* 그룹에 있는 경우 */}
            {currentGroup && (
              <button onClick={leaveGroup} className={styles.newGroupButton}>
                Leave Current Group
              </button>
            )}
            {/* 그룹에 없는 경우 */}
            {!currentGroup && (
              <button
                onClick={handleCreateNewGroup}
                className={styles.newGroupButton}
              >
                New Group +
              </button>
            )}
            {/* 그룹에 있는 경우 */}
            {currentGroup && (
              <>
                <p>[Joined Group]</p>
                <ul className={styles.list}>
                  <li>{currentGroup}</li>
                </ul>
                <hr className={styles.lobbyHr} />
              </>
            )}
            {/* 현재 유저 */}
            <p>[Current Users]</p>
            <ul className={styles.list}>
              {userList.map((user, i) => (
                <li
                  key={`${user}-${i}`}
                  onClick={() => handleUserClick(user)}
                  value={user}
                  className={styles.singleUser}
                >
                  {user}
                </li>
              ))}
            </ul>
            {/* 그룹 정보 */}
            {groupList.length !== 0 && (
              <>
                <hr className={styles.lobbyHr} />
                <p>[Current Groups]</p>
              </>
            )}
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
              setCurrentGroup={setCurrentGroup}
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
      <Rodal visible={showUserInfoModal} onClose={closeUserInfoModal}>
        <div className={styles.userInfo}>
          <p>Name: {clickUserInfo.id}</p>
          <p>Current Group: {clickUserInfo.groupId || 'None'}</p>
        </div>
        {clickUserInfo.groupId && (
          <button onClick={handleJoinGroup}>Join same group</button>
        )}
      </Rodal>
    </Container>
  );
}

export default Lobby;
