/**
 * Pca Actions
 */
import _ from 'lodash';
import Promise from 'bluebird';
import pcaTypes from '../constants/pca.types';
import { getPcaFetch } from '../api/pca.service';

const requestGetCities = () => ({
  "type": pcaTypes.GET_CITIES_REQUEST,
  "meta": {},
  "error": null,
  "payload": {}
});

const getCitiesSuccess = (cities) => ({
  "type": pcaTypes.GET_CITIES_SUCCESS,
  "meta": {},
  "error": null,
  "payload": {
    "cities": cities
  },
});

const getCitiesFailure = (error) => ({
  "type": pcaTypes.GET_CITIES_REQUEST,
  "meta": {},
  "error": error,
  "payload": {}
});

export const getCities = (code) => {
  return (dispatch, getState) => {
    if (_.isEmpty(code)) {
      const error = new Error("Code missing");
      return Promise.reject(error);
    }

    dispatch(requestGetCities());

    return getPcaFetch('city', code)
      .then(res => {
        return dispatch(getCitiesSuccess(res));
      }).catch(err => {
        return dispatch(getCitiesFailure(err));
      });
  };
}

const requestGetAreas = () => ({
  "type": pcaTypes.GET_AREAS_REQUEST,
  "meta": {},
  "error": null,
  "payload": {}
});

const getAreasSuccess = (areas) => ({
  "type": pcaTypes.GET_AREAS_SUCCESS,
  "meta": {},
  "error": null,
  "payload": {
    "areas": areas
  },
});

const getAreasFailure = (error) => ({
  "type": pcaTypes.GET_AREAS_REQUEST,
  "meta": {},
  "error": error,
  "payload": {}
});

export const getAreas = (code) => {
  return (dispatch, getState) => {
    if (_.isEmpty(code)) {
      const error = new Error("Code missing");
      return Promise.reject(error);
    }

    dispatch(requestGetAreas());

    return getPcaFetch('area', code)
      .then(res => {
        return dispatch(getAreasSuccess(res));
      }).catch(err => {
        return dispatch(getAreasFailure(err));
      });
  };
}
