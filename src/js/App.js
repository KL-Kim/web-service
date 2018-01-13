import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

// import history from './helpers/history';
import Root from './components/Root.jsx';
import UserProfile from './components/UserProfile.jsx';
import UserSignup from './components/UserSignup.jsx';
import configureStore from './stores/user.store';

const store = configureStore();

const App = () => (
  <Router>
    <Provider store={store}>
      <div>
        <Route exact path="/" component={Root} />
        <Route exact path="/user" component={UserProfile} />
        <Route exact path="/signup" component={UserSignup} />
      </div>
    </Provider>
  </Router>
);

export default App;
