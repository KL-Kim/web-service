/**
 * Business Actions
 */
import _ from 'lodash';

import businessTypes from '../constants/business.types';
import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import { fetchBusinessList, businessOpertationFetch, fetchSingleBusiness } from '../api/business.service';

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
 * Get single business
 * @param {String} id - Business id
 */
export const getSingleBusiness = (id) => {
  const _getSingleBusinessRequest = () => ({
    "type": businessTypes.GET_SINGLE_BUSINESS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getSignleBusinessSuccess = (response) => ({
    "type": businessTypes.GET_SINGLE_BUSINESS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      business: response,
    }
  });

  const _getSingleBusinessFailure = (error) => ({
    "type": businessTypes.GET_SINGLE_BUSINESS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id)) {
      return dispatch(AlertActions.alertFailure("Id is missing"));
    }

    dispatch(_getSingleBusinessRequest());
    return fetchSingleBusiness(id)
      .then(business => {
        dispatch(_getSignleBusinessSuccess(business));

        return business;
      })
      .catch(err => {
        dispatch(_getSingleBusinessFailure(err));
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
    "payload": {
      business: response
    }
  });

  const _addBusinessFailure = (error) => ({
    "type": businessTypes.ADD_BUSINESS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(data)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_addBusinessRequest());
    return getToken()
      .then(token => {
        return businessOpertationFetch("ADD", token, data)
      })
      .then(response => {
        return response.json();
      })
      .then(json => {
        dispatch(_addBusinessSuccess(json));
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

/**
 * Update business
 * @param {Object} data - Business data
 */
export const updateBusiness = (data) => {
  const _updateBusinessRequest = () => ({
    "type": businessTypes.UPDATE_BUSINESS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _updateBusinessSuccess = (response) => ({
    "type": businessTypes.UPDATE_BUSINESS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": response
  });

  const _updateBusinessFailure = (error) => ({
    "type": businessTypes.UPDATE_BUSINESS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    dispatch(_updateBusinessRequest());
    return getToken()
      .then(token => {
        return businessOpertationFetch("UPDATE", token, data)
      })

      .then(response => {
        dispatch(_updateBusinessSuccess(response));
        dispatch(AlertActions.alertSuccess("Update business successfully"));

        return ;
      })
      .catch(err => {
        dispatch(_updateBusinessFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}

/**
 * Delete business
 * @param {String} id - Business id
 */
export const deleteBusiness = (id) => {
  const _deleteBusinessRequest = () => ({
    "type": businessTypes.DELETE_BUSINESS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _deleteBusinessSuccess = () => ({
    "type": businessTypes.DELETE_BUSINESS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": ""
  });

  const _deleteBusinessFailure = (error) => ({
    "type": businessTypes.DELETE_BUSINESS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    dispatch(_deleteBusinessRequest());
    return getToken()
      .then(token => {
        return businessOpertationFetch("DELETE", token, {"_id": id})
      })

      .then(response => {
        dispatch(_deleteBusinessSuccess(response));
        dispatch(AlertActions.alertSuccess("Delete business successfully"));

        return ;
      })
      .catch(err => {
        dispatch(_deleteBusinessFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}
