import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';

// Custom Components
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import Alert from '../utils/Alert';
import DevTools from './DevTools';

const styles = (theme) => ({
  "root": {
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  "appFrame": {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  "main": {
    width: '100%',
    flexGrow: 1,
    minHeight: `calc(100vh - 112px)`,
    marginTop: 64,
    marginBottom: 48
  },
  "container": {
    maxWidth: 960,
    margin: 'auto',
    paddingTop: theme.spacing.unit * 5,
  }
});

class SettingContainer extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.isLoggedIn !== this.props.isLoggedIn && !this.props.isLoggedIn) {
      this.props.history.push('/404');
    }
  }

  render() {
    const { classes, user } = this.props;

    return (
      <div className={classes.root}>
        <Header position={"fixed"} />
        <div className={classes.appFrame}>
          <main className={classes.main}>
            <div className={classes.container}>
              {this.props.children}
            </div>
          </main>
        </div>
        <Footer />
        <Alert />
        <DevTools />
      </div>
    );
  }
}

SettingContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  user: PropTypes.object.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
  };
};

export default withRouter(connect(mapStateToProps, {})(withStyles(styles)(SettingContainer)));
