/**
 * Business Tag Actions
 */
import isEmpty from 'lodash/isEmpty';

import tagTypes from '../constants/tag.types';
import * as AlertActions from './alert.actions';
import { fetchCategoriesOrTags } from '../api/business.service';

// WebStorage
import webStorageTypes from '../constants/webStorage.types.js';
import { saveToStorage, loadFromStorage, removeFromStorage } from '../helpers/webStorage';

/**
 * Get business tags list
 */
export const getTagsList = () => {
  const _getTagsRequest = () => ({
    "type": tagTypes.GET_TAGS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getTagsSuccess = (reponse) => ({
    "type": tagTypes.GET_TAGS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      list: reponse,
    }
  });

  const _getTagsFailure = (error) => ({
    "type": tagTypes.GET_TAGS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    const state = getState();

    if (!isEmpty(state.tagReducer.tagsList)) {
      return Promise.resolve(state.tagReducer.tagsList);
    }

    const updatedAt = loadFromStorage(webStorageTypes.WEB_STORAGE_TAGS_UPDATED_AT);
    const tags = loadFromStorage(webStorageTypes.WEB_STORAGE_TAGS_LIST);

    if (!isEmpty(tags) && (updatedAt + 60 * 60 * 1000) > Date.now()) {
      dispatch(_getTagsSuccess(tags));

      return Promise.resolve(tags);
    }

    dispatch(_getTagsRequest());

    return fetchCategoriesOrTags("TAG")
      .then(response => {
        saveToStorage(webStorageTypes.WEB_STORAGE_TAGS_LIST, response);
        saveToStorage(webStorageTypes.WEB_STORAGE_TAGS_UPDATED_AT, Date.now());

        dispatch(_getTagsSuccess(response));

        return response;
      })
      .catch(err => {
        removeFromStorage(webStorageTypes.WEB_STORAGE_TAGS_LIST);
        removeFromStorage(webStorageTypes.WEB_STORAGE_TAGS_UPDATED_AT);

        dispatch(_getTagsFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}
