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
        return Promise.reject(response.statusText);
      } else {
        return response.json();
      }
    })
    .then(user => {
      if (user && user.token) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return user;
    })
    .catch(err => {
      return Promise.reject(err);
    });
}
