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
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

// Material UI Icons
import Error from '@material-ui/icons/Error';

// Actions
import { closeLoginDialog } from '../../actions/app.actions';
import { login } from '../../actions/user.actions';

import config from '../../config/config';
import { loadFromStorage, saveToStorage } from '../../helpers/webStorage';
import webStorageTypes from '../../constants/webStorage.types';

const styles = (theme) => ({
  container: {
    padding: theme.spacing.unit * 8
  },
});

const passwordMinLength = config.passwordMinLength;

class LoginDialog extends Component {
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
    this.isValidEmail = this.isValidEmail.bind(this);
    this.isValidPassword = this.isValidPassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.closeLoginDialog();
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: {
        value: value,
        showError: false,
        errorMessage: ''
      }
    });
  }

  isValidEmail() {
    if (!this.state.email.value || !isEmail(this.state.email.value)) {
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
          errorMessage: 'Error: Should not be shorter than ' + passwordMinLength,
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

    // if (loginFailedCount >= 5) {
    //   let time = 30;
    //   var nInverId = setInterval(() => {
    //     time = time - 1;
    //
    //     this.setState({
    //       "waitUntil": time,
    //     });
    //     console.log("You can try after " + time);
    //
    //     if (time < 1) {
    //       clearInterval(nInverId);
    //       saveToStorage(webStorageTypes.WEB_STORAGE_LOGIN_FAILED, 0);
    //       this.setState({
    //         "goodToGo": true
    //       });
    //     }
    //   }, 1000);
    //
    //   this.setState({
    //      "goodToGo": false
    //   });
    // }

    if (this.isValidEmail() && this.isValidPassword()) {
      this.props.login(email.value, password.value)
        .then(response => {
          if (response) {
            this.props.closeLoginDialog();
          }
        });
    }
  }

  render() {
    const { classes } = this.props;

    let errorMessage;

    if (this.state.password.showError) {
      errorMessage = this.state.password.errorMessage;
    } else if (this.props.loginError) {
      errorMessage = 'Error: ' + this.props.errorMessage;
    }

    return (
      this.props.dialogOpen
        ? (
          <Dialog fullWidth
            open={this.props.dialogOpen}
            onClose={this.props.closeLoginDialog}
            aria-labelledby="login-dialog-title"
            aria-describedby="login-dialog-description"
          >
            <DialogContent>
              <div className={classes.container}>
                <Typography variant="display1" align="center">Sign In</Typography>
                <form onSubmit={this.handleSubmit}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      error={this.state.email.showError}
                      onBlur={this.isValidEmail}
                      onChange={this.handleChange}
                      endAdornment={
                        this.state.email.showError
                          ? (<InputAdornment position="end">
                              <Error color="secondary"/>
                            </InputAdornment>)
                          : ''
                      }
                    />
                    <FormHelperText id="email-helper-text" error>{this.state.email.showError ? this.state.email.errorMessage : ' '}</FormHelperText>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      error={this.state.password.showError || this.props.loginError}
                      onBlur={this.isValidPassword}
                      onChange={this.handleChange}
                      endAdornment={
                        this.state.password.showError || this.props.loginError
                          ? (<InputAdornment position="end">
                              <Error color="secondary" />
                            </InputAdornment>)
                          : ''
                      }
                    />
                    <FormHelperText id="password-helper-text" error>{errorMessage}</FormHelperText>
                  </FormControl>
                  <Button
                    type="submit"
                    name="signin"
                    disabled={this.state.email.showError || this.state.password.showError || this.props.isFetching || !this.state.goodToGo}
                    className={classes.button}
                    variant="raised"
                    color="primary"
                    fullWidth
                  >
                    {
                      this.props.isFetching
                      ? (<CircularProgress size={20} />)
                      : this.state.waitUntil ? "Wait " + this.state.waitUntil : ('Sign in')
                    }
                  </Button>
                </form>

                <Grid container justify="space-between" alignItems="center">
                  <Grid item>
                    <Link to="/forget-password">
                      <Button color="primary">Forget your password?</Button>
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link to="/signup">
                      <Button color="primary">Sign up</Button>
                    </Link>
                  </Grid>
                </Grid>

              </div>
            </DialogContent>
          </Dialog>
        )
        : <div></div>
    );
  }
}

LoginDialog.propTypes = {
  "classes": PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    dialogOpen: state.appReducer.loginDialogOpen,
    isFetching: state.userReducer.isFetching,
    loginError: state.alertReducer.error,
    errorMessage: state.alertReducer.message,
  };
};

export default connect(mapStateToProps, { closeLoginDialog, login })(withStyles(styles)(LoginDialog));
