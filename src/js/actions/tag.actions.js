/**
 * Business Tag Actions
 */
import _ from 'lodash';

import tagTypes from '../constants/tag.types';
import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import { fetchCategoriesOrTags } from '../api/business.service';

/**
 * Get business tags list
 */
export const getTagsList = (search) => {
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
    dispatch(_getTagsRequest());

    return fetchCategoriesOrTags("TAG", search)
      .then(response => {
        return dispatch(_getTagsSuccess(response));
      })
      .catch(err => {
        dispatch(_getTagsFailure(err));
        if (err.message)
          dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}
