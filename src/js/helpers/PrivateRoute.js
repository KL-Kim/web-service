import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { loadFromStorage } from './webStorage';
import webStorageTypes from '../constants/webStorage.types';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const uid = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);

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
