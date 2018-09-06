import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Custom Components
import Header from './Header';
import Footer from './Footer';
import Alert from '../utils/Alert';

// For dev
import DevTools from './DevTools';

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
        <DevTools />
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
