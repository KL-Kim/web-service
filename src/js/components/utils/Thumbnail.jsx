import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Img from 'react-image';

// Default image
import image from 'css/ikt-icon.gif';

class Thumbnail extends Component {
  render() {
    const { type } = this.props;

    let src;

    switch (type) {
      case 'thumbnail':
        src = this.props.src + '-thumbnail';
        break;
    
      default:
        src = this.props.src + '-business';
        break;
    }

    return (
      <Img
        style={{ width: '100%' }} 
        unloader={<img src={image} />}
        src={src} 
      />
    );
  }
}

Thumbnail.propTypes = {
  "src": PropTypes.string,
};

export default Thumbnail;
