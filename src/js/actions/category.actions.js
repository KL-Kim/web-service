/**
 * Business Category Actions
 */
import isEmpty from 'lodash/isEmpty';

import categoryTypes from 'js/constants/category.types';
import * as AlertActions from './alert.actions';
import { fetchCategoriesOrTags } from 'js/api/business.service';
import webStorageTypes from 'js/constants/webStorage.types.js';
import { saveToStorage, loadFromStorage, removeFromStorage } from 'js/helpers/webStorage';

/**
 * Get business categories list
 */
export const getCategoriesList = () => {
  const _getCategoriesRequest = () => ({
    "type": categoryTypes.GET_CATEGORY_REQUEST,
  });

  const _getCategoriesSuccess = (response) => ({
    "type": categoryTypes.GET_CATEGORY_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      list: response
    }
  });

  const _getCategoriesFailure = (error) => ({
    "type": categoryTypes.GET_CATEGORY_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {

    const state = getState();

    if (!isEmpty(state.categoryReducer.categoriesList)) {
      return Promise.resolve(state.categoryReducer.categoriesList);
    }

    const updatedAt = loadFromStorage(webStorageTypes.WEB_STORAGE_CATEGORIES_UPDATED_AT);
    const categories = loadFromStorage(webStorageTypes.WEB_STORAGE_CATEGORIES_LIST);

    if (categories && (updatedAt + 60 * 60 * 1000) > Date.now()) {
      dispatch(_getCategoriesSuccess(categories));

      return Promise.resolve(categories);
    }
  
    dispatch(_getCategoriesRequest());

    return fetchCategoriesOrTags("CATAGORY")
      .then(response => {
        saveToStorage(webStorageTypes.WEB_STORAGE_CATEGORIES_LIST, response);
        saveToStorage(webStorageTypes.WEB_STORAGE_CATEGORIES_UPDATED_AT, Date.now());

        dispatch(_getCategoriesSuccess(response));

        return response;
      })
      .catch(err => {
        removeFromStorage(webStorageTypes.WEB_STORAGE_CATEGORIES_LIST);
        removeFromStorage(webStorageTypes.WEB_STORAGE_CATEGORIES_UPDATED_AT);

        dispatch(_getCategoriesFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}
