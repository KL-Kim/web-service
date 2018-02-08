/**
 * User Reducer
 */
import userTypes from '../constants/user.types.js'

const initialState = {
  user: null,
  isFetching: false,
  isLoggedIn: false,
  error: null
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case userTypes.LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isLoggedIn: false,
        error: null
      };

    case userTypes.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isFetching: false,
        isLoggedIn: true,
        error: null
      };

    case userTypes.LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        isFetching: false,
        isLoggedIn: false,
        user: null,
      };

    case userTypes.REGISTER_REQUEST:
      return {
        ...state,
        isFetching: true,
        isLoggedIn: false,
        error: null
      };

    case userTypes.REGISTER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isLoggedIn: true,
        user: action.payload.user,
        token: action.payload.token
      };

    case userTypes.REGISTER_FAILURE:
      return {
        ...state,
        isFetching: false,
        isLoggedIn: false,
        user: null,
        error: action.payload.error,
      };

    default:
      return state;
  }
}

export default userReducer;
