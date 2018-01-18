import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import alertReducer from './alert.reducer';

const reducer = combineReducers({
  userReducer,
  alertReducer
});

export default reducer;
