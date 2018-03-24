/**
 * User Reducer
 */
import userTypes from '../constants/user.types.js';
import emailTypes from '../constants/email.types.js';

const initialState = {
  "user": null,
  "isFetching": false,
  "isLoggedIn": false,
  "error": null,
  "updatedAt": null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {

    // Send Email
    case emailTypes.SEND_EMAIL_REQUEST:
      return {
        ...state,
        "isFetching": true,
        "error": null,
      };

    case emailTypes.SEND_EMAIL_SUCCESS:
      return {
        ...state,
        "isFetching": false,
      };

    case emailTypes.SEND_EMAIL_FAILURE:
      return {
        ...state,
        "isFetching": false,
        "error": action.error,
      };

    // Login
    case userTypes.LOGIN_REQUEST:
      return {
        ...state,
        "isFetching": true,
        "error": null,
      };

    case userTypes.LOGIN_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "isLoggedIn": true,
        "user": action.payload.user,
        "updatedAt": Date.now(),
      };

    case userTypes.LOGIN_FAILURE:
      return {
        ...state,
        "error": action.error,
        "isFetching": false,
      };

    // Register
    case userTypes.REGISTER_REQUEST:
      return {
        ...state,
        "isFetching": true,
        "error": null,
      };

    case userTypes.REGISTER_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "isLoggedIn": true,
        "user": action.payload.user,
        "updatedAt": Date.now(),
      };

    case userTypes.REGISTER_FAILURE:
      return {
        ...state,
        "isFetching": false,
        "error": action.error,
      };

    // Verify Account
    case userTypes.VERIFY_REQUEST:
      return {
        ...state,
        "isFetching": true,
        "error": null,
      };

    case userTypes.VERIFY_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "user": action.payload.user,
        "updatedAt": Date.now(),
      };

    case userTypes.VERIFY_FAILURE:
      return {
        ...state,
        "isFetching": false,
        "error": action.error,
      };

    // Change password
    case userTypes.CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        "isFetching": true,
        "error": null,
      };

    case userTypes.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        "isFetching": false,
      };

    case userTypes.CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        "error": action.error,
        "isFetching": false,
      };

    // Get User By Id
    case userTypes.GET_USER_BY_ID_REQUEST:
      return {
        ...state,
        "isFetching": true,
        "error": null,
      };

    case userTypes.GET_USER_BY_ID_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "isLoggedIn": true,
        "user": action.payload.user,
        "updatedAt": Date.now(),
      };

    case userTypes.GET_USER_BY_ID_FAILURE:
      return {
        ...state,
        "isFetching": false,
        "error": action.error,
      };

    // Log out
    case userTypes.LOGOUT_REQUEST:
      return {
        ...state,
        "isFetching": true,
        "error": null,
      };

    case userTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "user": null,
        "isLoggedIn": false,
      };
    case userTypes.LOGOUT_FAILURE:
      return {
        ...state,
        "isFetching": false,
        "error": action.error,
      };

    // Update user profile
    case userTypes.UPDATE_USER_PROFILE_REQUEST:
      return {
        ...state,
        "isFetching": true,
        "error": null,
      };

    case userTypes.UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "user": action.payload.user,
        "updatedAt": Date.now(),
      };

    case userTypes.UPDATE_USER_PROFILE_FAILURE:
      return {
        ...state,
        "isFetching": false,
        "error": action.error,
      };

    case userTypes.UPLOAD_PROFILE_PHOTO_REQUEST:
      return {
        ...state,
        "isFetching": true,
        "error": null,
      };

    case userTypes.UPLOAD_PROFILE_PHOTO_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "user": action.payload.user,
        "updatedAt": Date.now(),
      };

    case userTypes.UPLOAD_PROFILE_PHOTO_FAILURE:
      return {
        ...state,
        "isFetching": false,
        "error": action.error,
      };

    case userTypes.UPDATE_MOBILE_PHONE_REQUEST:
      return {
        ...state,
        "isFetching": true,
        "error": null,
      };

    case userTypes.UPDATE_MOBILE_PHONE_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "user": action.payload.user,
        "updatedAt": Date.now(),
      };

    case userTypes.UPDATE_MOBILE_PHONE_FAILURE:
      return {
        ...state,
        "isFetching": false,
        "error": action.error,
      };

    default:
      return state;
  }
}

export default userReducer;
