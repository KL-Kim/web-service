import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Img from 'react-image';



import config from '../../config/config';

// Default image
import image from '../../../css/ikt-icon.gif';


class Thumbnail extends Component {
  render() {
    const thumbnail = _.isEmpty(this.props.image)
                        ? image
                        : config.API_GATEWAY_ROOT + '/' + image.hd;

    return (
      <Img src={thumbnail} style={{ width: '100%' }} />
    );
  }
}

Thumbnail.propTypes = {
  "image": PropTypes.object,
};

export default Thumbnail;
