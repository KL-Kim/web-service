import fetch from 'cross-fetch';
import config from '../config/config';
import { saveToStorage } from '../helpers/webStorage';
import userTypes from '../constants/user.types';
import emailTypes from '../constants/email.types';

/**
 * User serivce uri
 */
const userSerivceUri = {
  registerUrl: config.API_GATEWAY_ROOT + '/user/register',
  changePasswordUrl: config.API_GATEWAY_ROOT + '/user/password',
  sendEmailVerificationUrl: config.API_GATEWAY_ROOT + '/user/mail/verify',
  sendChangePasswordEmailUrl: config.API_GATEWAY_ROOT + '/user/mail/password',
  commonUserUrl: config.API_GATEWAY_ROOT + '/user',
  updateUsernameUrl: config.API_GATEWAY_ROOT + '/user/useranme',
};

/**
 * Fetch user by Id
 */
export const getUserByIdFetch = (id, token) => {
  const options = {
    "method": 'GET',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  return fetch(userSerivceUri.commonUserUrl + '/' + id, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        let error = new Error(response.statusText);
        error.status = response.status;

        if (response.status === 400) {
          error.message = "Bad JSON formatting in the request";
        } else if (response.status === 409) {
          error.message = "The email has been used by someone else."
        } else {
          error.message = "Unknown Server Error";
        }
        return Promise.reject(error);
      }
    })
    .then(user => {
      if (user) {
        return user;
      } else {
        const err = new Error("Bad response");
        return Promise.reject(err);
      }
    }).catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Fetch registering user
 */
export const registerFetch = (user) => {
  const options = {
    "method": 'POST',
    "headers": {'Content-Type': 'application/json'},
    "credentials": 'include',
    "body": JSON.stringify({
      "email": user.email,
      "password": user.password,
      "passwordConfirmation": user.passwordConfirmation
    }),
  };

  return fetch(userSerivceUri.registerUrl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        let error = new Error(response.statusText);
        error.status = response.status;

        if (response.status === 400) {
          error.message = "Bad JSON formatting in the request";
        } else if (response.status === 409) {
          error.message = "The email has been used by someone else."
        } else {
          error.message = "Unknown Server Error";
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
        return json;
      } else {
        const err = new Error("Bad response")
        return Promise.reject(err);
      }
    }).catch(err => {
      return Promise.reject(err);
  });
};

/**
 * Fetch changing password
 */
export const changePasswordFetch = (token, password, passwordConfirmation) => {
  const options = {
    "method": 'POST',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    "body": JSON.stringify({
      "password": password,
      "passwordConfirmation": passwordConfirmation
    }),
  };

  return fetch(userSerivceUri.changePasswordUrl, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        let error = new Error(response.statusText);
        error.status = response.status;

        if (response.status === 400) {
          error.message = "Bad JSON Request";
        } else if (response.status === 401) {
          error.message = "Unauthorized";
        } else if (response.status === 403) {
          error.message = "Forbidden";
        }else {
          error.message = "Unknown Server Error";
        }
        return Promise.reject(error);
      }
    }).catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Fetch sending changing password email
 */
export const sendEmailFetch = (type, email) => {
  const options = {
    "method": 'POST',
    "headers": {
      'Content-Type': 'application/json',
    },
    "body": JSON.stringify({
      "email": email
    }),
  };

  let url;

  switch (type) {
    case emailTypes.CHANGE_PASSWORD:
      url = userSerivceUri.sendChangePasswordEmailUrl
      break;

    case emailTypes.ACCOUNT_VERIFICATION:
      url = userSerivceUri.sendEmailVerificationUrl
      break;
  }

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        let error = new Error(response.statusText);
        error.status = response.status;

        if (response.status === 400) {
          error.message = "Bad Request";
        } else {
          error.message = "Unknown Server Error";
        }
        return Promise.reject(error);
      }
    }).catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Fetch updating user profile
 */
export const updateUserFetch = (type = "PROFILE", token, id, data) => {
  const options = {
    "method": 'PUT',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    "body": JSON.stringify({...data}),
  };
  let url;
  switch (type) {
    case userTypes.UPDATE_USERNAME:
      url = userSerivceUri.updateUsernameUrl + '/' + id;
      break;

    default:
      url = userSerivceUri.commonUserUrl + '/' + id;
  }

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        let error = new Error(response.statusText);
        error.status = response.status;

        switch (response.status) {
          case 400:
            error.message = "Bad JSON Request";
            break;

          case 401:
            error.message = "Unauthorized";
            break;

          case 403:
            error.message = "Forbidden";
            break;

          case 409:
            error.message = "Already exists";
            break;

          default:
            error.message = "Unknown Server Error";
        }

        return Promise.reject(error);
      }
    })
    .then(user => {
      return user;
    }).catch(err => {
      return Promise.reject(err);
    });
};
