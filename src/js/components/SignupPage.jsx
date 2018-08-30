import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import isEmail from 'validator/lib/isEmail';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';

// Material UI Icons
import Error from '@material-ui/icons/Error';

// Custom Components
import Container from './layout/Container';
import SmallContainer from './layout/SmallContainer';

// Actions
import { register } from 'js/actions/user.actions';

import config from 'js/config/config';

const styles = theme => ({
  "button": {
    "marginTop": theme.spacing.unit * 2,
  },
});

const passwordMinLength = config.PASSWORD_MIN_LENGTH;

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
        <SmallContainer>
          <Typography variant="display1" align="center" gutterBottom>Sign Up</Typography>

          <form noValidate onSubmit={this.handleRegister}>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                  type="email"
                  id="email"
                  name="email"
                  autoFocus
                  error={this.state.emailError}
                  onBlur={this.isValidEmail}
                  onChange={this.handleChange}
                  endAdornment={
                    this.state.emailError
                      ? <InputAdornment position="end">
                          <Error color="secondary"/>
                        </InputAdornment>
                      : null
                  }
              />
              <FormHelperText id="email-helper-text" error>
              {
                this.state.emailError ? this.state.emailErrorMessage : ' '
              }
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                  type="password"
                  id="password"
                  name="password"
                  error={this.state.passwordError}
                  onBlur={this.isValidPassword}
                  onChange={this.handleChange}
                  endAdornment={
                    this.state.passwordError
                      ? <InputAdornment position="end">
                          <Error color="secondary" />
                        </InputAdornment>
                      : null
                  }
              />
              <FormHelperText id="password-helper-text" error>
                  {
                    this.state.passwordError ? this.state.passwordErrorMessage : ' '
                  }
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="password">Confirm Password</InputLabel>
              <Input
                  type="password"
                  id="password-confirmation"
                  name="passwordConfirmation"
                  error={this.state.passwordConfirmationError}
                  onBlur={this.isValidPasswordConfirmation}
                  onChange={this.handleChange}
                  endAdornment={
                    this.state.passwordConfirmationError
                      ? <InputAdornment position="end">
                          <Error color="secondary" />
                        </InputAdornment>
                      : null
                  }
              />
              <FormHelperText id="password-helper-text" error>
                  {
                    this.state.passwordConfirmationError ? this.state.passwordConfirmationErrorMessage : ' '
                  }
              </FormHelperText>
            </FormControl>

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
          
          <Typography variant="caption" align="center">
            If you sign up, means you agree to follow the  <Link to="/terms-policy">TERMS and POLICY</Link>.
          </Typography>
        </SmallContainer>
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

export default connect(mapStateToProps, { register })(withStyles(styles)(UserSignup));
