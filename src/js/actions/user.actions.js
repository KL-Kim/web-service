import _ from 'lodash';
import userTypes from '../constants/user.types';
import { loginFetch, registerFetch } from '../helpers/user.service';
import * as AlertActions from './alert.actions';

/**
 *  Request login
 */
const requestLogin = () => ({
    type: userTypes.LOGIN_REQUEST,
    meta: {},
    error: null,
    payload: {}
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
  return (dispatch, getState) => {
    if (_.isEmpty(email) || _.isEmpty(password)) {
      const err = new Error("Email or password is empty")
      dispatch(loginFailure(err));
      dispatch(AlertActions.alertFailure("Email or passwords should not be empty"));
      return Promise.reject(err);
    }

    dispatch(requestLogin());
    console.log("Fetching ");
    return loginFetch(email, password)
      .then(
        res => {
          if (res.token) {
            sessionStorage.setItem('token', JSON.stringify(res.token));
          }
          dispatch(loginSuccess(res));
          dispatch(AlertActions.alertSuccess("Login successfully"));
        },
        error => {
          dispatch(loginFailure(error));
          if (error.message) {
            dispatch(AlertActions.alertFailure(error.message));
          }
      });
  }
};

/**
 *  Request register
 */
const requestRegister = () => ({
    type: userTypes.REGISTER_REQUEST,
    meta: {},
    error: null,
    payload: {}
  }
);

/**
 *  Register success
 */
const registerSuccess = response => ({
  type: userTypes.REGISTER_SUCCESS,
  meta: {},
  error: null,
  payload: {
    user: response.user,
    token: response.token
  }
});

/**
 *  Register failure
 */
const registerFailure = error => ({
  type: userTypes.REGISTER_FAILURE,
  meta: {},
  error: true,
  payload: {
    error: error
  }
});

export const register = (user) => {
  return (dispatch, getState) => {
    if (_.isEmpty(user.email)
      || _.isEmpty(user.username)
      || _.isEmpty(user.password)
      || _.isEmpty(user.passwordConfirmation)) {
        const err = new Error("Something goes wrong");
        dispatch(AlertActions.alertFailure(err.message));
        return Promise.reject(err);
      }
    console.log(user);
    dispatch(requestRegister());
    return registerFetch(user)
      .then(res => {
        if (res.token) {
          sessionStorage.setItem('token', JSON.stringify(res.token));
        }
        dispatch(registerSuccess(res));
        dispatch(AlertActions.alertSuccess("Sign up successfully"));
      },
      error => {
        dispatch(registerFailure(error));
        if (error.message) {
          dispatch(AlertActions.alertFailure(error.message));
        }
    });
  }
}
