/**
 * Business Actions
 */
import _ from 'lodash';

import businessTypes from '../constants/business.types';
import * as AlertActions from './alert.actions';
import {
  fetchBusinessList,
  fetchSingleBusiness,
  reportBusinessFetch,
} from '../api/business.service';

/**
 * Clear business reduer
 */
export const clearBusinessList = () => {
  return (dispatch) => dispatch({
    "type": businessTypes.CLEAR_BUSINESS_LIST,
  });
};

/**
 * Get business list
 * @property {Number} params.skip - Number of business to skip
 * @property {Number} params.limit - Number of business to limit
 * @property {Object} params.filter - Business list filter
 * @property {String} params.search - Search business
 * @property {String} params.orderBy - List order
 * @property {String} params.category - Business category filter
 * @property {String} params.tag - Business tag filter
 * @property {String} params.area - Business area filter
 * @property {Boolean} params.event - Business event filter
 * @property {Array} params.ids - Busines ids
 */
export const getBusinessList = (params) => {
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
    return fetchBusinessList(params)
      .then(response => {
        dispatch(_getBusinessListSuccess(response));

        return response;
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
 * @param {String} type - Enum: id, enName
 * @param {String} value - Type value
 * @param {String} by - User id
 */
export const getSingleBusiness = (slug) => {
  const _getSingleBusinessRequest = () => ({
    "type": businessTypes.GET_SINGLE_BUSINESS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getSignleBusinessSuccess = () => ({
    "type": businessTypes.GET_SINGLE_BUSINESS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getSingleBusinessFailure = (error) => ({
    "type": businessTypes.GET_SINGLE_BUSINESS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(slug)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_getSingleBusinessRequest());
    return fetchSingleBusiness(slug)
      .then(business => {
        dispatch(_getSignleBusinessSuccess());

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
 * Report Business
 * @param {String} id - Business Id
 * @param {String} Content - Report content
 * @param {String} contact - Reporter contact
 */
export const reportBusiness = (id, {type, content, contact} = {}) => {
  const _reportBusinessRequest = () => ({
    "type": businessTypes.REPORT_BUSINESS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _reportBusinessSuccess = () => ({
    "type": businessTypes.REPORT_BUSINESS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _reportBusinessFailure = (error) => ({
    "type": businessTypes.REPORT_BUSINESS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id) || _.isEmpty(content)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_reportBusinessRequest());

    return reportBusinessFetch(id, { type, content, contact })
      .then(response => {
        dispatch(_reportBusinessSuccess());
        dispatch(AlertActions.alertSuccess("Thank you for your kindness"));

        return response;
      })
      .catch(err => {
        dispatch(_reportBusinessFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return;
      });
  }
}
