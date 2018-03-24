import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

// Redux Store
import configureStore from './stores/user.store';
import PrivateRoute from './helpers/PrivateRoute';

// React Compontens
import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage';
import SigninPage from './components/SigninPage';
import BusinessListPage from './components/BusinessListPage';
import AboutPage from './components/AboutPage';
import TermsPolicyPage from './components/TermsPolicyPage';
import LicensePage from './components/LicensePage';
import NoMatchPage from './components/404';
import ForgetPasswordPage from './components/containers/ForgetPasswordPage';
import AccountVerificationPage from './components/containers/AccountVerificationPage';
import ChangePasswordPage from './components/containers/ChangePasswordPage';

// Setting
import SettingAccount from './components/setting/AccountPage';
import SettingReview from './components/setting/ReviewPage';
import SettingFavor from './components/setting/FavorPage';
import SettingStory from './components/setting/StoryPage';
import SettingNotification from './components/setting/NotificationPage';

// Admin Setting
import AdminUsersList from './components/setting/admin/UsersList';
import AdminBusinessList from './components/setting/admin/BusinessList';
import AdminReviewsList from './components/setting/admin/ReviewsList';
import AdminStoriesList from './components/setting/admin/StoriesList';

// Temp
import BusinessPage from './components/BusinessPage';
import SingleStoryPage from './components/SingleStoryPage';

import { getUserById } from './actions/user.actions';
import { loadFromStorage } from './helpers/webStorage';
import webStorageTypes from './constants/webStorage.types';

const App = () => {
  const store = configureStore();

  const uid = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);
  if (uid) {
    store.dispatch(getUserById(uid));
  }

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/signin" component={SigninPage} />
          <Route path="/business/:id" component={BusinessPage} />
          <Route path="/business" component={BusinessListPage} />
          <Route path="/story" component={SingleStoryPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/terms-policy" component={TermsPolicyPage} />
          <Route path="/license" component={LicensePage} />
          <Route path="/verify/:token" component={AccountVerificationPage} />
          <Route path="/forget-password" component={ForgetPasswordPage} />
          <Route path="/change-password/:token" component={ChangePasswordPage} />

          {/*  Setting Routes */}
          <PrivateRoute path="/setting/account" component={SettingAccount} />
          <Route path="/setting/review" component={SettingReview} />
          <Route path="/setting/favor" component={SettingFavor} />
          <Route path="/setting/story" component={SettingStory} />
          <Route path="/setting/notification" component={SettingNotification} />

          {/*  Admin Routes */}
          <Route path="/admin/setting/users" component={AdminUsersList} />
          <Route path="/admin/setting/business" component={AdminBusinessList} />
          <Route path="/admin/setting/reviews" component={AdminReviewsList} />
          <Route path="/admin/setting/stories" component={AdminStoriesList} />

          {/*  Error Routes */}
          <Route component={NoMatchPage} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
