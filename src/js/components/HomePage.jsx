import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

import Container from './utils/Container';
import SearchBar from './utils/SearchBar';
import CategoryBar from './utils/CategoryBar';
import BusinessCard from './utils/BusinessCard';
import StoryCard from './utils/StoryCard';

// Mock data
const business = {
  id: '1',
  title: 'SteakHouse',
  description: 'Awesome Steak House',
  rating: 5
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
});

class HomePage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Container>
        <div>
          <Grid container spacing={16} justify="center" alignItems="center">
            <Grid item xs={12}>
              <Paper className={classes.paper} >
                <SearchBar />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper} >
                <CategoryBar />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Typography type="display3" gutterBottom align="center">
                Hot & New Bussiness
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <BusinessCard title={business.title} description={business.description} rating={business.rating} />
            </Grid>
            <Grid item xs={4}>
              <BusinessCard title={business.title} description={business.description} rating={business.rating} />
            </Grid>
            <Grid item xs={4}>
              <BusinessCard title={business.title} description={business.description} rating={business.rating} />
            </Grid>
          </Grid>
          <Grid container spacing={16} justify="center" alignItems="center">
            <Grid item xs={12}>
              <Typography type="display3" gutterBottom align="center">
                Featured Story
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <StoryCard title={story.title} content={story.content} commentCount={story.commentCount}  good={story.good} bad={story.bad} />
            </Grid>
            <Grid item xs={4}>
              <StoryCard title={story.title} content={story.content} commentCount={story.commentCount}  good={story.good} bad={story.bad} />
            </Grid>
            <Grid item xs={4}>
              <StoryCard title={story.title} content={story.content} commentCount={story.commentCount}  good={story.good} bad={story.bad} />
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default withRouter(withStyles(styles)(HomePage));
