import Promise from 'bluebird';
import fetch from 'cross-fetch';
import _ from 'lodash';

import config from '../config/config';
import responseErrorHandler from '../helpers/error-handler.js';

/**
 * Comment serivce uri
 */
const commentSerivceUri = {
  commonUrl: config.API_GATEWAY_ROOT + '/api/v1/comment',
  getSingleUrl: config.API_GATEWAY_ROOT + '/api/v1/comment/single/',
  voteCommentUrl: config.API_GATEWAY_ROOT + '/api/v1/comment/vote/',
};

export const fetchCommentsList = ({ skip, limit, search, uid, pid, status, parantId } = {}) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let url = commentSerivceUri.commonUrl + '?';

  if (skip) {
    url = url + '&skip=' + skip;
  }

  if (limit) {
    url = url + '&limit=' + limit;
  }

  if (search) {
    url = url + '&search=' + search;
  }

  if (uid) {
    url = url + '&uid=' + uid;
  }

  if (pid) {
    url = url + '&pid=' + pid;
  }

  if (status) {
    url = url + '&url=' + url;
  }

  if (parantId) {
    url = url + '&parentId' + parentId
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
