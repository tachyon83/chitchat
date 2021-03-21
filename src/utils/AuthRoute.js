import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { UsernameState } from '../recoil/atoms';

function AuthRoute({ privateRoute, children, ...rest }) {
  const username = useRecoilValue(UsernameState);

  const checkAuth = () => {
    return username;
  };

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
