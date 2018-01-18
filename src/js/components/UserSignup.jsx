import React, { Component } from 'react';
import Reboot from 'material-ui/Reboot';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import Header from '../containers/Header';
import Footer from '../containers/Footer';

class UserSignup extends Component {
  render() {
    return (
      <div>
        <Reboot />
          <div className="App-container">
            <Header />
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
            <Footer />
          </div>
      </div>

    );
  }
}

export default UserSignup;
