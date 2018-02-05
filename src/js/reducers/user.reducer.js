/**
 * User Reducer
 */
import userTypes from '../constants/user.types.js'

const initialState = {
  user: {},
  isFetching: false,
  isLoggedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case userTypes.LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isLoggedIn: false
      };

    case userTypes.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        isFetching: false,
        isLoggedIn: true
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
