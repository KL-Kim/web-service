import fetch from 'cross-fetch';
import config from '../constants/config';

export const userSerivceUri = {
  login: config.API_ROOT + '/auth/login',
  logout: config.API_ROOT + '/auth/logout',
};

export const loginFetch = (email, password) => {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password })
  };

  return fetch(userSerivceUri.login, options)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(response);
      } else {
        return response.json();
      }
    })
    .then(json => {
      if (json.user && json.token) {
        return json;
      } else {
        return Promise.reject("Bad response");
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
}
