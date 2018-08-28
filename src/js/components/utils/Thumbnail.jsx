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
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        paddingTop: '75%', 
      }}>
        <Img
          style={{ 
            width: '100%',
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }} 
          loader={<div 
                    style={{
                      backgroundColor: '#fff',
                      width: '100%',
                      height:'100%',
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      animation: 'fadeIn 0.5s Infinite alternate',
                    }}
                  />
          }
          unloader={<img 
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0, 
                      }} 
                      src={image}
                    />
          }
          src={src} 
        />
      </div>
    );
  }
}

Thumbnail.propTypes = {
  "src": PropTypes.string,
};

export default Thumbnail;
