/**
 * Business Reducer
 */
import businessTypes from '../constants/business.types';

const initialState = {
  businessList: [],
  totalCount: 0,
  isFetching: false,
  error: null,
};

const businessReducer = (state = initialState, action) => {
  switch (action.type) {
    // Clear busines reduer
    case businessTypes.CLEAR_BUSINESS_LIST:
      return initialState;

    // Resquest
    case businessTypes.GET_BUSINESS_LIST_REQUEST:
    case businessTypes.GET_SINGLE_BUSINESS_REQUEST:
    case businessTypes.REPORT_BUSINESS_REQUEST:
      return {
        ...state,
        isFetching: true,
        error: null,
      };

    case businessTypes.GET_BUSINESS_LIST_FAILURE:
    case businessTypes.GET_SINGLE_BUSINESS_FAILURE:
    case businessTypes.REPORT_BUSINESS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    case businessTypes.GET_BUSINESS_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        businessList: [...action.payload.list],
        totalCount: action.payload.totalCount,
      };

    case businessTypes.GET_SINGLE_BUSINESS_SUCCESS:
    case businessTypes.REPORT_BUSINESS_SUCCESS:
      return {
        ...state,
        isFetching: false,
      };

    default:
      return state;
  }
}

export default businessReducer;
