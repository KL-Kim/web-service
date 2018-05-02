/**
 * Admin Actions
 */
import * as AlertActions from './alert.actions';
import _ from 'lodash';
import { getToken } from '../api/auth.service';
import { getUsersListFetch, adminEditUserFetch, getUserByIdFetch } from '../api/user.service';

/**
 * Fetch Users List
 * @role admin
 * @param {Number} skip - Number of users to be skipped.
 * @param {Number} limit - Limit Number of users to be returned.
 * @param {Object} rawFilter - Filter users list
 * @param {String} search - Search String
 */
export const getUsersList  = ( skip, limit, rawFilter = {}, search ) => {
  return (dispatch, getState) => {
    return getToken()
      .then(token => {
        let filter = {};

        if (rawFilter.role) {
          let role = [];

          _.map(rawFilter.role, (value, key) => {
            if (value) role.push(key);
          });

          filter.role = role;
        }

        if (rawFilter.userStatus) {
          let userStatus = [];

          _.map(rawFilter.userStatus, (value, key) => {
            if (value) userStatus.push(key);
          });

          filter.userStatus = userStatus;
        }

        return getUsersListFetch(token, skip, limit, filter, search);
      })
      .then(usersList => {
        return usersList;
      })
      .catch(err => {
        return dispatch(AlertActions.alertFailure("Get users list failed!"));
      });
  };
};

/**
 * Get user by id
 */
export const adminGetUser = (id) => {
  return (dispatch, getState) => {
    if (_.isUndefined(id)) {
      return dispatch(AlertActions.alertFailure("Bad request!"));
    }

    return getToken()
      .then(token => {
        return getUserByIdFetch(token, id)
      })
      .then(response => {
        return response;
      })
      .catch(err => {
        dispatch(AlertActions.alertFailure("Get user failed!"));

        return ;
      });
  };
}

/**
 * Admin edit user
 * @role admin
 * @param {String} id - User's id
 * @param {Object} data - User's account object
 */
export const adminEditUser = (id, data) => {
  return (dispatch, getState) => {
    if (_.isUndefined(id) || _.isEmpty(data)) {
      return dispatch(AlertActions.alertFailure("Bad request!"));
    }

    return getToken()
      .then(token => {
        return adminEditUserFetch(token, id, data)
      })
      .then(response => {
        return dispatch(AlertActions.alertSuccess("Update successfully"));
      })
      .catch(err => {
        return dispatch(AlertActions.alertFailure("Update failed!"));
      });
  };
};
