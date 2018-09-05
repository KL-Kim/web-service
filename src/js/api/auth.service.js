import fetch from 'cross-fetch';
import jwt from 'jsonwebtoken';
import isEmpty from 'lodash/isEmpty';

import config from '../config/config';
import emailTypes from '../constants/email.types';
import { loadFromStorage, saveToStorage } from '../helpers/webStorage';
import webStorageTypes from '../constants/webStorage.types';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * Auth serivce uri
 */
const authServiceUri = {
  loginUrl: config.API_GATEWAY_ROOT + '/api/v1/auth/login',
  logoutUrl: config.API_GATEWAY_ROOT + '/api/v1/auth/logout',
  getNewTokenUrl: config.API_GATEWAY_ROOT + '/api/v1/auth/token',
  sendEmailVerificationUrl: config.API_GATEWAY_ROOT + '/api/v1/auth/mail/verify',
  sendChangePasswordEmailUrl: config.API_GATEWAY_ROOT + '/api/v1/auth/mail/password',
  sendPhoneVerificationCodeUrl: config.API_GATEWAY_ROOT + '/api/v1/auth/phoneVerificationCode',
};

/**
 * Fetch new token
 */
const fetchNewToken = () => {
  const options = {
    "method": 'GET',
    "headers": {
      'Content-Type': 'application/json',
    },
    "credentials": "include",
  };

  return fetch(authServiceUri.getNewTokenUrl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(res => {
      saveToStorage(webStorageTypes.WEB_STORAGE_TOKEN_KEY, res.token);
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
    const token = loadFromStorage(webStorageTypes.WEB_STORAGE_TOKEN_KEY);
    const decoded = isEmpty(token) ? null : jwt.decode(token, {});

    if (isEmpty(decoded) || decoded.exp * 1000 < Date.now()) {
      fetchNewToken()
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
 * @param {String} email - User's email
 * @param {String} password - User's password
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

  return fetch(authServiceUri.loginUrl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        let error = new Error(response.statusText);
        error.status = response.status;

        if (response.status === 401 || response.status === 403) {
          error.message = "Error: Invalid email or password";
        } else {
          error.message = "Server Error: Unknown Server Error";
        }

        return Promise.reject(error);
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Fetch log out
 */
export const logoutFetch = () => {
  const options = {
    "method": 'GET',
    "headers": {
      "Accept": "application/json",
      'Content-Type': 'application/json',
    },
    "credentials": 'include',
  };

  return fetch(authServiceUri.logoutUrl, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    }).catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Request sending changing password email
 * @param {String} type - Email type
 * @param {String} email - User's email
 */
export const requestSendEmailFetch = (type, email) => {
  const options = {
    "method": 'GET',
    "headers": {
      'Content-Type': 'application/json',
    },
  };

  let url;

  switch (type) {
    case emailTypes.CHANGE_PASSWORD:
      url = authServiceUri.sendChangePasswordEmailUrl
      break;

    case emailTypes.ACCOUNT_VERIFICATION:
      url = authServiceUri.sendEmailVerificationUrl
      break;

    default:
      return Promise.reject(new Error("Type missing"));
  }

  return fetch(url + '/' + email, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    }).catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Request sending phone verification code
 * @param {String} phoneNumber - Phone number
 */
export const requestSendPhoneVerificationCodeFetch = (phoneNumber) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(authServiceUri.sendPhoneVerificationCodeUrl + '/' + phoneNumber, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
};
