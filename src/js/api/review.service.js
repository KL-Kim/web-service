import Promise from 'bluebird';
import fetch from 'cross-fetch';
import _ from 'lodash';

import config from '../config/config';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * Review serivce uri
 */
const reviewSerivceUri = {
  commonUrl: config.API_GATEWAY_ROOT + '/api/v1/review',
};

/**
 * Get reviews by business id
 * @param {String} bid - business id
 */
export const fetchReviews = (type, value) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let url = reviewSerivceUri.commonUrl + '?';

  switch (type) {
    case 'bid':
      url = url + 'bid=' + value;
      break;

    case 'uid':
      url = url + 'uid=' + value;
      break;

    default:
      url = url;
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
}

/**
 * Add, update, delete review
 */
export const reviewOperationFetch = (type, token, data) => {
  const options = {
    method: '',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  };

  return fetch(reviewSerivceUri.commonUrl, options)
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .catch(err => {
      return Promise.reject(err);
    });
}
