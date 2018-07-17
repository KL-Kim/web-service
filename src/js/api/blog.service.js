/**
 * Blog service api
 * @version 0.0.1
 */

import Promise from 'bluebird';
import fetch from 'cross-fetch';

import config from '../config/config';
import responseErrorHandler from '../helpers/error-handler.js';

const blogServiceUri = {
  commonUrl: config.API_GATEWAY_ROOT + '/api/v1/post',
  singleCommonUrl: config.API_GATEWAY_ROOT + '/api/v1/post/single/',
  voteUrl: config.API_GATEWAY_ROOT + '/api/v1/post/vote/',
  reportUrl: config.API_GATEWAY_ROOT + '/api/v1/post/report/',
}

/**
 * Fetch posts list
 * @property {Nubmer} skip - Number of list to skip
 * @property {Number} limit - Number of list is limitted
 * @property {String} search - Search blog
 * @property {String} uid - Author user id
 * @property {String} status - Post status
 */
export const fetchPostsList = ({ skip, limit, search, uid, status, state } = {}) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let url = blogServiceUri.commonUrl + '?';

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

  if (status) {
    url = url + '&status=' + status;
  }

  if (state) {
    url = url + '&state=' + state;
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
 * Get single post
 * @param {String} id - Post id
 */
export const fetchSinglePost = (id) => {
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return fetch(blogServiceUri.singleCommonUrl + id, options)
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
 * Add new post
 * @param {String} token - Verification code
 * @property {String} authorId - Author user id
 * @property {String} title - Post title
 * @property {String} summary - Post summary
 * @property {String} content - Post content
 * @property {Array} keywords - Post keywords
 * @property {String} status - Post status
 */
export const addNewPostFetch = (token, { authorId, title, summary, content, keywords, status } = {}) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify({
      authorId,
      title,
      summary,
      content,
      keywords,
      status,
    }),
  };

  return fetch(blogServiceUri.commonUrl, options)
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
 * Update post
 * @param {String} token - Verification code
 * @param {String} id - Post id
 * @property {String} authorId - Author user id
 * @property {String} title - Post title
 * @property {String} summary - Post summary
 * @property {String} content - Post content
 * @property {Array} keywords - Post keywords
 * @property {String} status - Post status
 */
export const updatePostFetch = (token, id, { authorId, title, summary, content, keywords, status } = {}) => {
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify({
      authorId,
      title,
      summary,
      content,
      keywords,
      status,
    }),
  };

  return fetch(blogServiceUri.singleCommonUrl + id, options)
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
 * Delete post
 * @param {String} token - Verification code
 * @param {String} id - Post id
 * @property {String} authorId - Author user id
 */
export const deletePostFetch = (token, id, { authorId } = {}) => {
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify({
      authorId,
    }),
  };

  return fetch(blogServiceUri.singleCommonUrl + id, options)
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
 * Vote post
 * @param {String} token - Verification code
 * @param {String} id - Post id
 * @property {String} uid - User id
 * @property {String} vote - Vote type
 */
export const votePostFetch = (token, id, { uid, vote } = {}) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      "Authorization": 'Bearer ' + token,
    },
    body: JSON.stringify({
      uid,
      vote,
    }),
  };

  return fetch(blogServiceUri.voteUrl + id, options)
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
 * Report post
 * @param {String} id - Post id
 * @property {String} type - Report type
 * @property {String} content - Report content
 * @property {String} contact - User contact
 */
export const reportPostFetch = (id, { type, content, contact } = {}) => {
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

  return fetch(blogServiceUri.reportUrl + id, options)
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
