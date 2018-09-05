import Promise from 'bluebird';
import fetch from 'cross-fetch';

import config from '../config/config';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * Pca serivce uri
 */
const pcaSerivceUri = {
  apiUrl: config.API_GATEWAY_ROOT + '/api/v1/pca',
};

/**
 * Get cities
 * @param {String} type - Province, City, Areas
 * @param {Number} code - Province code
 */
export const fetchPCA = (type, code) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let url;

  switch (type) {
    case 'province':
      url = pcaSerivceUri.apiUrl + '/provinces';
      break;

    case 'city':
      url = pcaSerivceUri.apiUrl + '/cities/' + code;
      break;

    case 'area':
      url = pcaSerivceUri.apiUrl + '/areas/' + code;
      break;
  
    default:
      return Promise.reject(new Error("Type is missing"));
  }

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
};
