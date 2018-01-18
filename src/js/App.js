import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

// import history from './helpers/history';
import Root from './containers/Root';
import UserProfile from './components/UserProfile';
import UserSignup from './components/UserSignup';
import UserSignin from './components/UserSignin'
import configureStore from './stores/user.store';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path="/" component={Root} />
        <Route exact path="/user" component={UserProfile} />
        <Route exact path="/signup" component={UserSignup} />
        <Route exact path="/signin" component={UserSignin} />
      </div>
    </Router>
  </Provider>
);

export default App;
