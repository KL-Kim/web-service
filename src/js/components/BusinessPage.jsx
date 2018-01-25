import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';

import Container from './Container'
import ReviewCard from './utils/ReviewCard';
import StoryCard from './utils/StoryCard';

import image from '../../css/logo.svg';

const business = {
  id: '1',
  title: 'SteakHouse',
  description: 'Awesome Steak House',
  rating: 5,
  phone: '123-1234-1234',
  district: 'Xianlin',
  address: '77 Massachusetts Ave, Cambridge, MA',
  price: '100 ~ 150',
  image: image,
  other: {
    businessTime: '11:00 ~ 02:00',
    Delivery: 'Yes',
    language: 'Korean',
    rest: 'No',
    payment: 'VISA, MasterCard',
    parking: 'Yes',
  },
  menu: ['Menu1: 100', 'Menu2: 200', 'Menu3: 300'],
};

const reviews = {
  id: '1',
  userId: '5a4ef8f5537cd042155581a3',
  businessId: '5a4ef8f5537cd042155581a3',
  businessName: 'SteakHouse',
  content: 'Very Delicious',
  rating: 5,
  good: 10,
  bad: 2,
};

const story = {
  id: '1',
  userId: '5a4ef8f5537cd042155581a3',
  businessId: '5a4ef8f5537cd042155581a3',
  businessName: 'SteakHouse',
  title: 'Tasting SteakHouse',
  content: 'Bla bla bla',
  commentCount: 10,
  good: 10,
  bad: 2
};

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 5,
    color: theme.palette.text.secondary
  },

  button: {
    margin: theme.spacing.unit,
  },
});

class BusinessPage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Grid container spacing={16} justify="center" alignItems="center">
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <img src={business.image} alt="business.title" />
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Typography type="title">{business.title}</Typography>
              <Typography type="body1">Rating: {business.rating}</Typography>
              <Typography type="body2">Phone: {business.phone}</Typography>
              <Typography type="body2">Address: {business.address}</Typography>
            </Paper>
          </Grid>
        </Grid>
        <Divider />
        <Grid container spacing={16} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography type="display3" align="center">
              Reviews
            </Typography>
          </Grid>
          <Grid item xs={12}>
              <Button color="primary">Rating</Button>
              <Button color="primary">Newest</Button>
              <Button color="primary">Most Useful</Button>
          </Grid>
          <Grid item xs={4}>
            <ReviewCard businessName={reviews.businessName}
              content={reviews.content}
              good={reviews.good}
              bad={reviews.bad}
            />
          </Grid>
          <Grid item xs={4}>
            <ReviewCard businessName={reviews.businessName}
              content={reviews.content}
              good={reviews.good}
              bad={reviews.bad}
            />
          </Grid>
          <Grid item xs={4}>
            <ReviewCard businessName={reviews.businessName}
              content={reviews.content}
              good={reviews.good}
              bad={reviews.bad}
            />
          </Grid>
        </Grid>
        <Grid container spacing={16} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography type="display3" align="center">
              Stories
            </Typography>
          </Grid><Grid item xs={12}>
              <Button color="primary">Newest</Button>
              <Button color="primary">Most Useful</Button>
          </Grid>
          <Grid item xs={4}>
            <StoryCard businessName={story.businessName}
              title={story.title}
              content={story.content}
              commentCount={story.commentCount}
              good={story.good}
              bad={story.bad}
            />
          </Grid>
          <Grid item xs={4}>
            <StoryCard businessName={story.businessName}
              title={story.title}
              content={story.content}
              commentCount={story.commentCount}
              good={story.good}
              bad={story.bad}
            />
          </Grid>
          <Grid item xs={4}>
            <StoryCard businessName={story.businessName}
              title={story.title}
              content={story.content}
              commentCount={story.commentCount}
              good={story.good}
              bad={story.bad}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withRouter(withStyles(styles)(BusinessPage));
