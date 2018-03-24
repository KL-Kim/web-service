/**
 * Admin Actions
 */
import _ from 'lodash';

import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import { getUsersListFetch, adminEditUserFetch } from '../api/user.service';

export const getUsersList  = (limit, skip) => {
  return (dispatch, getState) => {
    return getToken()
      .then(token => {
        return getUsersListFetch(token, limit, skip);
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
