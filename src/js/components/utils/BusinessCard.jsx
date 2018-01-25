import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Card, { CardMedia, CardContent, CardActions } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import image from '../../../css/logo.svg';

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
    const { classes } = this.props;
    return (
      <div>
        <Card className={classes.card}>
          <CardMedia className={classes.media}
            image={image}
            title={this.props.title}
          />
          <CardContent>
            <Typography type="headline" component="h2">{this.props.title}</Typography>
            <Typography type="body1">Rating: { this.props.rating }</Typography>
          </CardContent>
          <CardActions>
            <Button dense color="primary">Share</Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(BusinessCard);
