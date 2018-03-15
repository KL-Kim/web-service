/**
 * User Reducer
 */
import userTypes from '../constants/user.types.js';

const initialState = {
  "user": null,
  "isFetching": false,
  "isLoggedIn": false,
  "error": null,
  "response": null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {

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
        "user": action.payload.user,
        "isFetching": false,
        "isLoggedIn": true,
        "error": null,
      };

    case userTypes.LOGIN_FAILURE:
      return {
        ...state,
        "error": action.error,
        "isFetching": false,
        "user": null,
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
        "error": null,
      };

    case userTypes.REGISTER_FAILURE:
      return {
        ...state,
        "isFetching": false,
        "user": null,
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
        "error": null,
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
        "response": true,
        "error": null,
      };

    case userTypes.CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        "error": action.error,
        "isFetching": false,
        "response": false
      };

    // Get User By Id
    case userTypes.GET_USER_BY_ID_REQUEST:
      return {
        ...state,
        "isFetching": true,
      };

    case userTypes.GET_USER_BY_ID_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "user": action.payload.user,
        "isLoggedIn": true,
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
      };

    case userTypes.UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "user": action.payload.user,
        "error": null,
      };

    case userTypes.UPDATE_USER_PROFILE_FAILURE:
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
