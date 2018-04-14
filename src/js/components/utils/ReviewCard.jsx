import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Stars from 'react-stars';
import { withStyles } from 'material-ui/styles';
import Card, {CardContent, CardActions, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import ThumbUp from 'material-ui-icons/ThumbUp';
import ThumbDown from 'material-ui-icons/ThumbDown';

import image from '../../../css/ikt-icon.gif';

const styles = {
  card: {
    // width: 500,
  },
  media: {
    height: 200,
  },
};

class ReviewCard extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Card className={classes.card}>
          <CardMedia className={classes.media}
            image={image}
          />
          <CardContent>
            <Stars count={5} size={20} value={this.props.rating} edit={false} />
            <Typography component="p" gutterBottom>{this.props.content}</Typography>
            <div>
              <ThumbUp color="primary" /> {this.props.upVote}
              <ThumbDown /> {this.props.downVote}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

ReviewCard.propTypes = {
  "classes": PropTypes.object.isRequired,
  "rating": PropTypes.number.isRequired,
  "content": PropTypes.string,
  "upVote": PropTypes.number,
  "downVote": PropTypes.number,
};

export default withStyles(styles)(ReviewCard);
