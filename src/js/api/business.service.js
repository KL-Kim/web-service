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
  getBusinessListByCategory: config.API_GATEWAY_ROOT + '/api/v1/business/category/',
  getSingleBusinessUrl: config.API_GATEWAY_ROOT + '/api/v1/business/single/',
  categoryUrl: config.API_GATEWAY_ROOT + '/api/v1/category',
  tagUrl: config.API_GATEWAY_ROOT + '/api/v1/tag',
  businessImagesUrl: config.API_GATEWAY_ROOT + '/api/v1/business/images',

};

/**
 * Fetch business list
 * @param {Number} skip - Number of business to skip
 * @param {Number} limit - Number of business to limit
 * @param {Object} filter - Business list filter
 * @param {search} search - Search business
 */
export const fetchBusinessList = (token, skip, limit, filter, search) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
  };

  let url = businessSerivceUri.buinessUrl + '?';

  if (_.isNumber(skip)) url = url + '&skip=' + skip;
  if (_.isNumber(limit)) url = url + '&limit=' + limit;
  if (!_.isEmpty(filter)) {
    if (!!filter.state) url = url + '&state=' + filter.state;
    if (!!filter.event) url = url + '&event=1';
    if (!!filter.reports) url = url + '&reports=1';
    if (!!filter.list) url = url + '&list=' + filter.list;
    if (!!filter.category) url = url + '&category=' + filter.category;
    if (!!filter.area) url = url + '&area=' + filter.area;
  }

  if (!_.isEmpty(search)) url = url+ '&search=' + search;

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
 * Fetch business list by category
 * @param {Number} skip - Number of business to skip
 * @param {Number} limit - Number of business to limit
 * @param {Object} filter - Business list filter
 * @param {String} search - Search business
 * @param {String} orderBy - List order
 */
export const fetchBusinessListByCategory = (name, limit, filter, orderBy) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let url = businessSerivceUri.getBusinessListByCategory + name + '?';

  if (_.isNumber(limit)) url = url + 'limit=' + limit;

  if (!_.isEmpty(filter)) {
    if (!!filter.event) url = url + '&event=1';
    if (!!filter.area) url = url + '&area=' + filter.area;
  }

  if (orderBy) {
    url = url + '&orderBy=' + orderBy;
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
 * Fetch single business
 * @param {String} type - Enum: id, enName
 * @param {String} value - Type value
 * @param {String} by - User id
 */
export const fetchSingleBusiness = (type, value, by) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let url = businessSerivceUri.getSingleBusinessUrl + '?' + type + '=' + value;

  if (by) url = url + '&by=' + by;

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
 * Upload business images
 * @param {String} token - Verification code
 * @param {Object} data - Business data
 */
export const uploadImagesFetch = (token, id, data) => {
  const options = {
    "method": 'POST',
    "headers": {
      "Authorization": 'Bearer ' + token,
    },
    "body": data,
  };

  return fetch(businessSerivceUri.businessImagesUrl + '/' + id, options)
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
 * Delete business image
 */
export const deleteImageFetch = (token, id, data) => {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify(data),
  };

  return fetch(businessSerivceUri.businessImagesUrl + '/' + id, options)
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
    .catch(err => {
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
    .catch(err => {
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
    .catch(err => {
      return Promise.reject(err);
  });

}
