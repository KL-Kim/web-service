import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import _ from 'lodash';

import Header from '../Header';
import Footer from '../Footer';
import Alert from './Alert';
import DevTools from '../DevTools';

import config from '../../constants/config'
import { getUserById } from '../../actions/user.actions';
import { loadFromStorage } from '../../helpers/webStorage';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    width: 'auto',
    height: '100%',
    marginTop: theme.spacing.unit * 5,
    marginLeft: theme.spacing.unit * 16,
    marginRight: theme.spacing.unit * 16,
    paddingBottom: theme.spacing.unit * 10,
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }
});

class Container extends Component {
  componentDidMount() {
    const userId = loadFromStorage(config.webStorageUserKey);
    if (!_.isEmpty(userId) && _.isEmpty(this.props.user)) {
      this.props.getUserById(userId);
    }
  }

  render() {
    const { classes, isLoggedIn, user } = this.props;

    return (
      <div className={classes.root}>
        <Header user={user} isLoggedIn={isLoggedIn} />
        <main className={classes.appFrame}>
          {this.props.children}
        </main>
        <Footer />
        <DevTools />
        <Alert />
      </div>
    );
  }
}

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  user: PropTypes.object,
  isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
  };
};

export default connect(mapStateToProps, { getUserById })(withStyles(styles)(Container));
