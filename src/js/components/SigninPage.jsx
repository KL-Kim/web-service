import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import Container from './Container';
import LoginForm from '../containers/LoginForm';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class UserSignup extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Container>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={6}>
              <Paper className={classes.paper}>
                <LoginForm login={this.props.login} />
              </Paper>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Link to="/forget-password">
                    <Button className={classes.button} color="primary" type="submit">Forget your password?</Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/signup">
                    <Button className={classes.button} color="primary" type="submit">Sign up</Button>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
      </Container>
    );
  }
}

export default withStyles(styles)(UserSignup);
