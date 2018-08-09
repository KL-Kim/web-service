/**
 * Pca Reducer
 */
import pcaTypes from '../constants/pca.types';

const initialState = {
  provinces: [],
  cities: [],
  areas: [],
  isFetching: false,
  error: null,
};

const pcaReducer = (state = initialState, action) => {
  switch (action.type) {
    case pcaTypes.GET_PROVINCES_REQUEST:
    case pcaTypes.GET_CITIES_REQUEST:
    case pcaTypes.GET_AREAS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case pcaTypes.GET_PROVINCES_FAILURE:
    case pcaTypes.GET_CITIES_FAILURE:
    case pcaTypes.GET_AREAS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    case pcaTypes.GET_PROVINCES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        provinces: [...action.payload.provinces],
      };

    case pcaTypes.GET_CITIES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        cities: [...action.payload.cities],
      };

    case pcaTypes.GET_AREAS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        areas: [...action.payload.areas],
      };

    default:
      return state;
  }
}

export default pcaReducer;
