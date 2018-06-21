import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

// Redux Store
import configureStore from './stores/store';

// Private Route Components
import PrivateRoute from './helpers/PrivateRoute';

// React Compontens
import NoMatchPage from './components/404';
import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage';
import AboutPage from './components/AboutPage';
import TermsPolicyPage from './components/TermsPolicyPage';
import LicensePage from './components/LicensePage';
import ForgetPasswordPage from './components/ForgetPasswordPage';
import AccountVerificationPage from './components/AccountVerificationPage';
import ChangePasswordPage from './components/ChangePasswordPage';
import SearchPage from './components/SearchPage';
import BusinessListPage from './components/BusinessListPage';
import SingleBusinessPage from './components/SingleBusinessPage';
import BlogListPage from './components/BlogListPage';
import SinglePostPage from './components/SinglePostPage';

// Setting
import SettingAccount from './components/setting/AccountPage';
import SettingReview from './components/setting/ReviewPage';
import SettingFavor from './components/setting/FavorPage';
import SettingNotification from './components/setting/NotificationPage';
import SettingPost from './components/setting/PostPage';
import SettingSinglePost from './components/setting/SinglePostPage';
import SettingComment from './components/setting/CommentPage';

// WebStorage
import { loadFromStorage } from './helpers/webStorage';
import webStorageTypes from './constants/webStorage.types';

// Actions
import { getMyself } from './actions/user.actions';
import { getCategoriesList } from './actions/category.actions.js';

const App = () => {
  const store = configureStore();

  const uid = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);
  if (uid) {
    store.dispatch(getMyself(uid));
  }

  store.dispatch(getCategoriesList());

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/search" component={SearchPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/terms-policy" component={TermsPolicyPage} />
          <Route path="/license" component={LicensePage} />
          <Route path="/verify/:token" component={AccountVerificationPage} />
          <Route path="/forget-password" component={ForgetPasswordPage} />
          <Route path="/change-password/:token" component={ChangePasswordPage} />
          <Route path="/business/category/:slug" component={BusinessListPage} />
          <Route path="/business/s/:slug" component={SingleBusinessPage} />
          <Route exact path="/blog" component={BlogListPage} />
          <Route path="/post/s/:id" component={SinglePostPage} />

          {/*  Setting Routes */}
          <PrivateRoute path="/setting/account" component={SettingAccount} />
          <PrivateRoute path="/setting/review" component={SettingReview} />
          <PrivateRoute path="/setting/favor" component={SettingFavor} />
          <PrivateRoute path="/setting/notification" component={SettingNotification} />
          <PrivateRoute exact path="/setting/post" component={SettingPost} />
          <PrivateRoute path="/setting/post/s/:id" component={SettingSinglePost} />
          <PrivateRoute path="/setting/comment" component={SettingComment} />

          {/*  Error Routes */}
          <Route component={NoMatchPage} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
