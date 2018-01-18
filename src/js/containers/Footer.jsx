import React, { Component } from 'react';
import Alert from './Alert';

class Footer extends Component{
  render() {
    return (
      <footer>
        <p>
          Copyright 2017 iKoreaTown
        </p>
        <Alert />
      </footer>
  );
  }
}

export default Footer;
