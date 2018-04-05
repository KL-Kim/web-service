/**
 * Business Reducer
 */
import businessTypes from '../constants/business.types';

const initialState = {
  businessList: null,
  totalCount: 0,
  isFetching: false,
  error: null,
};

const businessReducer = (state = initialState, action) => {
  switch (action.type) {
    // Get business list
    case businessTypes.GET_BUSINESS_LIST_REQUEST:
    case businessTypes.ADD_BUSINESS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case businessTypes.GET_BUSINESS_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        businessList: action.payload.list,
        totalCount: action.payload.totalCount,
      };

    case businessTypes.GET_BUSINESS_LIST_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    case businessTypes.ADD_BUSINESS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: null,
      };

    case businessTypes.ADD_BUSINESS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };
      
    default:
      return state;
  }
}

export default businessReducer;
