/**
 * App Actions
 */
import appTypes from 'js/constants/app.types';

export const openLoginDialog = response => ({
  "type": appTypes.LOGIN_DIALOG_OPEN,
});

export const closeLoginDialog = response => ({
  "type": appTypes.LOGIN_DIALOG_CLOSE,
});