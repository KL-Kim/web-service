import fetch from 'cross-fetch';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import config from '../constants/config';
import { loadFromStorage, saveToStorage } from '../helpers/webStorage';

/**
 * Auth serivce uri
 */
const authSerivceUri = {
  loginUrl: config.API_GATEWAY_ROOT + '/auth/login',
  logoutUrl: config.API_GATEWAY_ROOT + '/auth/logout',
  verifyAccountUrl: config.API_GATEWAY_ROOT + '/auth/verify',
  getNewTokenUrl: config.API_GATEWAY_ROOT + '/auth/token',
};

/**
 * Fetch new token
 */
const newTokenFetch = () => {
  const options = {
    "method": 'GET',
    "headers": {
      'Content-Type': 'application/json',
    },
    "credentials": "include",
  };

  return fetch(authSerivceUri.getNewTokenUrl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        let error = new Error(response.statusText);
        error.status = response.status;

        if (response.status === 401) {
          error.message = "Permission denied";
        } else {
          error.message = "Unknown Error";
        }

        return Promise.reject(error);
      }
    })
    .then(res => {
      console.log("Get new token");
      saveToStorage(config.webStorageTokenKey, res.token);
      return res.token;
    })
    .catch(err => {
      return Promise.reject(err);
  });
};

/**
 * Get token from webStorage or server
 */
export const getToken = () => {
  return new Promise((resolve, reject) => {
    // Get token form webStorage
    const token = loadFromStorage(config.webStorageTokenKey);
    const decoded = _.isEmpty(token) ? null : jwt.decode(token, {});
    const now = _.now();

    if (_.isEmpty(decoded) || decoded.exp * 1000 < now) {
      newTokenFetch()
        .then(accessToken => {
          return resolve(accessToken);
        })
        .catch(err => {
          return reject(err);
      });
    } else {
      return resolve(token);
    }
  });
};

/**
 * Fetch login
 */
export const loginFetch = (email, password) => {
  const options = {
    "method": 'POST',
    "headers": {
      "Accept": "application/json",
      'Content-Type': 'application/json',
    },
    "credentials": 'include',
    "body": JSON.stringify({ email, password }),
  };

  return fetch(authSerivceUri.loginUrl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        let error = new Error(response.statusText);
        error.status = response.status;

        if (response.status === 401) {
          error.message = "Invalid email or password";
        } else {
          error.message = "Unknown Error";
        }
        return Promise.reject(error);
      }
    })
    .then(json => {
      if (json.token) {
        saveToStorage(config.webStorageTokenKey, json.token);
      }

      if (json.user) {
        saveToStorage(config.webStorageUserKey, json.user._id);
        return json.user;
      } else {
        const err = new Error("Bad response");
        return Promise.reject(err);
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Fetch account verify
 */
export const verifyFetch = (token) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  return fetch(authSerivceUri.verifyAccountUrl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        let error = new Error(response.statusText);
        error.status = response.status;

        if (response.status === 401) {
          error.message = "Permission denied";
        } else {
          error.message = "Unknown Error";
        }

        return Promise.reject(error);
      }
    })
    .then(json => {
      if (json.user) {
        return json;
      } else {
        const err = new Error("Bad response")
        return Promise.reject(err);
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
};
