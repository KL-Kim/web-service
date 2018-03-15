/**
 * User Actions
 */
import _ from 'lodash';

import userTypes from '../constants/user.types';
import { registerFetch, changePasswordFetch, sendEmailFetch, getUserByIdFetch, updateUserFetch } from '../api/user.service';
import { getToken, loginFetch, logoutFetch, verifyFetch } from '../api/auth.service';
import * as AlertActions from './alert.actions';
import { removeFromStorage } from '../helpers/webStorage';
import webStorageTypes from '../constants/webStorage.types.js';

/**
 *  Request login
 */
const requestLogin = () => ({
    "type": userTypes.LOGIN_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  }
);

/**
 *  Login success
 */
const loginSuccess = user => ({
  "type": userTypes.LOGIN_SUCCESS,
  "meta": {},
  "error": null,
  "payload": {
    "user": user,
  }
});

/**
 *  Login failure
 */
const loginFailure = error => ({
  "type": userTypes.LOGIN_FAILURE,
  "meta": {},
  "error": error,
  "payload": {}
});

/**
 * Login
 */
export const login = (email, password) => {
  return (dispatch, getState) => {
    if (_.isEmpty(email) || _.isEmpty(password)) {
      const error = new Error("Email or password is empty")
      dispatch(loginFailure(error));
      dispatch(AlertActions.alertFailure("Email and passwords should not be empty"));
      return Promise.reject(error);
    }

    dispatch(requestLogin());
    return loginFetch(email, password)
      .then(user => {
        dispatch(loginSuccess(user));
        dispatch(AlertActions.alertSuccess("Login successfully"));

        return ;
      }).catch(err => {
        if (err.message) {
          dispatch(AlertActions.alertFailure(err.message));
        }
        dispatch(loginFailure(err));

        return ;
      });
  };
};

/**
 *  Request register
 */
const requestRegister = () => ({
    "type": userTypes.REGISTER_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  }
);

/**
 *  Register success
 */
const registerSuccess = (user) => ({
  "type": userTypes.REGISTER_SUCCESS,
  "meta": {},
  "error": null,
  "payload": {
    "user": user
  }
});

/**
 *  Register failure
 */
const registerFailure = error => ({
  "type": userTypes.REGISTER_FAILURE,
  "meta": {},
  "error": error,
  "payload": {},
});

/**
 * Register user
 * @param {Object} user - User
 */
export const register = (user) => {
  return (dispatch, getState) => {
    if (_.isEmpty(user.email)
      || _.isEmpty(user.password)
      || _.isEmpty(user.passwordConfirmation)) {
        const error = new Error("Requests params missing");
        dispatch(AlertActions.alertFailure(error.message));
        return Promise.reject(error);
    }

    dispatch(requestRegister());
    return registerFetch(user)
      .then(res => {
        dispatch(registerSuccess(res.user));
        dispatch(AlertActions.alertSuccess("Sign up successfully"));

        return ;

      }).catch(err => {
        dispatch(registerFailure(err));
        if (err.message) {
          dispatch(AlertActions.alertFailure(err.message));
        }
        return ;
    });
  };
};

/**
 *  Request verify account
 */
const requestVerify = () => ({
    "type": userTypes.VERIFY_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  }
);

/**
 *  Verify account success
 */
const verifySuccess = user => ({
  "type": userTypes.VERIFY_SUCCESS,
  "meta": {},
  "error": null,
  "payload": {
    "user": user
  }
});

/**
 *  Verify account failure
 */
const verifyFailure = error => ({
  "type": userTypes.VERIFY_FAILURE,
  "meta": {},
  "error": error,
  "payload": {}
});

/**
 * Account Verification
 * @param {string} token - Access Token
 */
export const verifyAccount = (token) => {
  return (dispatch, getState) => {
    if (_.isEmpty(token)) {
      const err = new Error("Token missing");
      dispatch(AlertActions.alertFailure(err.message));
      return Promise.reject(err);
    }

    dispatch(requestVerify());
    return verifyFetch(token)
      .then(res => {
        return dispatch(verifySuccess(res.user))
      }).catch(err => {
        return dispatch(verifyFailure(err));
      });
  };
};

/**
 * Requset change password
 */
const requestChangePassword = () => ({
  "type": userTypes.CHANGE_PASSWORD_REQUEST,
  "meta": {},
  "error": null,
  "payload": {}
});

/**
 * Change password success
 */
const changePasswordSuccess = () => ({
  "type": userTypes.CHANGE_PASSWORD_SUCCESS,
  "meta": {},
  "error": null,
  "payload": {
    "changed": true
  }
});

/**
 * Change password failure
 */
const changePasswordFailure = (error) => ({
  "type": userTypes.CHANGE_PASSWORD_FAILURE,
  "meta": {},
  "error": error,
  "payload": {}
});

/**
 * Change password
 * @param {string} token - Access Token
 * @param {string} password - Password
 * @param {string} passwordConfirmation - Password Confirmation
 */
