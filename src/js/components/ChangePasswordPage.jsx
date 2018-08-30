import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Components
import config from 'js/config/config';
import Container from './layout/Container';
import SmallContainer from './layout/SmallContainer';

// Actions
import { changePassword } from 'js/actions/user.actions';

const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit * 2,
  },
});

const passwordMinLength = config.PASSWORD_MIN_LENGTH;

class ChangePasswordPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      password: '',
      passwordShowError: false,
      passwordErrorMessage: '',

      passwordConfirmation: '',
      passwordConfirmationShowError: false,
      passwordConfirmationErrorMessage: '',
    };

    this.isValidPassword = this.isValidPassword.bind(this);
    this.isValidPasswordConfirmation = this.isValidPasswordConfirmation.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    if ('password' === name) {
      this.setState({
        password: value,
        passwordShowError: false,
        passwordConfirmation: '',
        passwordConfirmationShowError: false,
      });
    }

    if ('passwordConfirmation' === name) {
      this.setState({
        passwordConfirmation: value,
        passwordConfirmationShowError: false,
      });
    }
  }

  isValidPassword() {
    if (this.state.password.length <= 7) {
      this.setState({
        passwordShowError: true,
        passwordErrorMessage: 'Password should not be shorter than ' + passwordMinLength
      });

      return false;
    } else {
      this.setState({
        passwordShowError: false,
      });

      return true;
    }
  }

  isValidPasswordConfirmation() {
    if (this.state.password !== this.state.passwordConfirmation) {
      this.setState({
        passwordConfirmationShowError: true,
        passwordConfirmationErrorMessage: 'Confirm password is not match with password'
      });

      return false;
    } else {
      this.setState({
        passwordConfirmationShowError: false,
      });

      return true;
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.isValidPassword() && this.isValidPasswordConfirmation()) {
      this.props.changePassword(
        this.props.match.params.token,
        this.state.password,
        this.state.passwordConfirmation,
      ).then(response => {
        if (response) {
          this.setState({
            "message": response,
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
          <div>
            <Typography variant="display1" align="center">Change Password</Typography>
            <form onSubmit={this.handleSubmit}>
              <TextField
                type="password"
                id="password"
                name="password"
                error={this.state.passwordShowError}
                helperText={this.state.passwordShowError ? this.state.passwordErrorMessage : ' '}
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
                error={this.state.passwordConfirmationShowError}
                helperText={this.state.passwordConfirmationShowError
                  ? this.state.passwordConfirmationErrorMessage : ' '}
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
                  disabled={this.state.passwordShowError || this.state.passwordConfirmationShowError || this.props.isFetching}
                  onClick={this.handleSubmit}
                >
                  {this.props.isFetching ? (<CircularProgress size={20} />) : 'Reset'}
                </Button>

                <Typography
                  variant="body1"
                  align="center"
                  color={Boolean(this.props.changePasswordError) ? "error" : "primary"}
                >
                  {
                    this.state.message
                  }
                </Typography>
              </div>
            </form>
          </div>
        </SmallContainer>
      </Container>
    );
  }
}

ChangePasswordPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "match": PropTypes.object.isRequired,
  "isFetching": PropTypes.bool,
  "changePassword": PropTypes.func.isRequired,
  "changePasswordError": PropTypes.object,
  "message": PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "isFetching": state.userReducer.isFetching,
    "changePasswordError": state.userReducer.error,
  };
};

export default connect(mapStateToProps, { changePassword })(withStyles(styles)(ChangePasswordPage));
