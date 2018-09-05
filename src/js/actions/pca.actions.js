/**
 * Pca Actions
 */
import isEmpty from 'lodash/isEmpty';

import * as AlertActions from './alert.actions';
import pcaTypes from 'js/constants/pca.types';
import { fetchPCA } from 'js/api/pca.service';

import config from 'js/config/config';

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

  const _getProvincesSuccess = () => ({
    "type": pcaTypes.GET_PROVINCES_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {},
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

  const _getCitiesSuccess = () => ({
    "type": pcaTypes.GET_CITIES_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _getCitiesFailure = (error) => ({
    "type": pcaTypes.GET_CITIES_REQUEST,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (isEmpty(code)) {
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

  const _getAreasSuccess = () => ({
    "type": pcaTypes.GET_AREAS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {},
  });

  const _getAreasFailure = (error) => ({
    "type": pcaTypes.GET_AREAS_REQUEST,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (isEmpty(code)) {
      const error = new Error("Code missing");
      return Promise.reject(error);
    }

    dispatch(_requestGetAreas());

    return fetchPCA('area', code)
      .then(res => {
        if (code === config.CITY_CODE) {
          dispatch(_getAreasSuccess(res));
        } else {
          dispatch(_getAreasSuccess([]));
        }

        return res;
      }).catch(err => {
        dispatch(AlertActions.alertFailure(err.message));
        dispatch(_getAreasFailure(err));

        return ;
      });
  };
}

/**
 * Get general areas
 */
export const getGeneralAreas = () => {
  const _getGeneralAreasRequest = () => ({
    "type": pcaTypes.GET_GENERAL_AREAS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getGeneralAreasSuccess = (areas) => ({
    "type": pcaTypes.GET_GENERAL_AREAS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      "areas": areas
    },
  });

  const _getGeneralAreasFailure = (error) => ({
    "type": pcaTypes.GET_GENERAL_AREAS_REQUEST,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    const areas = loadFromStorage(webStorageTypes.WEB_STORAGE_GENERAL_AREAS);
    const state = getState();

    if (!isEmpty(state.pcaReducer.areas)) {
      return Promise.resolve(state.pcaReducer.areas);
    }
    else if (!isEmpty(areas)) {
      dispatch(_getGeneralAreasSuccess(areas));
      return Promise.resolve(areas);
    } 
    else {
      dispatch(_getGeneralAreasRequest());

      return fetchPCA('area', config.CITY_CODE)
        .then(res => {
          saveToStorage(webStorageTypes.WEB_STORAGE_GENERAL_AREAS, res);
          dispatch(_getGeneralAreasSuccess(res));

          return res;
        }).catch(err => {
          removeFromStorage(webStorageTypes.WEB_STORAGE_GENERAL_AREAS);
          dispatch(AlertActions.alertFailure(err.message));
          dispatch(_getGeneralAreasFailure(err));

          return ;
        });
    }
  };
}
