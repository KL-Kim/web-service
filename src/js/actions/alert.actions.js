import uuidv4 from 'uuid/v4';
import alertTypes from '../constants/alert.types';

/**
 *  Alert success
 */
export const alertSuccess = response => ({
  type: alertTypes.ALERT_SUCCESS,
  meta: {},
  error: null,
  payload: {
    id: uuidv4(),
    message: response
  }
});

/**
 *  Alert failure
 */
export const alertFailure = response => ({
  type: alertTypes.ALERT_FAILURE,
  meta: {},
  error: true,
  payload: {
    id: uuidv4(),
    message: response
  }
});

export const alertClear = () => ({
  type: alertTypes.ALERT_CLEAR,
  meta: {},
  error: false,
  payload: {}
})
