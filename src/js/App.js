import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

// Redux Store
import configureStore from './stores/store';

// Private Route Components
import PrivateRoute from './helpers/PrivateRoute';

// React Compontens
import NoMatchPage from 'js/components/404';
import HomePage from 'js/components/HomePage';
import ExplorePage from 'js/components/ExplorePage';
import SignupPage from 'js/components/SignupPage';
import AboutPage from 'js/components/AboutPage';
import TermsPolicyPage from 'js/components/TermsPolicyPage';
import LicensePage from 'js/components/LicensePage';
import ForgetPasswordPage from 'js/components/ForgetPasswordPage';
import AccountVerificationPage from 'js/components/AccountVerificationPage';
import ChangePasswordPage from 'js/components/ChangePasswordPage';
import SearchPage from 'js/components/SearchPage';
import BusinessListByCategoryPage from 'js/components/BusinessListByCategoryPage';
import BusinessListByTagPage from 'js/components/BusinessListByTagPage';
import SingleBusinessPage from 'js/components/SingleBusinessPage';
import BlogListPage from 'js/components/BlogListPage';
import SinglePostPage from 'js/components/SinglePostPage';
import ProfilePage from 'js/components/ProfilePage';

// Setting
import SettingAccount from 'js/components/setting/AccountPage';
import SettingReview from 'js/components/setting/ReviewPage';
import SettingFavor from 'js/components/setting/FavorPage';
import SettingNotification from 'js/components/setting/NotificationPage';
import SettingPost from 'js/components/setting/PostPage';
import SettingSinglePost from 'js/components/setting/SinglePostPage';
import SettingComment from 'js/components/setting/CommentPage';

// WebStorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

// Actions
import { getMyself } from 'js/actions/user.actions';
import { getCategoriesList } from 'js/actions/category.actions.js';
import { getTagsList } from 'js/actions/tag.actions.js';

const App = () => {
  const store = configureStore();

  const uid = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);
  if (uid) {
    store.dispatch(getMyself(uid));
  }

  store.dispatch(getCategoriesList());
  store.dispatch(getTagsList());

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
          <Route path="/business/category/:slug" component={BusinessListByCategoryPage} />
          <Route path="/business/tag/:slug" component={BusinessListByTagPage} />
          <Route path="/business/s/:slug" component={SingleBusinessPage} />
          <Route exact path="/blog" component={BlogListPage} />
          <Route path="/post/s/:id" component={SinglePostPage} />
          <Route path="/explore" component={ExplorePage} />
          <Route path="/profile/:username" component={ProfilePage} />

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
