import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducers from '../reducers';

// Dev
import DevTools from '../components/DevTools';

const persistConfig = {
  key: 'root',
  storage,
};

let enhancer;
const persistedReducer = persistReducer(persistConfig, reducers);

if (process.env.NODE_ENV === 'development') {
  const loggerMiddleware = createLogger();
  enhancer = compose(applyMiddleware(thunkMiddleware, loggerMiddleware), DevTools.instrument());
} else {
  enhancer = compose(applyMiddleware(thunkMiddleware));
}

const store = createStore(persistedReducer, {}, enhancer);

export default store;

export const persistor = persistStore(store);
