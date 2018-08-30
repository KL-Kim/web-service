import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Img from 'react-image';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';

// Default image
import image from 'css/ikt-icon.gif';

const styles = theme => ({
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: "6px",
    boxShadow: "0 5px 15px -8px rgba(0, 0, 0, 0.24), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
    [theme.breakpoints.down('xs')]: {
      borderRadius: 0,
    }
  }
})

class Thumbnail extends Component {
  render() {
    const { classes, type } = this.props;

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
        paddingTop: '56.25%',
      }}>
        <Img
          className={classes.image}
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
                      boxShadow: "0 5px 15px -8px rgba(0, 0, 0, 0.24), 0 8px 10px -5px rgba(0, 0, 0, 0.2)",
                    }}
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

export default withStyles(styles)(Thumbnail);
