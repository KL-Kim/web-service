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
 * @param {Number} skip - Number of reviews to skip
 * @param {Number} limit - Number of reviews to limit
 * @param {Object} filter - Reviews list filter
 * @param {search} search - Search reviews
 */
export const fetchReviews = (skip, limit, filter = {}, search) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let url = reviewSerivceUri.commonUrl + '?';

  if (skip) {
    url = url + '&skip=' + skip;
  }

  if (limit) {
    url = url + '&limit=' + limit;
  }

  if (search) {
    url = url + '&search=' + search;
  }

  if (!_.isEmpty(filter)) {
    if (filter.bid) {
      url = url + '&bid=' + filter.bid;
    }

    if (filter.uid) {
      url = url + '&uid=' + filter.uid;
    }

    if (filter.orderBy) {
      url = url + '&orderBy=' + filter.orderBy;
    }
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
 * Add new review
 * @param {String} token - Verification Token
 * @param {Object} data - Review object
 */
export const addNewReviewFetch = (token, data) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  };

  return fetch(reviewSerivceUri.commonUrl, options)
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
 * Update, delete review
 * @param {String} type - UPDATE OR DELETE
 * @param {String} token - Verification token
 * @param {Object} data - Review data
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

  switch (type) {
    case "UPDATE":
      options.method = 'PUT';
      break;

    case "DELETE":
      options.method = 'DELETE';
      break;

    default:
      options.method = 'GET';
  }

  return fetch(reviewSerivceUri.commonUrl, options)
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
