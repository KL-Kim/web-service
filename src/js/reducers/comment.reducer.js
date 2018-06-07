/**
 * Comment Reducer
 */
import commentTypes from '../constants/comment.types';

const initialState = {
  comments: [],
  totalCount: 0,
  isFetching: false,
  error: null,
};

const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    // Clear comment reducer
    case commentTypes.CLEAR_COMMENTS_LIST:
      return initialState;


    case commentTypes.GET_COMMENTS_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: null,
      };

    case commentTypes.GET_COMMENTS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    case commentTypes.GET_COMMENTS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        comments: action.payload.list,
        totalCount: action.payload.totalCount,
      };

    default:
      return state;
  }
};

export default commentReducer;
