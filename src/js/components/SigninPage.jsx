import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';

import Container from './utils/Container';
import LoginForm from './utils/LoginForm';
import { login } from '../actions/user.actions';

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
  componentWillMount() {
    if (this.props.isLoggedIn) {
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.isLoggedIn) {
      this.props.history.push('/');
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Container>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={5}>
            <Paper className={classes.paper}>
              <LoginForm isFetching={this.props.isFetching} loginError={this.props.loginError} errorMessage={this.props.errorMessage} login={this.props.login} />
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
  isLoggedIn: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool,
  loginError: PropTypes.bool,
  errorMessage: PropTypes.string,
  login: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    isFetching: state.userReducer.isFetching,
    isLoggedIn: state.userReducer.isLoggedIn,
    loginError: state.alertReducer.error,
    errorMessage: state.alertReducer.message,
  };
};

export default connect(mapStateToProps, { login })(withStyles(styles)(SigninPage));
