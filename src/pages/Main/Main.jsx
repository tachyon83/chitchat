import React from 'react';
import { withRouter } from 'react-router';

function Main({ history }) {
  const changeToLobby = () => {
    console.log('pushed');
    history.push('/lobby');
  };

  return (
    <div>
      <button onClick={changeToLobby}>aaa</button>
    </div>
  );
}

export default withRouter(Main);
