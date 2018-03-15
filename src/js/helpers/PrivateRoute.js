import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { loadFromStorage } from './webStorage';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const uid = loadFromStorage('uid');

  return (<Route
    {...rest}
    render={props =>
      uid ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location }
          }}
        />
      )
    }
  />);
};

export default PrivateRoute;
