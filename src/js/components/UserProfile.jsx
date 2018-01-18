import React, { Component } from 'react';
import Reboot from 'material-ui/Reboot';

import Header from '../containers/Header';
import Footer from '../containers/Footer';

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: JSON.parse(sessionStorage.getItem('token'))
    };
  }

  render() {
    return (
      <div>
        <Reboot />
          <div className="App-container">
            <Header />
            <p>
              User Profile goes here!
            </p>
            <p>
              Your token is : { this.state.token }
            </p>
          <Footer />
          </div>
      </div>

    );
  }
}

export default UserProfile;
