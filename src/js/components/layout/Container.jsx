import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Custom Components
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import Alert from '../utils/Alert';

// For dev
import DevTools from './DevTools';

class Container extends Component {
  render() {
    return (
      <div style={{
        flexGrow: 1,
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
      }}>
        <Header position={this.props.headerPosition} />
        <main>
          {this.props.children}
        </main>
        <BottomNav />
        <Footer />
        <DevTools />
        <Alert />
      </div>
    );
  }
}

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
  headerPosition: PropTypes.string,
};

export default Container;
