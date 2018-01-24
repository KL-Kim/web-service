import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import Container from './Container';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 5,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  button: {
    margin: theme.spacing.unit * 4,
  },
  input: {
    width: 270,
    margin: theme.spacing.unit * 2
  }
});

class UserSignup extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Grid container className={classes.root} spacing={16} justify="center" alignItems="center">
          <Grid item sm={6}>
            <Paper className={classes.paper}>
              <Typography type="display1" align="center">
                Sign up
              </Typography>
              <form noValidate autoComplete="off">
                <TextField
                  label="Email"
                  id="email"
                  className={classes.input}
                />
                <br />
                <TextField
                  label="Username"
                  id="username"
                  className={classes.input}
                />
                <br />
                <TextField
                  type="password"
                  label="Password"
                  className={classes.input}
                  id="password"
                />
                <br />
                <TextField
                  type="password"
                  label="Password Confirmation"
                  className={classes.input}
                  id="passwordConfirmation" />
                <br />
                <Button raised
                  color="primary"
                  onClick={this.props.login}
                  className={classes.button}
                  >Sign up</Button>
              </form>
              <Grid container align="center">
                <Grid item xs align="center">
                  <Typography type="body1" align="center">
                    If you sign up, you agree to follow the TERMS and POLICY.
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles)(UserSignup);
