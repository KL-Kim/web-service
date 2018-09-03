import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Img from 'react-image';
import ContentLoader from 'react-content-loader';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';

import Skeleton from './Skeleton';

const styles = theme => ({
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
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
      <div >
        <Img
          className={classes.image}
          loader={<Skeleton />}
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
