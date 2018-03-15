import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import alertReducer from './alert.reducer';
import pcaReducer from './pca.reducer';

const reducer = combineReducers({
  userReducer,
  alertReducer,
  pcaReducer,
});

export default reducer;
