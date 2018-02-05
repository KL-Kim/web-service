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
  root: {
    // margin: theme.spacing.unit * 10
  },
  button: {
    marginTop: theme.spacing.unit * 4,
  },
});

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      emailError: {
        showError: false,
        errorMessage: '',
      },
      passwordError: {
        showError: false,
        errorMessage: ''
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.isLoggedIn) {
      this.props.history.push('/');
    }

    if (nextProps.loginError) {
      this.setState({
        passwordError: {
          showError: true,
          errorMessage: nextProps.loginError.message
        }
      });
    }
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });

    if (this.state.password) {
      this.setState({
        passwordError: {
          showError: false,
          errorMessage: ''
        }
      });
    }
  }

  validateEmail() {
    if(!this.state.email || !validator.isEmail(this.state.email)) {
      this.setState({
        emailError: {
          showError: true,
          errorMessage: 'Error: Input a valid Email'
        }
      });
    } else {
      this.setState({
        emailError: {
          showError: false,
          errorMessage: ''
        }
      });
    }
  }

  validatePassword() {
    if (this.state.password.length <= 7) {
      this.setState({
        passwordError: {
          showError: true,
          errorMessage: 'Password should not be shorter than 7'
        }
      });
    } else {
      this.setState({
        passwordError: {
          showError: false,
          errorMessage: ''
        }
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const { email, password } = this.state;
    if (!email) {
      this.setState({
        emailError: {
          showError: true,
          errorMessage: 'Error: Input a valid Email'
        }
      });
    }

    if (!password) {
      this.setState({
        passwordError: {
          showError: true,
          errorMessage: 'Password should not empty'
        }
      });
    }

    if (email && password) {
      this.props.login(email, password);
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.root} onSubmit={this.handleSubmit}>
        <Typography type="display1" align="center">Sign In</Typography>
        <TextField
          name="email"
          error={this.state.emailError.showError}
          helperText={this.state.emailError.showError ? this.state.emailError.errorMessage : ' '}
          onChange={this.handleChange}
          onBlur={this.validateEmail}
          fullWidth
          margin="normal"
          label="Email"
          id="email" />
        <br />
        <TextField
          name="password"
          error={this.state.passwordError.showError}
          helperText={this.state.passwordError.showError ? this.state.passwordError.errorMessage : ' '}
          onChange={this.handleChange}
          onBlur={this.validatePassword}
          fullWidth
          margin="normal"
          type="password"
          label="Password"
          id="password" />
        <br />
        <Button
          name="signin"
          disabled={this.state.emailError.showError || this.state.passwordError.showError}
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

// export { LoginForm };
export default connect(mapStateToProps, { login })(withStyles(styles)(LoginForm));
