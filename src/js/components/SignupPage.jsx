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
  "input": {
    "margin": theme.spacing.unit * 2
  }
});

const passwordMinLength = config.passwordMinLength;

class UserSignup extends Component {
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
        "errorMessage": ''
      },
      "passwordConfirmation": {
        "value": '',
        "showError": false,
        "errorMessage": ''
      }
    };

    this.isValidEmail = this.isValidEmail.bind(this);
    this.isValidPassword = this.isValidPassword.bind(this);
    this.isValidPasswordConfirmation = this.isValidPasswordConfirmation.bind(this);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

    if (_.isEqual('email', name)) {
      this.setState({
        "email": {
          "value": value,
          "showError": false,
          "errorMessage": ''
        },
      });
    }

    if (_.isEqual('password', name)) {
      this.setState({
        "password": {
          "value": value,
          "showError": false,
          "errorMessage": ''
        },
        passwordConfirmation: {
          "value": this.state.passwordConfirmation.value,
          "showError": false,
          "errorMessage": ''
        },
      });
    }

    if (_.isEqual('passwordConfirmation', name)) {
      this.setState({
        "passwordConfirmation": {
          "value": value,
          "showError": false,
          "errorMessage": ''
        },
      });
    }
  }

  isValidEmail() {
    if(!this.state.email.value || !isEmail(this.state.email.value)) {
      this.setState({
        "email": {
          "value": this.state.email.value,
          "showError": true,
          "errorMessage": 'Error: Input a valid Email'
        }
      });
      return false;
    } else {
      this.setState({
        "email": {
          "value": this.state.email.value,
          "showError": false,
          "errorMessage": ''
        }
      });
      return true;
    }
  }

  isValidPassword() {
    if (this.state.password.value.length <= 7) {
      this.setState({
        "password": {
          "value": this.state.password.value,
          "showError": true,
          "errorMessage": 'Password should not be shorter than ' + passwordMinLength
        }
      });
      return false;
    } else {
      this.setState({
        "password": {
          "value": this.state.password.value,
          "showError": false,
          "errorMessage": ''
        }
      });
      return true;
    }
  }

  isValidPasswordConfirmation() {
    if (!_.isEqual(this.state.password.value, this.state.passwordConfirmation.value)) {
      this.setState({
        "passwordConfirmation": {
          "value": this.state.passwordConfirmation.value,
          "showError": true,
          "errorMessage": 'Confirm password is not match with password'
        }
      });
      return false;
    } else {
      this.setState({
        "passwordConfirmation": {
          "value": this.state.passwordConfirmation.value,
          "showError": false,
          "errorMessage": ''
        }
      });
      return true
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const { email, password, passwordConfirmation } = this.state;

    if (this.isValidEmail() && this.isValidPassword() && this.isValidPasswordConfirmation()) {
      const user = {
        "email": email.value,
        "password": password.value,
        "passwordConfirmation": passwordConfirmation.value
      };

      this.props.register(user)
        .then(response => {
          if (_.isEmpty(response) && this.props.error) {
            this.setState({
              "email": {
                "value": this.state.email.value,
                "showError": true,
                "errorMessage": this.props.errorMessage
              }
            });
          }
        });
    }
  }

  render() {
    const { classes } = this.props;
    let signupButton = this.props.isFetching ? (<CircularProgress size={20} />) : 'Sign up';

    return (
      <Container>
        <Grid container spacing={16} justify="center" alignItems="center" className={classes.root}>
          <Grid item sm={5}>
            <Paper className={classes.paper}>
              <Typography variant="display1" align="center">
                Sign up
              </Typography>
              <form noValidate onSubmit={this.handleSubmit}>
                <TextField
                  type="text"
                  name="email"
                  error={this.state.email.showError}
                  helperText={this.state.email.showError ? this.state.email.errorMessage : ' '}
                  onChange={this.handleChange}
                  onBlur={this.isValidEmail}
                  fullWidth
                  margin="normal"
                  label="Email"
                />
                <br />

                <TextField
                  type="password"
                  name="password"
                  error={this.state.password.showError}
                  helperText={this.state.password.showError ? this.state.password.errorMessage : ' '}
                  onChange={this.handleChange}
                  onBlur={this.isValidPassword}
                  fullWidth
                  margin="normal"
                  label="Password"
                />
                <br />

                <TextField
                  type="password"
                  name="passwordConfirmation"
                  error={this.state.passwordConfirmation.showError}
                  helperText={this.state.passwordConfirmation.showError
                    ? this.state.passwordConfirmation.errorMessage : ' '}
                  onChange={this.handleChange}
                  onBlur={this.isValidPasswordConfirmation}
                  fullWidth
                  margin="normal"
                  label="Confirm password"
                />
                <br />

                <Button
                  type="submit"
                  disabled = {
                    this.state.email.showError
                    || this.state.password.showError
                    || this.state.passwordConfirmation.showError
                    || this.props.isFetching
                  }
                  className={classes.button}
                  variant="raised"
                  color="primary"
                  fullWidth

                >
                  {signupButton}
                </Button>
              </form>
            </Paper>
            <Grid container align="center">
              <Grid item xs align="center">
                <Typography variant="body2" align="center">
                  If you sign up, you agree to follow the
                  <Link to="/terms-policy">
                    TERMS and POLICY.
                  </Link>
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
  "history": PropTypes.object.isRequired,
  "classes": PropTypes.object.isRequired,
  "isFetching": PropTypes.bool,
  "isLoggedIn": PropTypes.bool.isRequired,
  "register": PropTypes.func.isRequired,
  "requestError": PropTypes.bool,
  "errorMessage": PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "isFetching": state.userReducer.isFetching,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "error": state.userReducer.error,
    "registerError": state.alertReducer.error,
    "errorMessage": state.alertReducer.message,
  };
};

export default connect(mapStateToProps, { register, closeLoginDialog })(withStyles(styles)(UserSignup));
