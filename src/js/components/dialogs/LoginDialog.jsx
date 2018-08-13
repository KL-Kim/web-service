import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import isEmail from 'validator/lib/isEmail';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

// Material UI Icons
import Error from '@material-ui/icons/Error';
import Close from '@material-ui/icons/Close';

// Actions
import { login } from 'js/actions/user.actions';


// WebStorage
import { loadFromStorage, saveToStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

import config from 'js/config/config';

const styles = (theme) => ({
  "appBar": {
    position: 'relative',
  },
  "flex": {
    flex: 1,
  },
  "container": {
    padding: theme.spacing.unit * 8,

    [theme.breakpoints.down('xs')]: {
      "paddingTop": theme.spacing.unit * 4,
      "paddingBottom": theme.spacing.unit * 4,
      "paddingLeft": theme.spacing.unit,
      "paddingRight": theme.spacing.unit,
    }
  },
  "section": {
    marginBottom: theme.spacing.unit * 2,
  },
});

const passwordMinLength = config.passwordMinLength;

class LoginDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "email": '',
      "emailError": false,
      "emailErrorMessage": '',

      "password": '',
      "passwordError": false,
      "passwordErrorMessage": '',

      "waitUntil": null,
      "goodToGo": true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.isValidEmail = this.isValidEmail.bind(this);
    this.isValidPassword = this.isValidPassword.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    if (e.target.name === 'email') {
      this.setState({
        email: value,
        emailError: false,
      });
    }
    else if (e.target.name === 'password') {
      this.setState({
        password: value,
        passwordError: false,
      });
    }
  }

  isValidEmail() {
    if (!isEmail(this.state.email)) {
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
        passwordErrorMessage: 'Error: Should not be shorter than ' + passwordMinLength,
      });

      return false;
    } else {
      this.setState({
        passwordError: false,
      });

      return true;
    }
  }

  handleLogin(e) {
    e.preventDefault();

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
      this.props.login(this.state.email, this.state.password)
        .then(response => {
          if (response) {
            this.props.onClose();
          }
          else if (this.props.error) {
            this.setState({
              passwordError: true,
              passwordErrorMessage: this.props.errorMessage,
            });
          }
        });
    }
  }

  handleClose() {
    this.setState({
      "email": '',
      "emailError": false,
      "emailErrorMessage": '',

      "password": '',
      "passwordError": false,
      "passwordErrorMessage": '',
    });

    this.props.onClose();
  }

  render() {
    const { classes } = this.props;

    return (
      <Dialog 
        fullWidth
        fullScreen={this.props.fullScreen}
        open={this.props.open}
        onClose={this.handleClose}
        aria-labelledby="login-dialog-title"
        aria-describedby="login-dialog-description"
      >
        
        <Hidden smUp>
          <AppBar className={classes.appBar} color="inherit">
            <Toolbar>
              <div className={classes.flex}>
                <IconButton color="inherit" onClick={this.handleClose} >
                  <Close />
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>
        </Hidden>

        <DialogContent>
          <div className={classes.container}>
            <Typography variant="display1" align="center">Sign In</Typography>
            <form onSubmit={this.handleLogin}>
              <FormControl fullWidth className={classes.section}>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  error={this.state.emailError}
                  onBlur={this.isValidEmail}
                  onChange={this.handleChange}
                  endAdornment={
                    this.state.emailError
                      ? (<InputAdornment position="end">
                          <Error color="secondary"/>
                        </InputAdornment>)
                      : null
                  }
                />
                <FormHelperText id="email-helper-text" error>
                  {
                    this.state.emailError ? this.state.emailErrorMessage : ' '
                  }
                </FormHelperText>
              </FormControl>

              <FormControl fullWidth className={classes.section}>
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
                      ? (<InputAdornment position="end">
                          <Error color="secondary" />
                        </InputAdornment>)
                      : null
                  }
                />
                <FormHelperText id="password-helper-text" error>
                  {
                    this.state.passwordError ? this.state.passwordErrorMessage : ' '
                  }
                </FormHelperText>
              </FormControl>

              <div className={classes.section}>
                <Button
                  type="submit"
                  size="large"
                  name="signin"
                  disabled={this.state.emailError || this.state.passwordError || this.props.isFetching || !this.state.goodToGo}
                  variant="raised"
                  color="primary"
                  fullWidth
                >
                  {
                    this.props.isFetching
                      ? (<CircularProgress size={20} />)
                      : this.state.waitUntil ? "Wait " + this.state.waitUntil : 'Sign in'
                  }
                </Button>
              </div>
            </form>

            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Link to="/forget-password">
                  <Button size="small" color="primary">Forget password?</Button>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/signup">
                  <Button size="small" color="primary">Sign up</Button>
                </Link>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}

LoginDialog.propTypes = {
  "fullScreen": PropTypes.bool.isRequired,
  "classes": PropTypes.object.isRequired,
  "open": PropTypes.bool.isRequired,
  "onClose": PropTypes.func.isRequired,
  "isFetching": PropTypes.bool.isRequired,
  "error": PropTypes.object,
  "errorMessage": PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  return {
    isFetching: state.userReducer.isFetching,
    error: state.userReducer.error,
    errorMessage: state.alertReducer.message,
  };
};

export default connect(mapStateToProps, { login })((withStyles(styles)(withMobileDialog()(LoginDialog))));
