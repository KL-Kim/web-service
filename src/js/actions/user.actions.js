import userTypes from '../constants/user.types';
import { loginFetch } from '../helpers/user.service';

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
)

/**
 *  Login success
 */
const loginSuccess = json => ({
  type: userTypes.LOGIN_SUCCESS,
  meta: {},
  error: null,
  payload: {
    token: json.token
  }
})

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
})

/**
 * Login
 */
export const login = (email, password) => {
  return (dispath, getState) => {
    dispath(requestLogin(email, password));
    return loginFetch(email, password)
      .then(json => {
        dispath(loginSuccess(json));
      }, error => {
        dispath(loginFailure(error));
      });
  }
}
