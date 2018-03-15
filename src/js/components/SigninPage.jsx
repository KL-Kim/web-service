import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import Container from './containers/Container';
import LoginForm from './containers/LoginForm';

const styles = theme => ({
  paper: {
    marginTop: theme.spacing.unit * 10,
    paddingTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 5,
    paddingLeft: theme.spacing.unit * 10,
    paddingRight: theme.spacing.unit * 10,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

class SigninPage extends Component {
  render() {
    const { classes, history } = this.props;
    return (
      <Container>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={5}>
            <Paper className={classes.paper}>
              <LoginForm history={history} />
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

SigninPage.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
};

export default withStyles(styles)(SigninPage);
