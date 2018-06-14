/**
 * Business Category Actions
 */

import categoryTypes from '../constants/category.types';
import * as AlertActions from './alert.actions';
import { fetchCategoriesOrTags } from '../api/business.service';

/**
 * Get business categories list
 * @param {String} search - Search term
 */
export const getCategoriesList = (search) => {
  const _getCategoriesRequest = () => ({
    "type": categoryTypes.GET_CATEGORY_REQUEST,
  });

  const _getCategoriesSuccess = (reponse) => ({
    "type": categoryTypes.GET_CATEGORY_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      list: reponse
    }
  });

  const _getCategoriesFailure = (error) => ({
    "type": categoryTypes.GET_CATEGORY_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    dispatch(_getCategoriesRequest());

    return fetchCategoriesOrTags("CATAGORY", search)
      .then(response => {
        return dispatch(_getCategoriesSuccess(response));
      })
      .catch(err => {
        dispatch(_getCategoriesFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}
