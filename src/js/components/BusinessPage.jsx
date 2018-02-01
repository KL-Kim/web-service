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
  id: '000000001',
  category: 'french',
  tags: 'steak',
  rating: 4.5,
  title: 'Steak House',
  description: 'Awesome steak, impressive.',
  phone: ['025-1234-1234', '123-1234-1234'],
  address: '仙林文枢东路7号晴天广场2F (청은마트 2층)',
  coordinate: '32.0968400000,118.9135000000',
  price: '100 ~ 150',
  status: 'open',
  views: '12345',
  serviceTime: '11:00am ~ 02:00am',
  delivery: true,
  korean: true,
  rest: '연중무휴',
  payment: ['VISA', 'Master Card', 'Union pay', 'Alipay'],
  menu: [{name: 'steak', price: 100, hot: true, new: false}],
  businessImageUri: image,
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
              <img src={business.businessImageUri} alt="business.title" />
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
