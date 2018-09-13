import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Custom Components
import Header from './Header';
import Footer from './Footer';
import Alert from '../utils/Alert';

class Container extends Component {
  // componentDidCatch(error, info) {
  //   const stack = info.componentStack;
  // }
  
  render() {
    return (
      <div style={{
        flexGrow: 1,
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
      }}>
        <Header />
        <main>
          {this.props.children}
        </main>
        <Footer />
        <Alert />
      </div>
    );
  }
}

Container.propTypes = {
  children: PropTypes.element.isRequired,
  headerPosition: PropTypes.string,
};

export default Container;
