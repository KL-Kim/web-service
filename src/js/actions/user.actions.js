import userTypes from '../constants/user.types';
import { loginFetch } from '../helpers/user.service';
import * as AlertActions from './alert.actions';

/**
 *  Request login
 */
const requestLogin = (email, password) => ({
    type: userTypes.LOGIN_REQUEST,
    meta: {},
    error: null,
    payload: {
      email: email,
      password: password
    }
  }
);

/**
 *  Login success
 */
const loginSuccess = response => ({
  type: userTypes.LOGIN_SUCCESS,
  meta: {},
  error: null,
  payload: {
    user: response.user,
    token: response.token
  }
});

/**
 *  Login failure
 */
const loginFailure = error => ({
  type: userTypes.LOGIN_FAILURE,
  meta: {},
  error: true,
  payload: {
    error: error
  }
});

/**
 * Login
 */
export const login = (email, password) => {
  return (dispath, getState) => {
    dispath(requestLogin(email, password));
    return loginFetch(email, password)
      .then(res => {
        if (res.token) {
          sessionStorage.setItem('token', JSON.stringify(res.token));
        }
        dispath(loginSuccess(res));
        dispath(AlertActions.alertSuccess("Login Successfully"));

      }, error => {
        dispath(loginFailure(error));
        if (error.message) {
          dispath(AlertActions.alertFailure(error.message));
        }
      });
  }
};
