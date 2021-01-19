import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Lobby from './pages/Lobby/Lobby';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Main from './pages/Main/Main';
import axios from 'axios';
const host = require('./host');
axios.defaults.baseURL = host.SERVER;
// axios.defaults.withCredentials = true;

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/main" component={Main} />
        <Route exact path="/lobby" component={Lobby} />
      </Switch>
    </Router>
  );
}

export default App;
