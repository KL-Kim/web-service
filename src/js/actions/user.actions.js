/**
 * User Actions
 */
import _ from 'lodash';

import * as AlertActions from './alert.actions';
import userTypes from '../constants/user.types';
import webStorageTypes from '../constants/webStorage.types.js';
import { registerFetch,
  verifyFetch,
  changePasswordFetch,
  getUserByIdFetch,
  updateUserFetch,
  uploadProfilePhotoFetch,
  updateMobilePhoneFetch, } from '../api/user.service';
import { getToken, loginFetch, logoutFetch } from '../api/auth.service';
import { removeFromStorage } from '../helpers/webStorage';

/**
 * Login
 * @param {string} email
 * @param {string} password
 */
export const login = (email, password) => {
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

  return (dispatch, getState) => {
    if (_.isEmpty(email) || _.isEmpty(password)) {
      const error = new Error("Email or password is empty")
      dispatch(loginFailure(error));
      dispatch(AlertActions.alertFailure("Email and passwords should not be empty"));
      return Promise.reject(error);
    }

    dispatch(AlertActions.alertClear());
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
 * Register user
 * @param {Object} user - User
 * @property {string} email - User's email
 * @property {string} password - User's passwords
 * @property {string} passwordConfirmation - Password Confirmation
 */
export const register = (user) => {
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

  return (dispatch, getState) => {
    if (_.isEmpty(user.email)
      || _.isEmpty(user.password)
      || _.isEmpty(user.passwordConfirmation)) {
        const error = new Error("Requests params missing");
        dispatch(AlertActions.alertFailure(error.message));
        return Promise.reject(error);
    }

    dispatch(AlertActions.alertClear());
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
 * Account Verification
 * @param {string} token - Access Token
 */
export const verifyAccount = (token) => {
  /**
   *  Request verify account
   */
  const requestVerify = () => ({
    "type": userTypes.VERIFY_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

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

  return (dispatch, getState) => {
    if (_.isEmpty(token)) {
      const err = new Error("Token missing");
      dispatch(AlertActions.alertFailure(err.message));
      return Promise.reject(err);
    }

    dispatch(requestVerify());
    return verifyFetch(token)
      .then(user => {
        return dispatch(verifySuccess(user))
      }).catch(err => {
        return dispatch(verifyFailure(err));
      });
  };
};

/**
 * Change password
 * @param {string} token - Access Token
 * @param {string} password - Password
 * @param {string} passwordConfirmation - Password Confirmation
 */
export const changePassword = (token, password, passwordConfirmation) => {
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
    "payload": {}
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
        dispatch(AlertActions.alertSuccess("Your password has been changed successfully"));

        return ;
      }).catch(err => {
        dispatch(changePasswordFailure(err));
        dispatch(AlertActions.alertFailure("Permission denied"));

        return ;
      });
  };
};

/**
 * Get user by Id
 * @param {string} id - User id
 */
export const getUserById = (id) => {
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

  return (dispatch, getState) => {
    getToken()
      .then(token => {
        dispatch(requestGetUserById());
        return getUserByIdFetch(token, id);
      })
      .then(user => {
        return dispatch(getUserByIdSuccess(user));
      }).catch(err => {
        return dispatch(getUserByIdFailure(err));
      });
  };
}

/**
 * Log out
 */
export const logout = () => {
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

  return (dispatch, getState) => {
    dispatch(logoutRequest);
    removeFromStorage(webStorageTypes.WEB_STORAGE_TOKEN_KEY);
    removeFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);

    return logoutFetch().then(json => {
      dispatch(logoutSuccess());
      dispatch(AlertActions.alertSuccess("Log out successfully"));

      return ;
    }).catch(err => {
      dispatch(logoutFailure(err));
      if (err.message) {
        dispatch(AlertActions.alertFailure(err.message));
      }

      return ;
    });
  };
};

/**
 * Update user's profile
 * @param {string} id - Users' id
 * @param {object} data - User's profile object
 */
export const updateUserProfile = (id, data) => {
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

    return getToken()
      .then(token => {
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

/**
 * Upload user's profile photo
 * @param {string} id - Users' id
 * @param {FormData} formData - Users' profile photo image
 */
export const uploadProfilePhoto = (id, formData) => {
  const uploadProfilePhotoRequset = () => ({
    "type": userTypes.UPLOAD_PROFILE_PHOTO_REQUEST,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const uploadProfilePhotoSuccess = (user) => ({
    "type": userTypes.UPLOAD_PROFILE_PHOTO_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    },
  });

  const uploadProfilePhotoFailure = (error) => ({
    "type": userTypes.UPLOAD_PROFILE_PHOTO_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id)) {
      const error = new Error("Bad Request");
      return Promise.reject(error);
    }

    dispatch(uploadProfilePhotoRequset());

    return getToken()
      .then(token => {
        return uploadProfilePhotoFetch(token, id, formData);
      }).then(user => {
        dispatch(uploadProfilePhotoSuccess(user));
        dispatch(AlertActions.alertSuccess("Updated successfully"));

        return ;
      }).catch(err => {
        dispatch(uploadProfilePhotoFailure(err));
        if (err.message) {
          dispatch(AlertActions.alertFailure(err.message));
        }

        return ;
      });
  };
};

/**
 * Update users' mobile phone
 * @param {string} id - Users' id
 * @param {string} phoneNumber - Mobile phone phoneNumber
 * @param {string} code - Verification Code
 */
export const updateMobilePhone = (id, phoneNumber, code) => {
  const updateMobilePhoneRequset = () => ({
    "type": userTypes.UPDATE_MOBILE_PHONE_REQUEST,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const updateMobilePhoneSuccess = (user) => ({
    "type": userTypes.UPDATE_MOBILE_PHONE_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    },
  });

  const updateMobilePhoneFailure = (error) => ({
    "type": userTypes.UPDATE_MOBILE_PHONE_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id) || _.isEmpty(phoneNumber) || _.isEmpty(code)) {
      const error = new Error("Bad Request");
      return Promise.reject(error);
    }

    dispatch(updateMobilePhoneRequset());
    return getToken()
      .then(token => {
        return updateMobilePhoneFetch(token, id, phoneNumber, code);
      }).then(user => {
        dispatch(updateMobilePhoneSuccess(user));
        dispatch(AlertActions.alertSuccess("Updated successfully"));

        return true;
      }).catch(err => {
        dispatch(updateMobilePhoneFailure(err));
        if (err.message) {
          dispatch(AlertActions.alertFailure(err.message));
        }

        return false;
      });
  };


}
