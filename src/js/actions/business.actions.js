/**
 * Business Actions
 */
import _ from 'lodash';

import businessTypes from '../constants/business.types';
import * as AlertActions from './alert.actions';
import { getToken } from '../api/auth.service';
import {
  fetchBusinessList,
  businessOpertationFetch,
  fetchSingleBusiness,
  uploadImagesFetch,
  deleteImageFetch
} from '../api/business.service';

/**
 * Get business list
 * @param {Number} skip - Number of business to skip
 * @param {Number} limit - Number of business to limit
 * @param {Object} filter - Business list filter
 * @param {search} search - Search business
 */
export const getBusinessList = (skip, limit, filter, search) => {
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
    return fetchBusinessList(skip, limit, filter, search)
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
 */
export const getSingleBusiness = (type, value) => {
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
    if (_.isEmpty(type) || _.isEmpty(value)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_getSingleBusinessRequest());
    return fetchSingleBusiness(type, value)
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

  const _addBusinessSuccess = () => ({
    "type": businessTypes.ADD_BUSINESS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
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
      .then(json => {
        dispatch(_addBusinessSuccess());
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

  const _updateBusinessSuccess = () => ({
    "type": businessTypes.UPDATE_BUSINESS_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _updateBusinessFailure = (error) => ({
    "type": businessTypes.UPDATE_BUSINESS_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(data)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_updateBusinessRequest());
    return getToken()
      .then(token => {
        return businessOpertationFetch("UPDATE", token, data)
      })

      .then(response => {
        dispatch(_updateBusinessSuccess());
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
    if (_.isEmpty(id)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_deleteBusinessRequest());
    return getToken()
      .then(token => {
        return businessOpertationFetch("DELETE", token, {"_id": id})
      })

      .then(response => {
        dispatch(_deleteBusinessSuccess());
        dispatch(AlertActions.alertSuccess("Delete business successfully"));
        dispatch(getBusinessList());

        return response;
      })
      .catch(err => {
        dispatch(_deleteBusinessFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}

/**
 * Upload business images
 * @param {String} id - Business id
 * @param {FormData} formData - Business data
 */
export const uploadImages = (id, formData) => {
  const _uploadImagesRequest = () => ({
    "type": businessTypes.UPLOAD_IMAGES_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _uploadImagesSuccess = () => ({
    "type": businessTypes.UPLOAD_IMAGES_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _uploadImagesFailure = (error) => ({
    "type": businessTypes.UPLOAD_IMAGES_FAILURE,
    "meta": {},
    "error": error,
    "payload": {}
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }
    dispatch(_uploadImagesRequest());

    return getToken()
      .then(token => {
        return uploadImagesFetch(token, id, formData)
      })
      .then(response => {
        dispatch(_uploadImagesSuccess());
        dispatch(AlertActions.alertSuccess("Upload images successfully"));

        return response;
      })
      .catch(err => {
        dispatch(_uploadImagesFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}

/**
 * Delete business image
 * @param {String} id - Business id
 * @param {Object} data - Business image uri
 */
export const deleteImage = (id, data) => {
  const _deleteImageRequest = () => ({
    "type": businessTypes.DELETE_IMAGE_REQUEST,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _deleteImageSuccess = () => ({
    "type": businessTypes.DELETE_IMAGE_SUCCESS,
    "meta": {},
    "error": null,
    "payload": {}
  });

  const _deleteImageFailure = (error) => ({
    "type": businessTypes.DELETE_IMAGE_FAILURE,
    "meta": {},
    "error": error,
    "payload": null
  });

  return (dispatch, getState) => {
    if (_.isEmpty(id) || _.isEmpty(data)) {
      return dispatch(AlertActions.alertFailure("Bad request"));
    }

    dispatch(_deleteImageRequest());

    return getToken()
      .then(token => {
        return deleteImageFetch(token, id, data)
      })
      .then(response => {
        dispatch(_deleteImageSuccess());
        dispatch(AlertActions.alertSuccess("Delete image successfully"));

        return response;
      })
      .catch(err => {
        dispatch(_deleteImageFailure(err));
        dispatch(AlertActions.alertFailure(err.message));

        return ;
      });
  };
}
