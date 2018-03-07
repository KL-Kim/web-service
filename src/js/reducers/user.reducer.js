/**
 * User Reducer
 */
import userTypes from '../constants/user.types.js';

const initialState = {
  "user": null,
  "isFetching": false,
  "isLoggedIn": false,
  "response": null,
  "error": null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {

    // Login
    case userTypes.LOGIN_REQUEST:
      return {
        ...state,
        "isFetching": true,
      };

    case userTypes.LOGIN_SUCCESS:
      return {
        ...state,
        "user": action.payload.user,
        "isFetching": false,
        "isLoggedIn": true,
      };

    case userTypes.LOGIN_FAILURE:
      return {
        ...state,
        "error": action.payload.error,
        "isFetching": false,
        "user": null,
      };

    // Register
    case userTypes.REGISTER_REQUEST:
      return {
        ...state,
        "isFetching": true,
      };

    case userTypes.REGISTER_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "isLoggedIn": true,
        "user": action.payload.user,
      };

    case userTypes.REGISTER_FAILURE:
      return {
        ...state,
        "isFetching": false,
        "user": null,
        "error": action.payload.error,
      };

    // Verify Account
    case userTypes.VERIFY_REQUEST:
      return {
        ...state,
        "isFetching": true,
      };

    case userTypes.VERIFY_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "user": action.payload.user,
      };

    case userTypes.VERIFY_FAILURE:
      return {
        ...state,
        "isFetching": false,
        "error": action.payload.error,
      };

    // Change password
    case userTypes.CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        "isFetching": true,
      };

    case userTypes.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        "isFetching": false,
        "response": true
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

    default:
      return state;
  }
}

export default userReducer;
