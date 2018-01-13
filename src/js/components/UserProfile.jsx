import React, { Component } from 'react';
import logo from '../../css/logo.svg';

const style = {
  textAlign: 'center'
};

class UserProfile extends Component {
  render() {
    return (
      <div style={style}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">User Profile</h1>
        </header>
        <p>
          User Profile goes here!
        </p>
      </div>
    );
  }
}

export default UserProfile;
