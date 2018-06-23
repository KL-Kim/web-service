import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import Header from './Header';
import Footer from './Footer';
import Alert from '../utils/Alert';
import DevTools from './DevTools';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    maxWidth: 960,
    height: '100%',
    margin: 'auto',
    marginTop: theme.spacing.unit * 12,
    paddingBottom: theme.spacing.unit * 10,
  },
});

class Container extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Header position={"fixed"} />
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
};

export default withStyles(styles)(Container);
