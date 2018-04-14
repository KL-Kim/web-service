/**
 * User Reducer
 */
import userTypes from '../constants/user.types.js';
import emailTypes from '../constants/email.types.js';

const initialState = {
  "user": {},
  "isFetching": false,
  "isLoggedIn": false,
  "error": null,
  "updatedAt": null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {

    case emailTypes.SEND_EMAIL_REQUEST:
    case userTypes.LOGIN_REQUEST:
    case userTypes.REGISTER_REQUEST:
    case userTypes.VERIFY_REQUEST:
    case userTypes.CHANGE_PASSWORD_REQUEST:
    case userTypes.GET_USER_BY_ID_REQUEST:
    case userTypes.LOGOUT_REQUEST:
    case userTypes.UPDATE_USER_PROFILE_REQUEST:
    case userTypes.UPLOAD_PROFILE_PHOTO_REQUEST:
    case userTypes.UPDATE_MOBILE_PHONE_REQUEST:
      return {
        ...state,
        "isFetching": true,
        "error": null,
      };

    case emailTypes.SEND_EMAIL_FAILURE:
    case userTypes.LOGIN_FAILURE:
    case userTypes.REGISTER_FAILURE:
    case userTypes.VERIFY_FAILURE:
    case userTypes.CHANGE_PASSWORD_FAILURE:
    case userTypes.GET_USER_BY_ID_FAILURE:
    case userTypes.LOGOUT_FAILURE:
    case userTypes.UPDATE_USER_PROFILE_FAILURE:
    case userTypes.UPLOAD_PROFILE_PHOTO_FAILURE:
    case userTypes.UPDATE_MOBILE_PHONE_FAILURE:
      return {
        ...state,
        "isFetching": false,
        "error": action.error,
      };

    // Send email
    case emailTypes.SEND_EMAIL_SUCCESS:
      return {
        ...state,
        "isFetching": false,
      };

    // Login
    case userTypes.LOGIN_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "isLoggedIn": true,
        "user": action.payload.user,
        "updatedAt": Date.now(),
      };

    // Regsiter
    case userTypes.REGISTER_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "isLoggedIn": true,
        "user": action.payload.user,
        "updatedAt": Date.now(),
      };

    // Verify Account
    case userTypes.VERIFY_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "user": action.payload.user,
        "updatedAt": Date.now(),
      };

    // Change password
    case userTypes.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        "isFetching": false,
      };

    // Get User By Id
    case userTypes.GET_USER_BY_ID_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "isLoggedIn": true,
        "user": action.payload.user,
        "updatedAt": Date.now(),
      };

    // Log out
    case userTypes.LOGOUT_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "user": null,
        "isLoggedIn": false,
      };

    // Update user profile
    case userTypes.UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "user": action.payload.user,
        "updatedAt": Date.now(),
      };

    // Upload user profile photo
    case userTypes.UPLOAD_PROFILE_PHOTO_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "user": action.payload.user,
        "updatedAt": Date.now(),
      };

    // Update user mobile phone number
    case userTypes.UPDATE_MOBILE_PHONE_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "user": action.payload.user,
        "updatedAt": Date.now(),
      };

    default:
      return state;
  }
}

export default userReducer;
