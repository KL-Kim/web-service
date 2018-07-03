import Promise from 'bluebird';
import fetch from 'cross-fetch';
import _ from 'lodash';

import config from '../config/config';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * Business serivce uri
 */
const businessSerivceUri = {
  commonUrl: config.API_GATEWAY_ROOT + '/api/v1/business?',
  getSingleBusinessUrl: config.API_GATEWAY_ROOT + '/api/v1/business/single/',
  categoryUrl: config.API_GATEWAY_ROOT + '/api/v1/category',
  tagUrl: config.API_GATEWAY_ROOT + '/api/v1/tag',
  reportBusinessUrl: config.API_GATEWAY_ROOT + '/api/v1/business/report/',
};

/**
 * Fetch business list
 * @property {Number} skip - Number of business to skip
 * @property {Number} limit - Number of business to limit
 * @property {Object} filter - Business list filter
 * @property {String} search - Search business
 * @property {String} orderBy - List order
 * @property {String} category - Business category filter
 * @property {String} tag - Business tag filter
 * @property {String} area - Business area filter
 * @property {Boolean} event - Business event filter
 * @property {Array} ids - Busines ids
 */
export const fetchBusinessList = ({ skip, limit, filter, search, orderBy, category, tag, area, event, ids } = {}) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let url = businessSerivceUri.commonUrl;

  if (_.isNumber(skip)) url = url + '&skip=' + skip;
  if (_.isNumber(limit)) url = url + '&limit=' + limit;

  if (category) url = url + '&category=' + category;
  if (tag) url = url + '&tag=' + tag;
  if (area) url = url + '&area=' + area;
  if (event) url = url + '&event=1';
  if (ids) url = url + '&ids=' + ids;

  if (orderBy) {
    url = url + '&orderBy=' + orderBy;
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
 * Fetch single business
 * @param {String} type - Enum: id, enName
 * @param {String} value - Type value
 * @param {String} by - User id
 */
export const fetchSingleBusiness = (slug) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(businessSerivceUri.getSingleBusinessUrl + slug, options)
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
 * Report business
 * @param {String} id - Business Id
 * @param {String} Content - Report content
 * @param {String} contact - Reporter contact
 */
export const reportBusinessFetch = (id, { type, content, contact } = {}) => {
  const options = {
    "method": 'POST',
    "headers": {
      'Content-Type': 'application/json',
    },
    "body": JSON.stringify({
      type,
      content,
      contact,
    }),
  };

  return fetch(businessSerivceUri.reportBusinessUrl + id, options)
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
 * @param {Number} skip - Number to skip
 * @param {Number} limit - Number to limit
 * @param {String} search - Search term
 * @param {String} orderBy - List order
 */
export const fetchCategoriesOrTags = (type, { skip, limit, search, orderBy } = {}) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let url;

  switch (type) {
    case "CATAGORY":
      url = businessSerivceUri.categoryUrl + '?';
      break;

    case "TAG":
      url = businessSerivceUri.tagUrl + '?';
      break;

    default:
      return Promise.reject(new Error("Type is missing"));
  }

  if (_.isNumber(skip)) url = url + '&skip=' + skip;
  if (_.isNumber(limit)) url = url + '&limit=' + limit;

  if (search)
    url = url + '&search=' + search;

  if (orderBy)
    url = url + '&orderBy=' + orderBy;

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
