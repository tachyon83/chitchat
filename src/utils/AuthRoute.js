import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function AuthRoute({ privateRoute, children, ...rest }) {
  const username = localStorage.getItem('username');

  const checkAuth = () => {
    console.log(username);
    return username;
  };

  console.log('auth route');

  if (privateRoute) {
    return (
      <Route
        {...rest}
        render={() => {
          return checkAuth() ? children : <Redirect to={{ pathname: '/' }} />;
        }}
      />
    );
  } else {
    return (
      <Route
        {...rest}
        render={() => {
          return checkAuth() ? (
            <Redirect to={{ pathname: '/main' }} />
          ) : (
            children
          );
        }}
      />
    );
  }
}

export default AuthRoute;
