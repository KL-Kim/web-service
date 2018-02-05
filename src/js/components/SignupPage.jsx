import React, { Component } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import Container from './Container';

const styles = theme => ({
  paper: {
    paddingTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 5,
    paddingLeft: theme.spacing.unit * 10,
    paddingRight: theme.spacing.unit * 10,
    marginBottom: theme.spacing.unit,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  button: {
    marginTop: theme.spacing.unit * 4,
  },
  input: {
    width: 270,
    margin: theme.spacing.unit * 2
  }
});

class UserSignup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      passwordConfirmation: '',
      emailError: {
        showError: false,
        errorMessage: '',
      },
      usernameError: {
        showError: false,
        errorMessage: '',
      },
      passwordError: {
        showError: false,
        errorMessage: ''
      },
      passwordConfirmationError: {
        showError: false,
        errorMessage: ''
      }
    };

    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.validateUsername = this.validateUsername.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  validateEmail(e) {
    e.preventDefault();

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

  validateUsername(e) {
    e.preventDefault();
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

    if (this.state.passwordConfirmation !== this.state.password) {
      this.setState({
        passwordConfirmationError: {
          showError: true,
          errorMessage: 'Confirm password is not match with password'
        }
      });
    } else {
      this.setState({
        passwordConfirmationError: {
          showError: false,
          errorMessage: ''
        }
      });
    }

  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Grid container className={classes.root} spacing={16} justify="center" alignItems="center">
          <Grid item sm={5}>
            <Paper className={classes.paper}>
              <form noValidate>
                <Typography type="display1" align="center">
                  Sign up
                </Typography>
                <TextField
                  name="email"
                  error={this.state.emailError.showError}
                  helperText={this.state.emailError.showError ? this.state.emailError.errorMessage : ' '}
                  onChange={this.handleChange}
                  onBlur={this.validateEmail}
                  fullWidth
                  margin="normal"
                  label="Email"
                  id="email"
                  type="text" />
                <br />
                <TextField
                  name="username"
                  error={this.state.usernameError.showError}
                  helperText={this.state.usernameError.showError ? this.state.usernameError.errorMessage : ' '}
                  onChange={this.handleChange}
                  onBlur={this.validateUsername}
                  label="Username"
                  id="username"
                  margin="normal"
                  fullWidth
                  type="text" />
                <br />
                <TextField
                  name="password"
                  error={this.state.passwordError.showError}
                  helperText={this.state.passwordError.showError ? this.state.passwordError.errorMessage : ' '}
                  onChange={this.handleChange}
                  onBlur={this.validatePassword}
                  fullWidth
                  margin="normal"
                  label="Password"
                  id="password"
                  type="password" />
                <br />
                <TextField
                  name="passwordConfirmation"
                  error={this.state.passwordConfirmationError.showError}
                  helperText={this.state.passwordConfirmationError.showError
                    ? this.state.passwordConfirmationError.errorMessage : ' '}
                  onChange={this.handleChange}
                  onBlur={this.validatePassword}
                  fullWidth
                  margin="normal"
                  label="Confirm password"
                  id="passwordConfirmation"
                  type="password" />
                <br />
                <Button
                  onClick={this.props.register}
                  className={classes.button}
                  raised
                  color="primary"
                  fullWidth
                  >Sign up</Button>
              </form>

            </Paper>
            <Grid container align="center">
              <Grid item xs align="center">
                <Typography type="body2" align="center">
                  If you sign up, you agree to follow the TERMS and POLICY.
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

UserSignup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserSignup);
