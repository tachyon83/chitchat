import React from 'react';
import styles from './chat.module.scss';

function Chat({ chat }) {
  const username = localStorage.getItem('username');

  if (chat.from === null) {
    return (
      <div className={styles.system}>
        <span>--- </span>
        <span>{chat.text}</span>
        <span> ---</span>
      </div>
    );
  }

  if (chat.to === null) {
    if (chat.from === username) {
      return <div className={styles.myChat}>{chat.text}</div>;
    } else {
      return (
        <div className={styles.otherChat}>
          <div className={styles.otherChatFrom}>{chat.from}</div>
          <div>{chat.text}</div>
        </div>
      );
    }
  }

  console.log(chat);
  return <div>chat</div>;
}

export default Chat;
