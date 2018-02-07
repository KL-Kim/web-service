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
    };

    default:
      return state;
  }
}

export default userReducer;
