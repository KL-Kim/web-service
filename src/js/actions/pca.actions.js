/**
 * Pca Actions
 */
import _ from 'lodash';
import Promise from 'bluebird';
import * as AlertActions from './alert.actions';
import pcaTypes from 'js/constants/pca.types';
import { fetchPCA } from 'js/api/pca.service';

// WebStorage Related
import { saveToStorage, loadFromStorage, removeFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types.js';

/**
 * Get provinces
 */
export const getProvinces = (code) => {
  const _getProvincesRequest = () => ({
    "type": pcaTypes.GET_PROVINCES_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getProvincesSuccess = (res) => ({
    "type": pcaTypes.GET_PROVINCES_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      provinces: res,
    }
  });

  const _getProvincesFailure = (error) => ({
    "type": pcaTypes.GET_PROVINCES_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    dispatch(_getProvincesRequest());

    return fetchPCA('province')
      .then(response => {
        dispatch(_getProvincesSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(_getProvincesFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
} 

/**
 * Get cities
 * @param {Number} code - Province code
 */
export const getCities = (code) => {
  const _requestGetCities = () => ({
    "type": pcaTypes.GET_CITIES_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getCitiesSuccess = (cities) => ({
    "type": pcaTypes.GET_CITIES_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "cities": cities
    },
  });

  const _getCitiesFailure = (error) => ({
    "type": pcaTypes.GET_CITIES_REQUEST,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(code)) {
      const error = new Error("Code missing");
      return Promise.reject(error);
    }

    dispatch(_requestGetCities());

    return fetchPCA('city', code)
      .then(res => {
        dispatch(_getCitiesSuccess(res));

        return res;
      }).catch(err => {
        dispatch(_getCitiesFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}

/**
 * Get areas
 * @param {Number} code - City code
 */
export const getAreas = (code) => {
  const _requestGetAreas = () => ({
    "type": pcaTypes.GET_AREAS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getAreasSuccess = (areas) => ({
    "type": pcaTypes.GET_AREAS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "areas": areas
    },
  });

  const _getAreasFailure = (error) => ({
    "type": pcaTypes.GET_AREAS_REQUEST,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(code)) {
      const error = new Error("Code missing");
      return Promise.reject(error);
    }

    dispatch(_requestGetAreas());

    return fetchPCA('area', code)
      .then(res => {
        dispatch(_getAreasSuccess(res));

        return res;
      }).catch(err => {
        dispatch(AlertActions.alertFailure(err.message));
        dispatch(_getAreasFailure(err));

        return ;
      });
  };
}
