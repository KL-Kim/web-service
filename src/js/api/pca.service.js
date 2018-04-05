import Promise from 'bluebird';
import fetch from 'cross-fetch';
import _ from 'lodash';

import config from '../config/config';

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
export const getPcaFetch = (type, code) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let url = pcaSerivceUri.apiUrl;

  if (_.isEqual('city', type)) {
    url = url + '/cities/' + code;
  } else if (_.isEqual('area', type)) {
    url = url + '/areas/' + code;
  }

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        let error = new Error(response.statusText);
        error.status = response.status;

        if (response.status === 401 || response.status === 403) {
          error.message = "Permission denied";
        } else if (response.status === 404) {
          error.message = "Not found";
        } else {
          error.message = "Unknown Error";
        }

        return Promise.reject(error);
      }
    })
    .then(json => {
      return json;
    }).catch(err => {
      return Promise.reject(err);
  });
};
