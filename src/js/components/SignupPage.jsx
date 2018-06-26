import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import isEmail from 'validator/lib/isEmail';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';

// Material UI Icons
import Error from '@material-ui/icons/Error';

// Custom Components
import config from '../config/config';
import Container from './layout/Container';

// Actions
import { register } from '../actions/user.actions';
import { closeLoginDialog } from '../actions/app.actions';

const styles = theme => ({
  "root": {
    "marginTop": theme.spacing.unit * 20,
  },
  "paper": {
    "paddingTop": theme.spacing.unit * 5,
    "paddingBottom": theme.spacing.unit * 5,
    "paddingLeft": theme.spacing.unit * 10,
    "paddingRight": theme.spacing.unit * 10,
    "marginBottom": theme.spacing.unit,
    "textAlign": 'center',
    "color": theme.palette.text.secondary,
  },
  "button": {
    "marginTop": theme.spacing.unit * 4,
  },
});

const passwordMinLength = config.passwordMinLength;

class UserSignup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "email": '',
      "emailError": false,
      "emailErrorMessage": '',
      "password": '',
      "passwordError": false,
      "passwordErrorMessage": '',
      "passwordConfirmation": '',
      "passwordConfirmationError": false,
      "passwordConfirmationErrorMessage": '',
    };

    this.isValidEmail = this.isValidEmail.bind(this);
    this.isValidPassword = this.isValidPassword.bind(this);
    this.isValidPasswordConfirmation = this.isValidPasswordConfirmation.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.props.history.push('/');
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isLoggedIn) {
      this.props.history.push('/');
    }
  }

  handleChange(e) {
    const { name, value } = e.target;

    if (name === 'email') {
      this.setState({
        email: value,
        emailError: false,
      });
    }
    else if (name === 'password') {
      this.setState({
        password: value,
        emailError: false,
        passwordError: false,
        passwordConfirmation: '',
        passwordConfirmationError: false,
      });
    }
    else if (name === "passwordConfirmation") {
      this.setState({
        passwordConfirmation: value,
        emailError: false,
        passwordConfirmationError: false,
      });
    }
  }

  isValidEmail() {
    if(!isEmail(this.state.email)) {
      this.setState({
        emailError: true,
        emailErrorMessage: 'Error: Input a valid Email',
      });

      return false;
    } else {
      this.setState({
        emailError: false,
      });

      return true;
    }
  }

  isValidPassword() {
    if (this.state.password.length < passwordMinLength) {
      this.setState({
        passwordError: true,
        passwordErrorMessage: 'Password should not be shorter than ' + passwordMinLength,
      });

      return false;
    } else {
      this.setState({
        passwordError: false,
      });

      return true;
    }
  }

  isValidPasswordConfirmation() {
    if (this.state.password !== this.state.passwordConfirmation) {
      this.setState({
        passwordConfirmationError: true,
        passwordConfirmationErrorMessage: 'Passwords do not match',
      });

      return false;
    } else {
      this.setState({
        passwordConfirmationError: false,
      });

      return true;
    }
  }

  handleRegister(e) {
    e.preventDefault();

    if (this.isValidEmail() && this.isValidPassword() && this.isValidPasswordConfirmation()) {
      this.props.register({
        "email": this.state.email,
        "password": this.state.password,
        "passwordConfirmation": this.state.passwordConfirmation,
      })
      .then(response => {
        if (_.isEmpty(response) && this.props.error) {
          this.setState({
            emailError: true,
            emailErrorMessage: this.props.errorMessage,
          });
        }
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Container>
        <Grid container justify="center" alignItems="center" className={classes.root}>
          <Grid item xs={8}>
            <Paper className={classes.paper}>
              <Typography variant="display1" align="center">Sign up</Typography>

              <form noValidate onSubmit={this.handleRegister}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email"
                  type="text"
                  name="email"
                  error={this.state.emailError}
                  helperText={this.state.emailError ? this.state.emailErrorMessage : ' '}
                  onBlur={this.isValidEmail}
                  onChange={this.handleChange}
                />
                <br />

                <TextField
                  fullWidth
                  type="password"
                  margin="normal"
                  label="Password"
                  name="password"
                  error={this.state.passwordError}
                  helperText={this.state.passwordError ? this.state.passwordErrorMessage : ' '}
                  onBlur={this.isValidPassword}
                  onChange={this.handleChange}
                />
                <br />

                <TextField
                  fullWidth
                  type="password"
                  margin="normal"
                  label="Confirm your password"
                  name="passwordConfirmation"
                  error={this.state.passwordConfirmationError}
                  helperText={this.state.passwordConfirmationError ? this.state.passwordConfirmationErrorMessage : ' '}
                  onBlur={this.isValidPasswordConfirmation}
                  onChange={this.handleChange}
                />
                <br />

                <Button
                  fullWidth
                  type="submit"
                  variant="raised"
                  color="primary"
                  className={classes.button}
                  disabled={this.state.emailError
                            || this.state.passwordError
                            || this.state.passwordConfirmationError
                            || this.props.isFetching
                  }
                >
                  {
                    this.props.isFetching ? (<CircularProgress size={20} />) : 'Sign up'
                  }
                </Button>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Link to="/terms-policy">
              <Typography variant="body2" align="center">
                If you sign up, it means you agree to follow the TERMS and POLICY.
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

UserSignup.propTypes = {
  "classes": PropTypes.object.isRequired,
  "history": PropTypes.object.isRequired,
  "isFetching": PropTypes.bool,
  "isLoggedIn": PropTypes.bool.isRequired,
  "errorMessage": PropTypes.string,
  "register": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "isFetching": state.userReducer.isFetching,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "error": state.userReducer.error,
    "errorMessage": state.alertReducer.message,
  };
};

export default connect(mapStateToProps, { register, closeLoginDialog })(withStyles(styles)(UserSignup));
