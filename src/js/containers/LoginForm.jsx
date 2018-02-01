import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import { login } from '../actions/user.actions';

const styles = (theme) => ({
  button: {
    marginTop: theme.spacing.unit * 4,
  },
  input: {
    width: 270,
    margin: theme.spacing.unit * 2
  }
})

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const { email, password } = this.state;
    if (email && password) {
       this.props.login(email, password);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <form className="loginForm" noValidate autoComplete="off" onSubmit={this.handleSubmit}>
            <Typography type="display1" align="center">
              Sign in
            </Typography>
            <TextField
              label="Email"
              id="email"
              name="email"
              className={classes.input}
              onChange={this.handleChange} />
            <br />
            <TextField
              type="password"
              label="Password"
              margin="normal"
              id="password"
              name="password"
              className={classes.input}
              onChange={this.handleChange} />
            <br />
            <Button className={classes.button} raised color="primary" type="submit">Sign in</Button>
        </form>
        <Grid container justify="center" alignItems="center">
          <Grid item xs>
            <Link to="/forget-password">
              <Button className={classes.button} color="primary" type="submit">Forget your password?</Button>
            </Link>
            <Link to="/signup">
              <Button className={classes.button} color="primary" type="submit">Sign up</Button>
            </Link>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
}

export default connect(mapStateToProps, { login })(withStyles(styles)(LoginForm));
