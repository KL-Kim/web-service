import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Reboot from 'material-ui/Reboot';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

import Header from '../containers/Header';
import Footer from '../containers/Footer';
import LoginForm from '../containers/LoginForm';

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

class UserSignup extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Reboot />
        <div className="App-container">
          <Header />
          <Grid container spacing={16} className={classes.root} justify="center" alignItems="center">
            <Grid item sm={4}>
              <Paper className={classes.paper}>
                <LoginForm login={this.props.login}/>
              </Paper>
            </Grid>
          </Grid>
          <Footer />
        </div>
      </div>

    );
  }
}

export default withStyles(styles)(UserSignup);
