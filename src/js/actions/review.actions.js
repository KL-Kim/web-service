/**
 * Business Category Actions
 */
import _ from 'lodash';

import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import reviewTypes from '../constants/review.types';
import { fetchReviews, reviewOperationFetch } from '../api/review.service';

export const getReviews = (type, value) => {
  const _getReviewsRequest = () => ({
    "type": reviewTypes.GET_REVIEWS_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _getReviewsSuccess = (response) => ({
    "type": reviewTypes.GET_REVIEWS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {
      reviews: response.list,
      totalCount: response.totalCount
    }
  });

  const _getReviewsFailure = (error) => ({
    "type": reviewTypes.GET_REVIEWS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    dispatch(_getReviewsRequest());

    return fetchReviews(type, value)
      .then(response => {
        dispatch(_getReviewsSuccess(response));

        return response;
      })
      .catch(err => {
        dispatch(_getReviewsFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}

export const addNewReview = (data) => {
  const _addNewReviewRequest = () => ({
    "type": reviewTypes.ADD_NEW_REVIEW_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _addNewReviewSuccess = () => ({
    "type": reviewTypes.ADD_NEW_REVIEW_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _addNewReviewFailure = (error) => ({
    "type": reviewTypes.ADD_NEW_REVIEW_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });


  return (dispatch, getState) => {
    dispatch(_addNewReviewRequest());

    return getToken()
      .then(token => {
        return reviewOperationFetch("ADD", token, data);
      })
      .then(response => {
        dispatch(_addNewReviewSuccess());
        dispatch(AlertActions.alertSuccess("Add review successfully"));

        return ;
      })
      .catch(err => {
        dispatch(_addNewReviewFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  }
}
