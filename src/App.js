import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Lobby from './pages/Lobby/Lobby';
import Signin from './pages/Signin/Signin';
import Signup from './pages/Signup/Signup';
import Main from './pages/Main/Main';
import { RecoilRoot } from 'recoil';
import axios from 'axios';
const host = require('./host');
axios.defaults.baseURL = host.SERVER;

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Switch>
          <Route exact path="/" component={Signin} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/main" component={Main} />
          <Route exact path="/lobby" component={Lobby} />
        </Switch>
      </Router>
    </RecoilRoot>
  );
}

export default App;
