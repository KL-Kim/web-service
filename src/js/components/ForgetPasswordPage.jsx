import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import validator from 'validator';
import { connect } from 'react-redux';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Components
import Container from './layout/Container';
import emailTypes from '../constants/email.types';

// Actions
import { sendEmail } from '../actions/auth.actions';

const styles = theme => ({
  "root": {
    "marginTop": theme.spacing.unit * 25,
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

class ForgetPasswordPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "email": {
        "value": '',
        "showError": false,
        "errorMessage": '',
      }
    };

    this.isValidEmail = this.isValidEmail.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
  }

  isValidEmail() {
    if(!this.state.email.value || !validator.isEmail(this.state.email.value)) {
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

  handleSubmit(e) {
    e.preventDefault();

    const { email } = this.state;

    if (this.isValidEmail(email.value)) {
      this.props.sendEmail(emailTypes.CHANGE_PASSWORD, email.value);
    }
  }

  render() {
    const { classes, isFetching } = this.props;

    return (
      <Container>
        <Grid container spacing={16} justify="center" className={classes.root}>
          <Grid item xs={5}>
            <Paper className={classes.paper}>
              <Typography variant="display1" align="center">
                Forget Password
              </Typography>
              <form onSubmit={this.handleSubmit}>
                <TextField fullWidth
                  type="email"
                  id="email"
                  name="email"
                  label="Email"
                  margin="normal"
                  error={this.state.email.showError}
                  helperText={this.state.email.showError ? this.state.email.errorMessage : ' '}
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
                  disabled={this.state.email.showError || isFetching}
                >
                  {isFetching ? <CircularProgress size={20} /> : 'Send Email'}
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

ForgetPasswordPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "isFetching": PropTypes.bool,
  "sendChangePasswordEmail": PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "isFetching": state.userReducer.isFetching,
  };
};

export default connect(mapStateToProps, { sendEmail })(withStyles(styles)(ForgetPasswordPage));
