import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import alertReducer from './alert.reducer';
import businessReducer from './business.reducer';
import pcaReducer from './pca.reducer';
import categoryReducer from './category.reducer';
import tagReducer from './tag.reducer';
import reviewReducer from './review.reducer';
import notificationReducer from './notification.reducer';

const reducer = combineReducers({
  userReducer,
  alertReducer,
  pcaReducer,
  businessReducer,
  categoryReducer,
  tagReducer,
  reviewReducer,
  notificationReducer,
});

export default reducer;
