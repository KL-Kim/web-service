import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

import Container from './Container'
import ReviewCard from './utils/ReviewCard';
import BusinessCard from './utils/BusinessCard';

import image from '../../css/logo.svg';

const business = {
  id: '1',
  image: image,
  title: 'SteakHouse',
  description: 'Awesome Steak House',
  rating: 5,
  phone: '123-1234-1234',
  address: '77 Massachusetts Ave, Cambridge, MA',
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
  author: 'Kim',
  content: 'The stories, ideas and lessons are enough to fill a year’s worth of articles, but for now I wanted to share the ideas straight from the people creating the disruption. Below are my most impactful takeaways from the last few days: No one belongs here more than me. When in doubt of your surroundings, this is the mantra. The ultimate currency is being uncool. Be vulnerably you and watch how you connect. The opposite of scarcity is enough. Be confident that if you’re doing work t matters to you, you are enough. There is no comparison. Unused creativity is not benign – it turns into grief. Do something with it. Get in the arena, show up, do your thing and don’t be afraid to get your ass kicked a little bit. Who you are will always trump who you think people want you to be. You can’t control if someone loves you back. Love them anyway.',
  commentCount: 10,
  date: 'Jan 24, 2018',
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

class StoryPage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Grid container spacing={16} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography type="display3" gutterBottom align="center">
              {story.title}
            </Typography>
            <Typography type="title" gutterBottom align="center">
              By {story.author}
            </Typography>
            <Typography type="caption" gutterBottom align="center">
              {story.date}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Paper className={classes.paper}>
              <Typography type="body1">
                {story.content}
              </Typography>
            </Paper>
          </Grid>

        </Grid>

        <Grid container spacing={16} justify="center">
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              Author: {story.author}
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <BusinessCard title={business.title} rating={business.rating}/>
          </Grid>
        </Grid>

        <Grid container spacing={16} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography type="display1" gutterBottom align="center">
              Comments
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <ReviewCard businessName={reviews.businessName}
              content={reviews.content}
              good={reviews.good}
              bad={reviews.bad}
            />
          </Grid>
          <Grid item xs={8}>
            <ReviewCard businessName={reviews.businessName}
              content={reviews.content}
              good={reviews.good}
              bad={reviews.bad}
            />
          </Grid>
          <Grid item xs={8}>
            <ReviewCard businessName={reviews.businessName}
              content={reviews.content}
              good={reviews.good}
              bad={reviews.bad}
            />
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withRouter(withStyles(styles)(StoryPage));
