/**
 * Pca Reducer
 */
import pcaTypes from '../constants/pca.types';

const initialState = {
  cities: null,
  areas: null,
  isFetching: false,
  error: null,
};

const pcaReducer = (state = initialState, action) => {
  switch (action.type) {
    case pcaTypes.GET_CITIES_REQUEST:
      return {
        ...state,
        isFetching: true,
        "error": null,
      };

    case pcaTypes.GET_CITIES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        cities: action.payload.cities,
      };

    case pcaTypes.GET_CITIES_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload.error,
      };

    case pcaTypes.GET_AREAS_REQUEST:
      return {
        ...state,
        isFetching: true,
        "error": null,
      };

    case pcaTypes.GET_AREAS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        areas: action.payload.areas,
      };

    case pcaTypes.GET_AREAS_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: action.payload.error,
      };

    default:
      return state;
  }
}

export default pcaReducer;
