import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import axios from 'axios';
import getSocket from '../../utils/util';
import { useRecoilState } from 'recoil';
import { UsernameState } from '../../recoil/atoms';
import styles from './signin.module.scss';

function Signin({ history }) {
  const [usernameState, setUsernameState] = useRecoilState(UsernameState);
  const [input, setInput] = useState({ username: '', password: '' });
  const { username, password } = input;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleSignin = () => {
    if (username === '' || password === '') {
      return;
    }
    axios
      .post('/user/signin', input, { withCredentials: true })
      .then(async (res) => {
        if (res.data.result) {
          setUsernameState(res.data.packet);
          await getSocket();
          history.push('/main');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <p>Welcome!</p>
        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={handleInputChange}
            autoComplete="off"
          />
        </div>
        <div className={styles.inputBox}>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={styles.signin}
            onClick={handleSignin}
          >
            Sign In
          </button>
          <Link to="/signup" className={styles.signup}>
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Signin);
