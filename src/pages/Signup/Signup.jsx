import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import axios from 'axios';
import styles from './signup.module.scss';

function Signup({ history }) {
  const [input, setInput] = useState({ id: '', password: '', nick: '' });
  const [idPass, setIdPass] = useState(false);
  const { id, password, nick } = input;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleIdCheck = () => {
    if (id === '') {
      return;
    }
    axios
      .get(`/user/idcheck/${id}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.result) {
          alert('username pass');
          setIdPass(true);
        } else {
          alert('invalid username');
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSignup = () => {
    if (!idPass) {
      alert('check your username first');
      return;
    }
    if (id === '' || password === '' || nick === '') {
      alert('missing');
      return;
    }
    axios
      .post('/user/signup', input)
      .then((res) => {
        if (res.data.result) {
          history.push('/');
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <p>Sign Up!</p>
        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder="Username"
            name="id"
            value={id}
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
        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder="Nickname"
            name="nick"
            value={nick}
            onChange={handleInputChange}
            autoComplete="off"
          />
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.check}
            onClick={handleIdCheck}
          >
            Check Username
          </button>
          <button
            type="submit"
            className={styles.signup}
            onClick={handleSignup}
          >
            Sign Up
          </button>
          <Link to="/" className={styles.signin}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Signup);
