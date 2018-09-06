import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Loadable from 'react-loadable';

// Redux Store
import configureStore from './stores/store';

// Utility Components
import PrivateRoute from './helpers/PrivateRoute';
import LoadingComponent from 'js/components/utils/LoadingComponent.jsx';

// WebStorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

// Actions
import { getMyself } from 'js/actions/user.actions';
import { getCategoriesList } from 'js/actions/category.actions';
import { getTagsList } from 'js/actions/tag.actions';
import { getGeneralAreas } from 'js/actions/pca.actions';

const HomePage = Loadable({
  loader: () => import('js/components/HomePage.jsx'),
  loading: () => <LoadingComponent />,
});

const NoMatchPage = Loadable({
  loader: () => import('js/components/404.jsx'),
  loading: () => <LoadingComponent />,
});

const SearchPage = Loadable({
  loader: () => import('js/components/SearchPage.jsx'),
  loading: () => <LoadingComponent />,
});

const ExplorePage = Loadable({
  loader: () => import('js/components/ExplorePage.jsx'),
  loading: () => <LoadingComponent />,
});

const BusinessListByCategoryPage = Loadable({
  loader: () => import('js/components/BusinessListByCategoryPage.jsx'),
  loading: () => <LoadingComponent />,
});

const BusinessListByTagPage = Loadable({
  loader: () => import('js/components/BusinessListByTagPage.jsx'),
  loading: () => <LoadingComponent />,
});

const SingleBusinessPage = Loadable({
  loader: () => import('js/components/SingleBusinessPage.jsx'),
  loading: () => <LoadingComponent />,
});

const BlogListPage = Loadable({
  loader: () => import('js/components/BlogListPage.jsx'),
  loading: () => <LoadingComponent />,
});

const SinglePostPage = Loadable({
  loader: () => import('js/components/SinglePostPage.jsx'),
  loading: () => <LoadingComponent />,
});

const ProfilePage = Loadable({
  loader: () => import('js/components/ProfilePage.jsx'),
  loading: () => <LoadingComponent />,
});

const SignUpPage = Loadable({
  loader: () => import('js/components/SignUpPage.jsx'),
  loading: () => <LoadingComponent />,
});

const AboutPage = Loadable({
  loader: () => import('js/components/AboutPage.jsx'),
  loading: () => <LoadingComponent />,
});

const TermsPolicyPage = Loadable({
  loader: () => import('js/components/TermsPolicyPage.jsx'),
  loading: () => <LoadingComponent />,
});

const LicensePage = Loadable({
  loader: () => import('js/components/LicensePage.jsx'),
  loading: () => <LoadingComponent />,
});

const ForgetPasswordPage = Loadable({
  loader: () => import('js/components/ForgetPasswordPage.jsx'),
  loading: () => <LoadingComponent />,
});

const AccountVerificationPage = Loadable({
  loader: () => import('js/components/AccountVerificationPage.jsx'),
  loading: () => <LoadingComponent />,
});

const ChangePasswordPage = Loadable({
  loader: () => import('js/components/ChangePasswordPage.jsx'),
  loading: () => <LoadingComponent />,
});

/*
 * Setting Page Components
 */
const SettingAccountPage = Loadable({
  loader: () => import('js/components/setting/AccountPage.jsx'),
  loading: () => <LoadingComponent />,
});

const SettingReviewPage = Loadable({
  loader: () => import('js/components/setting/ReviewPage.jsx'),
  loading: () => <LoadingComponent />,
});

const SettingCommentPage = Loadable({
  loader: () => import('js/components/setting/CommentPage.jsx'),
  loading: () => <LoadingComponent />,
});

const SettingFavorPage = Loadable({
  loader: () => import('js/components/setting/FavorPage.jsx'),
  loading: () => <LoadingComponent />,
});

const SettingNotificationPage = Loadable({
  loader: () => import('js/components/setting/NotificationPage.jsx'),
  loading: () => <LoadingComponent />,
});


export default function App() {
  const store = configureStore();

  const uid = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);
  if (uid) {
    store.dispatch(getMyself(uid));
  }

  store.dispatch(getCategoriesList());
  store.dispatch(getTagsList());
  store.dispatch(getGeneralAreas());

  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/explore" component={ExplorePage} />
          <Route path="/search" component={SearchPage} />
          <Route path="/profile/:username" component={ProfilePage} />
          <Route path="/signup" component={SignUpPage} />
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
          
          {/*  Setting Routes */}
          <PrivateRoute path="/setting/account" component={SettingAccountPage} />
          <PrivateRoute path="/setting/review" component={SettingReviewPage} />
          <PrivateRoute path="/setting/favor" component={SettingFavorPage} />
          <PrivateRoute path="/setting/notification" component={SettingNotificationPage} />
          <PrivateRoute path="/setting/comment" component={SettingCommentPage} />

          {/*  Error Routes */}
          <Route component={NoMatchPage} />
        </Switch>
      </Router>
    </Provider>
  );
};
