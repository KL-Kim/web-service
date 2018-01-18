import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

import Header from './Header';
import Footer from './Footer';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 30
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }
});

class Root extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className="App-container">
          <Header />
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>Home Page goes here.</Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper}>Home Page goes here.</Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper}>Home Page goes here.</Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper className={classes.paper}>Home Page goes here.</Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper className={classes.paper}>Home Page goes here.</Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper className={classes.paper}>Home Page goes here.</Paper>
            </Grid>
          </Grid>
          <Footer />
        </div>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Root));
