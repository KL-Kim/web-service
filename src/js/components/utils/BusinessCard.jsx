import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Stars from 'react-stars';
import { withStyles } from 'material-ui/styles';
import Card, { CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import config from '../../config/config';
import image from '../../../css/ikt-icon.gif';

const styles = {
  // card: {
  //   maxWidth: 345,
  // },
  media: {
    height: 200,
  },
};

class BusinessCard extends Component {
  render() {
    const { classes, thumbnailUri } = this.props;
    const thumbnail = _.isEmpty(thumbnailUri) ? image : config.API_GATEWAY_ROOT + '/' +thumbnailUri.hd;

    return (
      <div>
        <Card className={classes.card}>
          <CardMedia className={classes.media}
            image={thumbnail}
            title={this.props.title}
          />
          <CardContent>
            <Typography type="title">{this.props.title}</Typography>
            <Stars count={5} size={20} value={this.props.rating} edit={false} />
          </CardContent>
          <CardActions>
            <Button color="primary">Share</Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

BusinessCard.propTypes = {
  "classes": PropTypes.object.isRequired,
  "title": PropTypes.string.isRequired,
  "rating": PropTypes.number,
  "thumbnail": PropTypes.object,
};

export default withStyles(styles)(BusinessCard);
