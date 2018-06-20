import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Components
import config from '../config/config';
import Container from './layout/Container';

// Actions
import { changePassword } from '../actions/user.actions';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 20,
  },
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

const passwordMinLength = config.passwordMinLength;

class ChangePasswordPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: {
        value: '1',
        showError: false,
        errorMessage: ''
      },
      passwordConfirmation: {
        value: '1',
        showError: false,
        errorMessage: ''
      }
    };

    this.isValidPassword = this.isValidPassword.bind(this);
    this.isValidPasswordConfirmation = this.isValidPasswordConfirmation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    if (_.isEqual('password', name)) {
      this.setState({
        password: {
          value: value,
          showError: false,
          errorMessage: ''
        },
        passwordConfirmation: {
          value: this.state.passwordConfirmation.value,
          showError: false,
          errorMessage: ''
        },
      });
    }

    if (_.isEqual('passwordConfirmation', name)) {
      this.setState({
        passwordConfirmation: {
          value: value,
          showError: false,
          errorMessage: ''
        },
      });
    }
  }

  isValidPassword() {
    if (this.state.password.value.length <= 7) {
      this.setState({
        password: {
          value: this.state.password.value,
          showError: true,
          errorMessage: 'Password should not be shorter than ' + passwordMinLength
        }
      });
      return false;
    } else {
      this.setState({
        password: {
          value: this.state.password.value,
          showError: false,
          errorMessage: ''
        }
      });
      return true;
    }
  }

  isValidPasswordConfirmation() {
    if (!_.isEqual(this.state.password.value, this.state.passwordConfirmation.value)) {
      this.setState({
        passwordConfirmation: {
          value: this.state.passwordConfirmation.value,
          showError: true,
          errorMessage: 'Confirm password is not match with password'
        }
      });
      return false;
    } else {
      this.setState({
        passwordConfirmation: {
          value: this.state.passwordConfirmation.value,
          showError: false,
          errorMessage: ''
        }
      });
      return true;
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const {password, passwordConfirmation} = this.state;

    if (this.isValidPassword() && this.isValidPasswordConfirmation()) {
      this.props.changePassword(this.props.match.params.token, password.value, passwordConfirmation.value);
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Container>
        <Grid container spacing={16} justify="center" className={classes.root}>
          <Grid item xs={5}>
            <Paper className={classes.paper}>
              <Typography variant="display1" align="center">
                Change Password
              </Typography>
              <form onSubmit={this.handleSubmit}>
                <TextField
                  type="password"
                  id="password"
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
                  id="passwordConfirmation"
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
                <div>
                  <Button fullWidth
                    type="submit"
                    name="signin"
                    variant="raised"
                    color="primary"
                    className={classes.button}
                    disabled={this.state.password.showError || this.state.passwordConfirmation.showError || this.props.isFetching}
                    onClick={this.handleSubmit}
                  >
                    {this.props.isFetching ? (<CircularProgress size={20} />) : 'Change Password'}
                  </Button>
                </div>
              </form>
            </Paper>
            <Typography
              variant="body"
              align="center"
              color={this.props.changePasswordError ? "error" : "inherit"}
            >
              {this.props.message}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

ChangePasswordPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "match": PropTypes.object.isRequired,
  "isFetching": PropTypes.bool,
  "changePassword": PropTypes.func.isRequired,
  "changePasswordError": PropTypes.bool,
  "message": PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "isFetching": state.userReducer.isFetching,
    "changePasswordError": state.userReducer.error,
    "message": state.alertReducer.message,
  };
};

export default connect(mapStateToProps, { changePassword })(withStyles(styles)(ChangePasswordPage));
