import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

import Header from '../Header';
import SettingFooter from './SettingFooter';
import Sidebar from './Sidebar';
import Alert from '../containers/Alert';
import DevTools from '../DevTools';

import { logout } from '../../actions/user.actions';

const styles = (theme) => ({
  root: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  content: {
    width: '100%',
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    minHeight: `calc(100vh - 112px)`,
    marginTop: 64,
    marginLeft: 260,
    marginBottom: 48
  },
});

class SettingContainer extends Component {
  componentWillReceiveProps(nextProps, nextState) {
    if (!nextProps.isLoggedIn) {
      this.props.history.push('/');
    }
  }

  render() {
    const { classes, isLoggedIn, user, logout, updatedAt } = this.props;

    return (
      <div className={classes.root}>
        <Header user={user} isLoggedIn={isLoggedIn} logout={logout} position={"fixed"} updatedAt={updatedAt} />
        <Sidebar user={user} />
        <div className={classes.appFrame}>
          <main className={classes.content}>
            {this.props.children}
            <SettingFooter />
          </main>
        </div>
        <Alert />
        <DevTools />
      </div>
    );
  }
}

SettingContainer.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  user: PropTypes.object,
  updatedAt: PropTypes.number,
  isLoggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "updatedAt": state.userReducer.updatedAt,
    "isLoggedIn": state.userReducer.isLoggedIn,
  };
};

export default connect(mapStateToProps, { logout })(withStyles(styles)(SettingContainer));
