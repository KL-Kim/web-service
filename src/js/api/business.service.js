import Promise from 'bluebird';
import fetch from 'cross-fetch';

import config from '../config/config';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * Business serivce uri
 */
const businessSerivceUri = {
  buinessUrl: config.API_GATEWAY_ROOT + '/api/v1/business',
  categoryUrl: config.API_GATEWAY_ROOT + '/api/v1/business/category',
  tagUrl: config.API_GATEWAY_ROOT + '/api/v1/business/tag',
};

/**
 * Fetch business list
 * @param {number} skip - Number of business to skip
 * @param {number} limit - Number of business to limit
 */
export const fetchBusinessList = (skip, limit) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(businessSerivceUri.buinessUrl, options)
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
 * Add business
 */
export const AddBusinessFetch = (type, token, data) => {
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
