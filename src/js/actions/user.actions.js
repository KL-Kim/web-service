/**
 * User Actions
 */
import isEmpty from 'lodash/isEmpty';

import * as AlertActions from './alert.actions';
import * as NotificationActions from './notification.actions';
import userTypes from 'js/constants/user.types';
import webStorageTypes from 'js/constants/webStorage.types.js';
import { saveToStorage, loadFromStorage, removeFromStorage } from 'js/helpers/webStorage';

// API Methods
import {
  getUsernameFetch,
  registerFetch,
  verifyFetch,
  changePasswordFetch,
  getUserByIdFetch,
  updateUserFetch,
  uploadProfilePhotoFetch,
  updateMobilePhoneFetch,
  faverOperationFetch,
} from 'js/api/user.service';
import { getToken, loginFetch, logoutFetch } from 'js/api/auth.service';

/**
 * Login
 * @param {String} email - User's email
 * @param {String} password - User's password
 */
export const login = (email, password) => {
  const _requestLogin = () => ({
      "type": userTypes.LOGIN_REQUEST,
      "meta": {},
      "error": null,
      "payload": {}
    }
  );

  const _loginSuccess = user => ({
    "type": userTypes.LOGIN_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user,
    }
  });

  const _loginFailure = error => ({
    "type": userTypes.LOGIN_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (isEmpty(email) || isEmpty(password)) {
      dispatch(AlertActions.alertFailure("Email and passwords should not be empty"));

      return ;
    }

    dispatch(AlertActions.alertClear());
    dispatch(_requestLogin());
    return loginFetch(email, password)
      .then(response => {

        // Cache to webStorage
        saveToStorage(webStorageTypes.WEB_STORAGE_TOKEN_KEY, response.token);
        saveToStorage(webStorageTypes.WEB_STORAGE_USER_KEY, response.user._id);
        saveToStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR, response.user.favors);
        saveToStorage(webStorageTypes.WEB_STORAGE_LOGIN_FAILED, 0);

        dispatch(_loginSuccess(response.user));
        dispatch(AlertActions.alertSuccess("Welcome back!"));

        return response;
      })
      .catch(err => {
        // Save login failed times
        const loginFailedCount = loadFromStorage(webStorageTypes.WEB_STORAGE_LOGIN_FAILED);
        saveToStorage(webStorageTypes.WEB_STORAGE_LOGIN_FAILED, loginFailedCount + 1);

        removeFromStorage(webStorageTypes.WEB_STORAGE_TOKEN_KEY);
        removeFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);
        removeFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR);

        dispatch(_loginFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
};

/**
 * Log out
 */
export const logout = () => {
  const _logoutRequest = () => ({
    "type": userTypes.LOGOUT_REQUEST,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _logoutSuccess = () => ({
    "type": userTypes.LOGOUT_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _logoutFailure = (error) => ({
    "type": userTypes.LOGOUT_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    dispatch(_logoutRequest);
    removeFromStorage(webStorageTypes.WEB_STORAGE_TOKEN_KEY);
    removeFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);
    removeFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR);

    return logoutFetch()
      .then(response => {
        dispatch(_logoutSuccess());
        dispatch(AlertActions.alertSuccess("Goodbye!"));

        return response;
      }).catch(err => {
        dispatch(_logoutFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
};

/**
 * Register user
 * @param {Object} user - User
 * @property {String} user.email - User's email
 * @property {String} user.password - User's passwords
 * @property {String} user.passwordConfirmation - Password Confirmation
 */
export const register = (user) => {
  const _requestRegister = () => ({
      "type": userTypes.REGISTER_REQUEST,
      "meta": {},
      "error": null,
      "payload": {}
    }
  );

  const _registerSuccess = (user) => ({
    "type": userTypes.REGISTER_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    }
  });

  const _registerFailure = error => ({
    "type": userTypes.REGISTER_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    if (isEmpty(user.email)
      || isEmpty(user.password)
      || isEmpty(user.passwordConfirmation)) {
        const error = new Error("Requests params missing");
        dispatch(AlertActions.alertFailure(error.message));
        return Promise.reject(error);
    }

    dispatch(_requestRegister());

    return registerFetch(user)
      .then(response => {
        saveToStorage(webStorageTypes.WEB_STORAGE_TOKEN_KEY, response.token);
        saveToStorage(webStorageTypes.WEB_STORAGE_USER_KEY, response.user._id);
        saveToStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR, response.user.favors);

        dispatch(_registerSuccess(response.user));
        dispatch(AlertActions.alertSuccess("Sign up successfully"));

        return response;

      }).catch(err => {
        dispatch(_registerFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
    });
  };
};

/**
 * Account Verification
 * @param {String} token - Access Token
 */
export const verifyAccount = (token) => {
  const _requestVerify = () => ({
    "type": userTypes.VERIFY_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _verifySuccess = user => ({
    "type": userTypes.VERIFY_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    }
  });

  const _verifyFailure = error => ({
    "type": userTypes.VERIFY_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (isEmpty(token)) {
      const err = new Error("Token missing");
      dispatch(AlertActions.alertFailure(err.message));
      return Promise.reject(err);
    }

    dispatch(_requestVerify());
    return verifyFetch(token)
      .then(user => {
        dispatch(_verifySuccess(user));

        return user;
      }).catch(err => {
        dispatch(_verifyFailure(err));

        return ;
      });
  };
};

/**
 * Change password
 * @param {String} token - Access Token
 * @param {String} password - Password
 * @param {String} passwordConfirmation - Password Confirmation
 */
export const changePassword = (token, password, passwordConfirmation) => {
  const _requestChangePassword = () => ({
    "type": userTypes.CHANGE_PASSWORD_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _changePasswordSuccess = () => ({
    "type": userTypes.CHANGE_PASSWORD_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _changePasswordFailure = (error) => ({
    "type": userTypes.CHANGE_PASSWORD_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (isEmpty(token)) {
      dispatch(AlertActions.alertFailure("Token missing"));
      return ;
    }

    if(isEmpty(password) || isEmpty(passwordConfirmation)) {
      dispatch(AlertActions.alertFailure("Passwords missing"));
      return ;
    }

    dispatch(_requestChangePassword());
    return changePasswordFetch(token, password, passwordConfirmation)
      .then(res => {
        dispatch(_changePasswordSuccess());
        dispatch(AlertActions.alertSuccess("Reseted password!"));

        return "Reseted password!";
      }).catch(err => {
        dispatch(_changePasswordFailure(err));
        dispatch(AlertActions.alertFailure("Reset password failed"));

        return "Reset password failed!";
      });
  };
};

/**
 * Get user own dasta
 * @param {String} id - User's id
 */
export const getMyself = (id) => {
  const _getMeRequest = () => ({
    "type": userTypes.GET_MYSELF_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getMeSuccess = (user) => ({
    "type": userTypes.GET_MYSELF_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    }
  });

  const _getMeFailure = (error) => ({
    "type": userTypes.GET_MYSELF_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    getToken()
      .then(token => {
        dispatch(_getMeRequest());
        return getUserByIdFetch(token, id);
      })
      .then(user => {
        dispatch(_getMeSuccess(user));
        dispatch(NotificationActions.getUnreadCount(user._id));

        return user;
      }).catch(err => {
        dispatch(_getMeFailure(err));

        removeFromStorage(webStorageTypes.WEB_STORAGE_TOKEN_KEY);
        removeFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);
        removeFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR);

        return ;
      });
  };
}

/**
 * Get user by username
 * @param {String} username - User's username
 */
export const getUserByUsername = (username) => {
  const _getUserByUsernameRequest  = () => ({
    "type": userTypes.GET_USER_BY_USERNAME_REQUEST,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _getUserByUsernameSuccess  = () => ({
    "type": userTypes.GET_USER_BY_USERNAME_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _getUserByUsernameFailure  = (error) => ({
    "type": userTypes.GET_USER_BY_USERNAME_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    if (isEmpty(username)) {
      dispatch(AlertActions.alertFailure("Bad Request"));

      return null;
    }

    dispatch(_getUserByUsernameRequest());
    
    return getUsernameFetch(username)
      .then(response => {
        dispatch(_getUserByUsernameSuccess());

        return response;
      })
      .catch(err => {
        dispatch(AlertActions.alertFailure(err.message));
        dispatch(_getUserByUsernameFailure(err));

        return null;
      });
  }
}


/**
 * Update user's profile
 * @param {String} id - Users' id
 * @param {Object} data - User's profile Object
 */
export const updateUserProfile = (id, data) => {
  const _updateUserProfileRequest  = () => ({
    "type": userTypes.UPDATE_USER_PROFILE_REQUEST,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _updateUserProfileSuccess  = (user) => ({
    "type": userTypes.UPDATE_USER_PROFILE_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    },
  });

  const _updateUserProfileFailure  = (error) => ({
    "type": userTypes.UPDATE_USER_PROFILE_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    if (isEmpty(id) || isEmpty(data)) {
      dispatch(AlertActions.alertFailure("Bad Request"));
      return null;
    }

    dispatch(_updateUserProfileRequest());

    return getToken()
      .then(token => {
        let type = 'PROFILE';
        if (!isEmpty(data.username)) type = userTypes.UPDATE_USERNAME;

        return updateUserFetch(type, token, id, data);
      }).then(user => {
          dispatch(_updateUserProfileSuccess(user));
          dispatch(AlertActions.alertSuccess("Updated successfully"));

          return user;
      })
      .catch(err => {
        dispatch(AlertActions.alertFailure(err.message));
        dispatch(_updateUserProfileFailure(err));

        return ;
      });
  }
}

/**
 * Upload user's profile photo
 * @param {String} id - Users' id
 * @param {FormData} formData - Users' profile photo image
 */
export const uploadProfilePhoto = (id, formData) => {
  const _uploadProfilePhotoRequset = () => ({
    "type": userTypes.UPLOAD_PROFILE_PHOTO_REQUEST,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _uploadProfilePhotoSuccess = (user) => ({
    "type": userTypes.UPLOAD_PROFILE_PHOTO_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    },
  });

  const _uploadProfilePhotoFailure = (error) => ({
    "type": userTypes.UPLOAD_PROFILE_PHOTO_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    if (isEmpty(id)) {
      const error = new Error("Bad Request");
      return Promise.reject(error);
    }

    dispatch(_uploadProfilePhotoRequset());

    return getToken()
      .then(token => {
        return uploadProfilePhotoFetch(token, id, formData);
      })
      .then(user => {
        dispatch(_uploadProfilePhotoSuccess(user));
        dispatch(AlertActions.alertSuccess("Updated successfully"));

        return user;
      }).catch(err => {
        dispatch(_uploadProfilePhotoFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
};

/**
 * Update users' mobile phone
 * @param {String} id - Users' id
 * @param {String} phoneNumber - Mobile phone phoneNumber
 * @param {Number} code - Verification Code
 */
export const updateMobilePhone = (id, phoneNumber, code) => {
  const _updateMobilePhoneRequset = () => ({
    "type": userTypes.UPDATE_MOBILE_PHONE_REQUEST,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _updateMobilePhoneSuccess = (user) => ({
    "type": userTypes.UPDATE_MOBILE_PHONE_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    },
  });

  const _updateMobilePhoneFailure = (error) => ({
    "type": userTypes.UPDATE_MOBILE_PHONE_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    if (isEmpty(id) || isEmpty(phoneNumber) || isEmpty(code)) {
      const error = new Error("Bad Request");
      return Promise.reject(error);
    }

    dispatch(_updateMobilePhoneRequset());
    return getToken()
      .then(token => {
        return updateMobilePhoneFetch(token, id, phoneNumber, code);
      }).then(user => {
        dispatch(_updateMobilePhoneSuccess(user));
        dispatch(AlertActions.alertSuccess("Updated successfully"));

        return user;
      }).catch(err => {
        dispatch(_updateMobilePhoneFailure(err));
        dispatch(AlertActions.alertFailure(err.message));


        return ;
      });
  };
}

/**
  * Add or delete user's favorite business
  * @param {String} id - User's id
  * @param {String} bid - Business id
 */
export const favorOperation = (id, bid) => {
  const _favorOperationRequest  = () => ({
    "type": userTypes.FAVOR_OPERATION_REQUEST,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _favorOperationSuccess  = (user) => ({
    "type": userTypes.FAVOR_OPERATION_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "user": user
    },
  });

  const _favorOperationFailure  = (error) => ({
    "type": userTypes.FAVOR_OPERATION_FAILURE,
    "meta": {},
    "error": error,
    "payload": {},
  });

  return (dispatch, getState) => {
    if (isEmpty(id) || isEmpty(bid)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_favorOperationRequest());

    return getToken()
      .then(token => {
        return faverOperationFetch(token, id, bid);
      })
      .then(response => {
        saveToStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR, response.favors);
        dispatch(_favorOperationSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(_favorOperationFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return;
      });
  }
}
