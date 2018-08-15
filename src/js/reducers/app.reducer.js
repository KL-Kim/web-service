/**
 * App reducer
 */

import appTypes from '../constants/app.types';

const initialState = {
  isLoginDialogOpen: false,
};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case appTypes.LOGIN_DIALOG_OPEN:
      return {
        ...state,
        "isLoginDialogOpen": true,
      };

    case appTypes.LOGIN_DIALOG_CLOSE:
      return {...initialState};

    default:
      return state;
  }
}

export default alertReducer;