import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Card, {CardContent, CardActions } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

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
          <CardContent>
            <Typography type="headline" component="h2">{this.props.businessName}</Typography>
            <Typography component="p">Rating: {this.props.rating}</Typography>
            <Typography component="p">{this.props.content}</Typography>
            <Typography component="p">Good: {this.props.good}</Typography>
            <Typography component="p">Bad: {this.props.bad}</Typography>
          </CardContent>
          <CardActions>
            <Button dense color="primary">Edit</Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default withStyles(styles)(ReviewCard);
