/**
 * Admin Actions
 */
import * as AlertActions from './alert.actions';
import _ from 'lodash';
import { getToken } from '../api/auth.service';
import { getUsersListFetch, adminEditUserFetch } from '../api/user.service';

/**
 * Fetch Users List
 * @role admin
 * @param {Number} skip - Number of users to be skipped.
 * @param {Number} limit - Limit Number of users to be returned.
 * @param {Object} rawFilter - Filter users list
 * @param {String} search - Search String
 */
export const getUsersList  = ( limit, skip, rawFilter = {}, search ) => {
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

        return getUsersListFetch(token, limit, skip, filter, search);
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
 * Admin edit user
 * @role admin
 * @param {String} id - User's id
 * @param {Object} data - User's account object
 */
export const adminEditUser = (id, data) => {
  return (dispatch, getState) => {
    return getToken()
      .then(token => {
        return adminEditUserFetch(token, id, data)
      })
      .then(reponse => {
        return dispatch(AlertActions.alertSuccess("Update successfully"));
      })
      .catch(err => {
        return dispatch(AlertActions.alertFailure("Update failed!"));
      });
  };
};
