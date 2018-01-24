import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import Header from '../containers/Header';
import Footer from '../containers/Footer';

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

class HomePage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Header />
        <main className={classes.appFrame}>
          {this.props.children}
        </main>
        <Footer />
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(HomePage));
