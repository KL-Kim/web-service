import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import logo from '../../css/logo.svg';

const style = {
  textAlign: 'center'
};

class UserSignup extends Component {
  render() {
    return (
      <div style={style}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Sign Up</h1>
        </header>
        <form className="loginForm" noValidate autoComplete="off">
            <br />
            <TextField
              label="Email"
              id="email" />
            <br />
            <TextField
              type="password"
              label="Password"
              margin="normal"
              id="password" />
            <br />
            <TextField
              type="password"
              label="Password Confirmation"
              margin="normal"
              id="passwordConfirmation" />
            <br />
            <Button raised color="primary" onClick={this.props.login}>Sign up</Button>
        </form>
      </div>
    );
  }
}

export default UserSignup;
