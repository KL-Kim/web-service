import fetch from 'cross-fetch';
import config from '../constants/config';

const userSerivceUri = {
  login: config.USER_SERVICE_API_ROOT + '/auth/login',
  logout: config.USER_SERVICE_API_ROOT + '/auth/logout',
  register: config.USER_SERVICE_API_ROOT + '/user/register',
};

export const loginFetch = (email, password) => {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email, password }),
  };

  return fetch(userSerivceUri.login, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        let error = new Error(response.statusText);
        error.status = response.status;

        if (response.status === 401) {
          error.message = "Invalid email or password";
        } else {
          error.message = "Unknown Error";
        }
        return Promise.reject(error);
      }
    })
    .then(json => {
      if (json.user && json.token) {
        return json;
      } else {
        const err = new Error("Bad response")
        return Promise.reject(err);
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

export const registerFetch = (user) => {
  const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({user}),
  };

  return fetch(userSerivceUri.register, options)
   .then(response => {
     if (response.ok) {
       return response.json();
     } else {
       let error = new Error(response.statusText);
       error.status = response.status;

       if (response.status === 400) {
         error.message = "Bad JSON formatting in the request";
       } else {
         error.message = "Unknown Error";
       }
       return Promise.reject(error);
     }
   })
   .then(json => {
     if (json.user && json.token) {
       return json;
     } else {
       const err = new Error("Bad response")
       return Promise.reject(err);
     }
   }).catch(err => {
     return Promise.reject(err);
   });
}
