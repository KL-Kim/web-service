import Promise from 'bluebird';
import fetch from 'cross-fetch';
import _ from 'lodash';

import config from '../config/config';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * Business serivce uri
 */
const businessSerivceUri = {
  buinessUrl: config.API_GATEWAY_ROOT + '/api/v1/business',
  getSingleBusinessUrl: config.API_GATEWAY_ROOT + '/api/v1/business/single/',
  categoryUrl: config.API_GATEWAY_ROOT + '/api/v1/business/category',
  tagUrl: config.API_GATEWAY_ROOT + '/api/v1/business/tag',
};

/**
 * Fetch business list
 * @param {Number} skip - Number of business to skip
 * @param {Number} limit - Number of business to limit
 * @param {Object} filter - Business list filter
 * @param {search} search - Search business
 */
export const fetchBusinessList = (skip, limit, filter, search) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let url = businessSerivceUri.buinessUrl + '?';

  if (_.isNumber(skip)) url = url + '&skip=' + skip;
  if (_.isNumber(limit)) url = url + '&limit=' + limit;
  if (!_.isEmpty(filter)) {
    if (!!filter.state) url = url + '&state=' + filter.state;
    if (!!filter.event) url = url + '&event=1';
  }

  if (!_.isUndefined(search)) url = url+ '&search=' + search;

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(json => {
      return json;
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

/**
 * Fetch single business
 * @param {String} id - Business id
 */
export const fetchSingleBusiness = (id) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(businessSerivceUri.getSingleBusinessUrl + id, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(json => {
      return json;
    })
    .catch(err => {
      return Promise.reject(err);
    });
}

/**
 * Add, update, delete business
 * @param {String} type - Operation type
 * @param {String} token - Verification code
 * @param {Object} data - Business data
 */
export const businessOpertationFetch = (type, token, data) => {
  const options = {
    method: '',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  };

  switch (type) {
    case "ADD":
      options.method = "POST";
      break;

    case "UPDATE":
      options.method = "PUT";
      break;

    case "DELETE":
      options.method = "DELETE";
      break;

    default:
      return Promise.reject(new Error("Type is missing"));
  }

  return fetch(businessSerivceUri.buinessUrl, options)
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

/**
 * Fetch business categories or tags list
 * @param {String} type - category or tag
 * @param {String} search - Search term
 */
export const fetchCategoriesOrTags = (type, search) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let url;

  switch (type) {
    case "CATAGORY":
      url = businessSerivceUri.categoryUrl;
      break;

    case "TAG":
      url = businessSerivceUri.tagUrl;
      break;

    default:
      return Promise.reject(new Error("Type is missing"));
  }

  if (search)
    url = url + '?search=' + search;

  return fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(json => {
      return json;
    }).catch(err => {
      return Promise.reject(err);
  });
}

/**
 * Add, update, delete category operation
 * @param {String} token - Verification Token
 * @param {Object} data - Category object
 */
export const categoryOperationFetch = (type, token, data) => {
  const options = {
    method: '',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  };

  switch (type) {
    case "ADD":
      options.method = "POST";
      break;

    case "UPDATE":
      options.method = "PUT";
      break;

    case "DELETE":
      options.method = "DELETE";
      break;

    default:
      return Promise.reject(new Error("Type is missing"));
  }

  return fetch(businessSerivceUri.categoryUrl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(json => {
      return json;
    }).catch(err => {
      return Promise.reject(err);
  });

}

/**
 * Add, update, delete tag operation
 * @param {String} token - Verification Token
 * @param {Object} data - Tag object
 */
export const tagOperationFetch = (type, token, data) => {
  const options = {
    method: '',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  };

  switch (type) {
    case "ADD":
      options.method = "POST";
      break;

    case "UPDATE":
      options.method = "PUT";
      break;

    case "DELETE":
      options.method = "DELETE";
      break;

    default:
      return Promise.reject(new Error("Type is missing"));
  }

  return fetch(businessSerivceUri.tagUrl, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(responseErrorHandler(response));
      }
    })
    .then(json => {
      return json;
    }).catch(err => {
      return Promise.reject(err);
  });

}
