import React, { Component } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';


import { login } from '../actions/user.actions';

const styles = (theme) => ({
  root: {
    margin: theme.spacing.unit * 10
  },
  button: {
    marginTop: theme.spacing.unit * 3,
  },
});

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      showError: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    let reponse;
    const { email, password } = this.state;
    if (email && password) {
      this.props.login(email, password);
    }
  }

  validateEmail(e) {
    e.preventDefault();

    if(!this.state.email || !validator.isEmail(this.state.email)) {
      this.setState({
        showError: true
      });
    } else {
      this.setState({
        showError: false
      });
    }
  }

  render() {
    const { classes, error } = this.props;
    //
    return (
      <div className={classes.root}>
        <FormControl fullWidth onSubmit={this.handleSubmit}>
          <Typography type="display1" align="center">Sign in</Typography>
          <TextField
            fullWidth
            error={this.state.showError}
            margin="normal"
            label="Email"
            id="email"
            name="email"
            helperText={this.state.showError ? "Error: Input an valid email" : ''}
            className={classes.input}
            onChange={this.handleChange}
            onBlur={this.validateEmail} />
          <br />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            label="Password"
            id="password"
            name="password"
            helperText="Error: Wrong password"
            className={classes.input}
            onChange={this.handleChange} />
          <br />
          <Button className={classes.button} raised color="primary" type="submit">Sign in</Button>
        </FormControl>
      </div>
    );
  }
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {};
}

export default connect(mapStateToProps, { login })(withStyles(styles)(LoginForm));
