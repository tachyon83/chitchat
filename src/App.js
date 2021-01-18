import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Lobby from './pages/Lobby/Lobby';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ChatPage from './pages/Main/ChatPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/lobby" component={Lobby} />
        <Route exact path="/chat" component={ChatPage} />
      </Switch>
    </Router>
  );
}

export default App;
