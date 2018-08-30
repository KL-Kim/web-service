import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import validator from 'validator';
import { connect } from 'react-redux';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Components
import Container from './layout/Container';
import SmallContainer from './layout/SmallContainer';

// Constants
import emailTypes from 'js/constants/email.types';

// Actions
import { sendEmail } from 'js/actions/auth.actions';

const styles = theme => ({
  "button": {
    "marginTop": theme.spacing.unit * 2,
  },
});

class ForgetPasswordPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "email": '',
      "showError": false,
      "errorMessage": '',
    };

    this.isValidEmail = this.isValidEmail.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    if ('email' === name) {
      this.setState({
        "email": value,
        "showError": false,
      });
    }
  }

  isValidEmail() {
    if(!this.state.email || !validator.isEmail(this.state.email)) {
      this.setState({
        "showError": true,
        "errorMessage": 'Error: Input a valid Email'
      });
      return false;
    } else {
      this.setState({
        "showError": false,
      });
      return true;
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const { email } = this.state;

    if (this.isValidEmail(email)) {
      this.props.sendEmail(emailTypes.CHANGE_PASSWORD, email);
    }
  }

  render() {
    const { classes, isFetching } = this.props;

    return (
      <Container>
        <SmallContainer>
          <Typography variant="display1" align="center">Forget Password</Typography>

          <form onSubmit={this.handleSubmit}>
            <TextField fullWidth
              autoComplete="off"
              type="email"
              name="email"
              label="Email"
              margin="normal"
              error={this.state.showError}
              helperText={this.state.showError ? this.state.errorMessage : ' '}
              onChange={this.handleChange}
              onBlur={this.isValidEmail}
            />
            <br />

            <Button fullWidth
              type="submit"
              name="signin"
              variant="raised"
              color="primary"
              className={classes.button}
              disabled={this.state.showError || isFetching}
            >
              {isFetching ? <CircularProgress size={20} /> : 'Send Email'}
            </Button>
          </form>
        </SmallContainer>
      </Container>
    );
  }
}

ForgetPasswordPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "isFetching": PropTypes.bool,
  "sendEmail": PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "isFetching": state.userReducer.isFetching,
  };
};

export default connect(mapStateToProps, { sendEmail })(withStyles(styles)(ForgetPasswordPage));
