/**
 * Auth Reducer
 */
import authTypes from '../constants/auth.types';

const initialState = {
  message: '',
  isFetching: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case authTypes.SEND_PHONE_VERIFICATION_CODE_REQUEST:
    case authTypes.SEND_EMAIL_REQUEST:
      return {
        ...state,
        "isFetching": true,
        "error": null,
      }
    case authTypes.SEND_PHONE_VERIFICATION_CODE_SUCCESS:
    case authTypes.SEND_EMAIL_SUCCESS:
      return {
        ...state,
        "isFetching": false,
      };

    case authTypes.SEND_PHONE_VERIFICATION_CODE_FAILURE:
    case authTypes.SEND_EMAIL_FAILURE:
      return {
        ...state,
        "isFetching": false,
        error: action.error,
      };

    default:
      return state;
  }
}

export default authReducer;
