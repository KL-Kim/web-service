import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from '../reducers';

const loggerMiddleware = createLogger();

const configureStore = () => {
  const store = createStore(reducer, applyMiddleware(thunkMiddleware, loggerMiddleware));

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(reducer);
    });
  }

  return store;
}

export default configureStore;
