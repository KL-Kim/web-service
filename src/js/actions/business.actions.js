/**
 * Business Actions
 */
import _ from 'lodash';

import businessTypes from '../constants/business.types';
import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import { fetchBusinessList, AddBusinessFetch } from '../api/business.service';

/**
 * Get business list
 * @param {Number} skip - Number of business to skip
 * @param {Number} limit - Number of business to limit
 */
export const getBusinessList = (skip, limit) => {
  const _getBusinessListRequest = () => ({
    "type": businessTypes.GET_BUSINESS_LIST_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getBusinessListSuccess = (response) => ({
    "type": businessTypes.GET_BUSINESS_LIST_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      list: response.list,
      totalCount: response.totalCount
    }
  });

  const _getBusinessListFailure = (error) => ({
    "type": businessTypes.GET_BUSINESS_LIST_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    dispatch(_getBusinessListRequest());
    return fetchBusinessList(skip, limit)
      .then(response => {
        dispatch(_getBusinessListSuccess(response));

        return ;
      })
      .catch(err => {
        dispatch(_getBusinessListFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      })
  }
}

/**
 * Add business
 * @param {Object} data - New business data
 */
export const addBusiness = (data) => {
  const _addBusinessRequest = () => ({
    "type": businessTypes.ADD_BUSINESS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _addBusinessSuccess = (response) => ({
    "type": businessTypes.ADD_BUSINESS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": response
  });

  const _addBusinessFailure = (error) => ({
    "type": businessTypes.ADD_BUSINESS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    dispatch(_addBusinessRequest());
    return getToken()
      .then(token => {
        return AddBusinessFetch("ADD", token, data)
      })

      .then(response => {
        dispatch(_addBusinessSuccess(response));
        dispatch(AlertActions.alertSuccess("Add business successfully"));

        return ;
      })
      .catch(err => {
        dispatch(_addBusinessFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}
