/**
 * User Reducer
 */
const initialState = {
  user: {},
  token: '',
  isFetching: false,
  isLoggedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isFetching: true,
      };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        isFetching: false,
        isLoggedIn: true
      };

    case 'LOGIN_FAILURE':
    return state;

    default:
      return state;
  }
}

export default userReducer;
