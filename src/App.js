import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Lobby from './pages/Lobby/Lobby';
import Signin from './pages/Signin/Signin';
import Signup from './pages/Signup/Signup';
import Main from './pages/Main/Main';
import { RecoilRoot } from 'recoil';
import AuthRoute from './utils/AuthRoute';
import axios from 'axios';
const host = require('./host');
axios.defaults.baseURL = host.SERVER;

function App() {
  return (
    <RecoilRoot>
      <Router>
        <Switch>
          <Route exact path="/">
            {<Redirect to="/signin" />}
          </Route>
          <AuthRoute privateRoute={false} exact path="/signin">
            <Signin />
          </AuthRoute>
          <AuthRoute privateRoute={false} exact path="/signup">
            <Signup />
          </AuthRoute>
          <AuthRoute privateRoute={true} exact path="/main">
            <Main />
          </AuthRoute>
          <AuthRoute privateRoute={true} exact path="/lobby">
            <Lobby />
          </AuthRoute>
        </Switch>
      </Router>
    </RecoilRoot>
  );
}

export default App;
