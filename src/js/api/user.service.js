import fetch from 'cross-fetch';
import config from '../config/config';
import { saveToStorage } from '../helpers/webStorage';
import userTypes from '../constants/user.types';
import webStorageTypes from '../constants/webStorage.types';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * User serivce uri
 */
const userServiceUri = {
  commonUserUrl: config.API_GATEWAY_ROOT + '/api/v1/user',
  registerUrl: config.API_GATEWAY_ROOT + '/api/v1/user/register',
  verifyAccountUrl: config.API_GATEWAY_ROOT + '/api/v1/user/verify',
  changePasswordUrl: config.API_GATEWAY_ROOT + '/api/v1/user/password',
  updateUsernameUrl: config.API_GATEWAY_ROOT + '/api/v1/user/useranme',
  updatePhoneUrl: config.API_GATEWAY_ROOT + '/api/v1/user/phone',
  uploadProfilePhotoUrl: config.API_GATEWAY_ROOT + '/api/v1/user/profilePhoto',

  // Admin related URI
  adminEditUserUrl: config.API_GATEWAY_ROOT + '/api/v1/user/admin',
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

  return fetch(userServiceUri.registerUrl, options)
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
        saveToStorage(webStorageTypes.WEB_STORAGE_TOKEN_KEY, json.token);
      }

      if (json.user) {
        saveToStorage(webStorageTypes.WEB_STORAGE_USER_KEY, json.user._id);
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

  return fetch(userServiceUri.verifyAccountUrl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(user => {
      return user;
    })
    .catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Fetch user by Id
 */
export const getUserByIdFetch = (token, id) => {
  const options = {
    "method": 'GET',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  return fetch(userServiceUri.commonUserUrl + '/' + id, options)
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
 * Request changing password
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

  return fetch(userServiceUri.changePasswordUrl, options)
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
      url = userServiceUri.updateUsernameUrl + '/' + id;
      break;

    default:
      url = userServiceUri.commonUserUrl + '/' + id;
  }

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(user => {
      return user;
    }).catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Upload user profile photo
 */
export const uploadProfilePhotoFetch = (token, id, data) => {
  const options = {
    "method": 'POST',
    "headers": {
      "Authorization": 'Bearer ' + token,
    },
    "body": data,
  };

  return fetch(userServiceUri.uploadProfilePhotoUrl + '/' + id, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(user => {
      return user;
    }).catch(err => {
      return Promise.reject(err);
    });
};

/**
 * Upddate user's phone
 */
export const updateMobilePhoneFetch = (token, id, phoneNumber, code) => {
  const options = {
    "method": 'POST',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    "body": JSON.stringify({
      "phoneNumber": phoneNumber,
      "code": code
    }),
  };

  return fetch(userServiceUri.updatePhoneUrl + '/' + id, options)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      const error = new Error(response.statusText);
      error.status = response.status;

      switch (response.status) {
        case 401:
        case 403:
          error.message = "Verification Code is not matched";
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

/**
 * Get Users List
 * @role admin
 */
export const getUsersListFetch = (token, limit, skip) => {
  const options = {
    "method": 'GET',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  let url = userServiceUri.commonUserUrl + '?';

  if (limit)
    url  = url + 'limit=' + limit;

  if (skip)
    url = url + '&skip=' + skip;

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(json => {
      return json;
    }).catch(err => {
      return Promise.reject(err);
    });
}

/**
 * Admin edit user
 * @role admin
 */
export const adminEditUserFetch = (token, id, data) => {
  const options = {
    "method": 'POST',
    "headers": {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    "body": JSON.stringify({ ...data }),
  };

  return fetch(userServiceUri.adminEditUserUrl + '/' + id, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(response => {
      return response;
    }).catch(err => {
      return Promise.reject(err);
    });
}
