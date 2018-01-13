import { combineReducers } from 'redux';
import userReducer from './user.reducer';

const reducer = combineReducers({
  userReducer,
});

export default reducer;
