import React, { Component } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import { login } from '../../actions/user.actions';

const styles = (theme) => ({
  button: {
    marginTop: theme.spacing.unit * 4,
  },
});

const passwordMinLength = 8;

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: {
        value: '',
        showError: false,
        errorMessage: '',
      },
      password: {
        value: '',
        showError: false,
        errorMessage: '',
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValideEmail = this.isValideEmail.bind(this);
    this.isValidePassword = this.isValidePassword.bind(this);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.isLoggedIn) {
      this.props.history.push('/');
    }

    if (nextProps.loginError) {
      this.setState({
        password: {
          value: this.state.password.value,
          showError: true,
          errorMessage: nextProps.loginError.message
        }
      });
    }
  }

  handleChange(e) {
    const { name, value } = e.target;

    if (validator.equals('email', name)) {
      this.setState({
        email: {
          value: value,
          showError: false,
          errorMessage: ''
        }
      });
    }

    if (validator.equals('password', name)) {
      this.setState({
        password: {
          value: value,
          showError: false,
          errorMessage: ''
        }
      });
    }
  }

  isValideEmail() {
    if(!this.state.email.value || !validator.isEmail(this.state.email.value)) {
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

  isValidePassword() {
    if (this.state.password.value.length < passwordMinLength) {
      this.setState({
        password: {
          value: this.state.password.value,
          showError: true,
          errorMessage: 'Password should not be shorter than ' + passwordMinLength
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

    if (this.isValideEmail() && this.isValidePassword()) {
      this.props.login(email.value, password.value);
    }
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
          onBlur={this.isValideEmail}
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
          onBlur={this.isValidePassword}
          fullWidth
          margin="normal"
          type="password"
          label="Password"
          id="password" />
        <br />
        <Button
          name="signin"
          disabled={this.state.email.showError || this.state.password.showError}
          className={classes.button}
          raised
          color="primary"
          type="submit"
          fullWidth
        >
          Sign in
        </Button>
      </form>
    );
  }
}

LoginForm.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  error: PropTypes.object,
  login: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.userReducer.isLoggedIn,
    loginError: state.userReducer.error,
  };
};

export { LoginForm };
export default connect(mapStateToProps, { login })(withStyles(styles)(LoginForm));
