/**
 * Admin Actions
 */
import * as AlertActions from './alert.actions';
import _ from 'lodash';
import { getToken } from '../api/auth.service';
import { getUsersListFetch, adminEditUserFetch } from '../api/user.service';

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
