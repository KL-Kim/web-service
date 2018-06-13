import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

// Redux Store
import configureStore from './stores/store';

// Private Route Components
import PrivateRoute from './helpers/PrivateRoute';
import AdminRoute from './helpers/AdminRoute';

// React Compontens
import NoMatchPage from './components/404';
import HomePage from './components/HomePage';
import SignupPage from './components/SignupPage';
import SigninPage from './components/SigninPage';
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

// Admin Setting
import Admin_UsersList from './components/admin/UsersList';
import Admin_SingleUserPage from './components/admin/SingleUserInfoPage'
import Admin_BusinessList from './components/admin/BusinessList';
import Admin_SingleBusinessPage from './components/admin/SingleBusinessPage'
import Admin_CategoriesList from './components/admin/CategoriesList';
import Admin_TagsList from './components/admin/TagsList';
import Admin_ReviewsList from './components/admin/ReviewsList';
import Admin_BlogList from './components/admin/BlogList';
import Admin_CommentsList from './components/admin/CommentsList';

// Temp
import SingleStoryPage from './components/SingleStoryPage';

import { getMyself } from './actions/user.actions';
import { loadFromStorage } from './helpers/webStorage';
import webStorageTypes from './constants/webStorage.types';

const App = () => {
  const store = configureStore();

  const uid = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);
  if (uid) {
    store.dispatch(getMyself(uid));
  }

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/search" component={SearchPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/signin" component={SigninPage} />
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
          <Route path="/setting/review" component={SettingReview} />
          <Route path="/setting/favor" component={SettingFavor} />
          <Route path="/setting/notification" component={SettingNotification} />
          <Route exact path="/setting/post" component={SettingPost} />
          <Route path="/setting/post/s/:id" component={SettingSinglePost} />
          <Route path="/setting/comment" component={SettingComment} />

          {/*  Admin Routes */}
          <AdminRoute exact path="/admin/users" component={Admin_UsersList} />
          <AdminRoute path="/admin/user/:username" component={Admin_SingleUserPage} />

          <AdminRoute exact path="/admin/business" component={Admin_BusinessList} />
          <AdminRoute path="/admin/business/:business" component={Admin_SingleBusinessPage} />

          <AdminRoute exact path="/admin/category" component={Admin_CategoriesList} />
          <AdminRoute exact path="/admin/tag" component={Admin_TagsList} />

          <AdminRoute path="/admin/reviews" component={Admin_ReviewsList} />
          <AdminRoute exact path="/admin/blog" component={Admin_BlogList} />
          <AdminRoute exact path="/admin/comments" component={Admin_CommentsList} />

          { /** Temp **/}
          <Route path="/story" component={SingleStoryPage} />

          {/*  Error Routes */}
          <Route component={NoMatchPage} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
