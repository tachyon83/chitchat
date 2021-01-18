import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import axios from 'axios';
import styles from './login.module.scss';

function Login({ history }) {
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
      .post('/user/signin', input)
      .then((res) => {
        /////////////////////////////
        /////////////////////////////
        /////////////////////////////
        console.log(res.data);
        if (res.data.result) {
          alert('true');
          history.push('/lobby');
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

export default withRouter(Login);