export const changePassword = (token, password, passwordConfirmation) => {
  return (dispatch, getState) => {
    let err;

    if (_.isEmpty(token)) {
      err = new Error("Token missing");
      dispatch(AlertActions.alertFailure(err.message));
      return Promise.reject(err);
    }

    if(_.isEmpty(password) || _.isEmpty(passwordConfirmation)) {
      err = new Error("Passwords missing");
      dispatch(AlertActions.alertFailure(err.message));
      return Promise.reject(err);
    }

    dispatch(requestChangePassword());
    return changePasswordFetch(token, password, passwordConfirmation)
      .then(res => {
        dispatch(changePasswordSuccess());
        dispatch(AlertActions.alertSuccess("Change password successfully"));
        return ;
      }).catch(err => {
        dispatch(changePasswordFailure(err));
        if (err.message) {
          dispatch(AlertActions.alertFailure(err.message));
        }
        return ;
      });
  };
};

/**
 * Send email
 * @param {String} type - email type
 * @param {String} email - user's email
 */
export const sendEmail = (type, email) => {
  return (dispatch, getState) => {
    let err;

    if (_.isEmpty(type) || _.isEmpty(email)) {
      err = new Error("Bad requset");
      dispatch(AlertActions.alertFailure(err.message));
      return Promise.reject(err);
    }

    return sendEmailFetch(type, email)
      .then(res => {
        return dispatch(AlertActions.alertSuccess("Send email successfully"));
      }).catch(err => {
        dispatch(AlertActions.alertFailure("Send email failed"));
      });
  };
};

/**
 * Requset get user by Id
 */
const requestGetUserById = () => ({
  "type": userTypes.GET_USER_BY_ID_REQUEST,
  "meta": {},
  "error": null,
  "payload": {}
});

/**
 * Get user by Id success
 */
const getUserByIdSuccess = (user) => ({
  "type": userTypes.GET_USER_BY_ID_SUCCESS,
  "meta": {},
  "error": null,
  "payload": {
    "user": user
  }
});

/**
 * Get user by Id failure
 */
const getUserByIdFailure = (error) => ({
  "type": userTypes.GET_USER_BY_ID_FAILURE,
  "meta": {},
  "error": error,
  "payload": {}
});

/**
 * Get user by Id
 * @param {string} id - User id
 */
export const getUserById = (id) => {
  return (dispatch, getState) => {
    getToken()
      .then(token => {
        dispatch(requestGetUserById());
        return getUserByIdFetch(id, token);
      })
      .then(user => {
        return dispatch(getUserByIdSuccess(user));
      }).catch(err => {
        return dispatch(getUserByIdFailure(err));
      });
  };
}

/**
 * Request log out
 */
const logoutRequest = () => ({
  "type": userTypes.LOGOUT_REQUEST,
  "meta": {},
  "error": null,
  "payload": {},
});

/**
 * Log out success
 */
const logoutSuccess = () => ({
  "type": userTypes.LOGOUT_SUCCESS,
  "meta": {},
  "error": null,
  "payload": {},
});

/**
 * Log out failure
 */
const logoutFailure = (error) => ({
  "type": userTypes.LOGOUT_FAILURE,
  "meta": {},
  "error": error,
  "payload": {},
});

/**
 * Log out
 */
export const logout = () => {
  return (dispatch, getState) => {
    dispatch(logoutRequest);
    removeFromStorage(webStorageTypes.WEB_STORAGE_TOKEN_KEY);
    removeFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);

    return logoutFetch().then(json => {
      dispatch(logoutSuccess());
      dispatch(AlertActions.alertSuccess("Log out successfully"));
    }).catch(err => {
      dispatch(logoutFailure(err));
      if (err.message) {
        dispatch(AlertActions.alertFailure(err.message));
      }
    });
  };
};

/**
 * Update user profile request
 */
const updateUserProfileRequest  = () => ({
  "type": userTypes.UPDATE_USER_PROFILE_REQUEST,
  "meta": {},
  "error": null,
  "payload": {},
});

/**
 * Update user profile success
 */
const updateUserProfileSuccess  = (user) => ({
  "type": userTypes.UPDATE_USER_PROFILE_SUCCESS,
  "meta": {},
  "error": null,
  "payload": {
    "user": user
  },
});

/**
 * Update user profile success
 */
const updateUserProfileFailure  = (error) => ({
  "type": userTypes.UPDATE_USER_PROFILE_FAILURE,
  "meta": {},
  "error": error,
  "payload": {},
});

/**
 * Update user's profile
 */
export const updateUserProfile = (id, data) => {
  return (dispatch, getState) => {
    if (_.isEmpty(id) || _.isEmpty(data)) {
      const error = new Error("Bad Request");
      return Promise.reject(error);
    }

    const user = getState().userReducer.user;
    let modified = false;

    _.map(data, (value, name) => {
      if (value !== user[name]) {
        modified = true;
      }
    });

    if (!modified) {
      return dispatch(AlertActions.alertSuccess("Nothing changed"));
    }

    dispatch(updateUserProfileRequest());

    return getToken().then(token => {
      let type = 'PROFILE';
      if (!_.isEmpty(data.username)) type = userTypes.UPDATE_USERNAME;

      return updateUserFetch(type, token, id, data);
    }).then(user => {
        dispatch(updateUserProfileSuccess(user));
        dispatch(AlertActions.alertSuccess("Updated successfully"));

        return ;
    }).catch(err => {
      if (err.message) {
        dispatch(AlertActions.alertFailure(err.message));
      }
      dispatch(updateUserProfileFailure(err));

      return ;
    });
  }
}
