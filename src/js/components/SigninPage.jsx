import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

import Container from './Container';
import LoginForm from '../containers/LoginForm';

const styles = theme => ({

  paper: {
    padding: theme.spacing.unit * 5,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class UserSignup extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Grid container spacing={16} justify="center" alignItems="center">
          <Grid item sm={6}>
            <Paper className={classes.paper}>
              <LoginForm login={this.props.login}/>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles)(UserSignup);
