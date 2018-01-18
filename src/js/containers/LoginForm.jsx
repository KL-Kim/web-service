import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import { login } from '../actions/user.actions';

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
    return (
      <div>
        <form className="loginForm" noValidate autoComplete="off" onSubmit={this.handleSubmit}>
            <br />
            <TextField
              label="Email"
              id="email"
              name="email"
              onChange={this.handleChange} />
            <br />
            <TextField
              type="password"
              label="Password"
              margin="normal"
              id="password"
              name="password"
              onChange={this.handleChange} />
            <br />
            <Button raised color="primary" type="submit">Sign in</Button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
}

export default connect(mapStateToProps, { login })(LoginForm);
