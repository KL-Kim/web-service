import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './stores/user.store';

import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage';
import SigninPage from './components/SigninPage';

// Dashboard
import DashboardAccount from './components/dashboard/AccountPage';
import DashboardPhoto from './components/dashboard/PhotoPage';
import DashboardReview from './components/dashboard/ReviewPage';
import DashboardFavor from './components/dashboard/FavorPage';
import DashboardStory from './components/dashboard/StoryPage';
import DashboardChangePassword from './components/dashboard/ChangePasswordPage';

// Temp
import BusinessPage from './components/BusinessPage';
import StoryPage from './components/StoryPage';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path="/" component={HomePage} />
        <Route path="/dashboard/account" component={DashboardAccount} />
        <Route path="/dashboard/photo" component={DashboardPhoto} />
        <Route path="/dashboard/review" component={DashboardReview} />
        <Route path="/dashboard/favor" component={DashboardFavor} />
        <Route path="/dashboard/password" component={DashboardChangePassword} />
        <Route path="/dashboard/story" component={DashboardStory} />
        <Route path="/signup" component={SignupPage} />
        <Route path="/signin" component={SigninPage} />
        <Route path="/business" component={BusinessPage} />
        <Route path="/story" component={StoryPage} />
      </div>
    </Router>
  </Provider>
);

export default App;
