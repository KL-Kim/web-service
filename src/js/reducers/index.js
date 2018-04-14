import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import alertReducer from './alert.reducer';
import pcaReducer from './pca.reducer';
import businessReducer from './business.reducer';
import categoryReducer from './category.reducer';
import tagReducer from './tag.reducer';
import reviewReducer from './review.reducer';

const reducer = combineReducers({
  userReducer,
  alertReducer,
  pcaReducer,
  businessReducer,
  categoryReducer,
  tagReducer,
  reviewReducer,
});

export default reducer;
