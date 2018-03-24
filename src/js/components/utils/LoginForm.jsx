import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import validator from 'validator';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';

import config from '../../config/config';
import { loadFromStorage, saveToStorage } from '../../helpers/webStorage';
import webStorageTypes from '../../constants/webStorage.types';

const styles = (theme) => ({
  button: {
    marginTop: theme.spacing.unit * 4,
  },
});

const passwordMinLength = config.passwordMinLength;

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "email": {
        "value": '',
        "showError": false,
        "errorMessage": '',
      },
      "password": {
        "value": '',
        "showError": false,
        "errorMessage": '',
      },
      "waitUntil": null,
      "goodToGo": true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValidEmail = this.isValidEmail.bind(this);
    this.isValidPassword = this.isValidPassword.bind(this);
    this.handleTimeout = this.handleTimeout.bind(this);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.loginError) {
      this.setState({
        password: {
          value: this.state.password.value,
          showError: true,
          errorMessage: nextProps.errorMessage
        }
      });
    }
  }

  handleChange(e) {
    const { name, value } = e.target;

    if (_.isEqual('email', name)) {
      this.setState({
        email: {
          value: value,
          showError: false,
          errorMessage: ''
        }
      });
    }

    if (_.isEqual('password', name)) {
      this.setState({
        password: {
          value: value,
          showError: false,
          errorMessage: ''
        }
      });
    }
  }

  isValidEmail() {
    if (!this.state.email.value || !validator.isEmail(this.state.email.value)) {
      this.setState({
        email: {
          value: this.state.email.value,
          showError: true,
          errorMessage: 'Error: Input a valid Email'
        },
      });
      return false;
    } else {
      this.setState({
        email: {
          value: this.state.email.value,
          showError: false,
          errorMessage: ''
        },
      });
      return true;
    }
  }

  isValidPassword() {
    if (this.state.password.value.length < passwordMinLength) {
      this.setState({
        password: {
          value: this.state.password.value,
          showError: true,
          errorMessage: 'Should not be shorter than ' + passwordMinLength,
        },
      });
      return false;
    } else {
      this.setState({
        password: {
          value: this.state.password.value,
          showError: false,
          errorMessage: ''
        },
      });
      return true;
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const { email, password } = this.state;

    let loginFailedCount = loadFromStorage(webStorageTypes.WEB_STORAGE_LOGIN_FAILED);

    if (loginFailedCount >= 5) {
      let time = 30;
      var nInverId = setInterval(() => {
        time = time - 1;

        this.setState({
          "waitUntil": time,
        });
        console.log("You can try after " + time);

        if (time < 1) {
          clearInterval(nInverId);
          saveToStorage(webStorageTypes.WEB_STORAGE_LOGIN_FAILED, 0);
          this.setState({
            "goodToGo": true
          });
        }
      }, 1000);

      this.setState({
         "goodToGo": false
      });
    }

    if (this.isValidEmail() && this.isValidPassword() && (loginFailedCount <= 5)) {
      this.props.login(email.value, password.value);
    }
  }

  handleTimeout() {

    this.setState({
      captcha: false,
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <form onSubmit={this.handleSubmit}>
        <Typography type="display1" align="center">Sign In</Typography>
        <TextField
          name="email"
          error={this.state.email.showError}
          helperText={this.state.email.showError ? this.state.email.errorMessage : ' '}
          onChange={this.handleChange}
          onBlur={this.isValidEmail}
          fullWidth
          margin="normal"
          label="Email"
          id="email" />
        <br />
        <TextField
          name="password"
          error={this.state.password.showError}
          helperText={this.state.password.showError ? this.state.password.errorMessage : ' '}
          onChange={this.handleChange}
          onBlur={this.isValidPassword}
          fullWidth
          margin="normal"
          type="password"
          label="Password"
          id="password" />
        <br />
        <Button
          name="signin"
          disabled={this.state.email.showError || this.state.password.showError || this.props.isFetching || !this.state.goodToGo}
          className={classes.button}
          raised
          color="primary"
          type="submit"
          fullWidth
        >
          {this.props.isFetching ? (<CircularProgress size={20} />) : this.state.waitUntil ? "Wait " + this.state.waitUntil : ('Sign in')}
        </Button>
      </form>
    );
  }
}

LoginForm.propTypes = {
  isFetching: PropTypes.bool,
  loginError: PropTypes.bool,
  errorMessage: PropTypes.string,
  login: PropTypes.func.isRequired,
};

export { LoginForm };
export default withStyles(styles)(LoginForm);
