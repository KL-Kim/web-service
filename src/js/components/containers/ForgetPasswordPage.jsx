import React, { Component } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import Container from './Container';
import { sendChangePasswordEmail } from '../../actions/user.actions';

const styles = theme => ({
  "root": {
    "marginTop": theme.spacing.unit * 10,
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

    if (validator.equals('email', name)) {
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
      this.props.sendChangePasswordEmail(email.value);
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Container>
        <Grid container spacing={16} justify="center" className={classes.root}>
          <Grid item xs={5}>
            <Paper className={classes.paper}>
              <Typography type="display1" align="center">
                Forget Password
              </Typography>
              <form onSubmit={this.handleSubmit}>
                <TextField
                  name="email"
                  error={this.state.email.showError}
                  helperText={this.state.email.showError ? this.state.email.errorMessage : ' '}
                  onChange={this.handleChange}
                  onBlur={this.isValidEmail}
                  fullWidth
                  margin="normal"
                  type="email"
                  label="Email"
                  id="email" />
                <br />
                <Button
                  name="signin"
                  disabled={this.state.email.showError}
                  className={classes.button}
                  raised
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Send Email
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
  "sendChangePasswordEmail": PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

export default connect(mapStateToProps, { sendChangePasswordEmail })(withStyles(styles)(ForgetPasswordPage));
