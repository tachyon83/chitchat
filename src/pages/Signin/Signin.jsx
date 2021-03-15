import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import axios from 'axios';
import socketIo from '../../utils/util';
import styles from './signin.module.scss';

function Signin({ history }) {
  const [input, setInput] = useState({ username: '', password: '' });
  const { username, password } = input;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleSignin = (e) => {
    e.preventDefault();

    if (username === '' || password === '') {
      alert('Please fill in the blanks.');
      return;
    }
    axios
      .post('/user/signin', input, { withCredentials: true })
      .then((res) => {
        if (res.data.result) {
          socketIo.getSocket().then((socket) => {
            localStorage.setItem('username', res.data.packet);
            console.log('socket is ready');
            if (socket) {
              console.log('SIGN IN');
              console.log(socket);
              history.push('/main');
            } else {
              alert('Failed to sign in');
            }
          });
        } else {
          alert('Incorrect username or password.');
          setInput({ username: '', password: '' });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <p>Welcome!</p>
        <form onSubmit={handleSignin}>
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
        </form>
      </div>
    </div>
  );
}

export default withRouter(Signin);
