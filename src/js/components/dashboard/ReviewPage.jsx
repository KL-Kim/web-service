import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import Dashboard from './Dashboard';
import ReviewCard from '../utils/ReviewCard';

// Mock data
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

class ReviewPage extends Component {
  render() {
    return (
      <Dashboard>
        <Grid container spacing={16} justify="center" alignItems="center">
              <Grid item xs={8}>
                <Typography type="display3" gutterBottom>
                  My Reviews
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <ReviewCard businessName={reviews.businessName}
                  content={reviews.content}
                  good={reviews.good}
                  bad={reviews.bad}
                />
              </Grid>
              <Grid item xs={6}>
                <ReviewCard businessName={reviews.businessName}
                  content={reviews.content}
                  good={reviews.good}
                  bad={reviews.bad}
                />
              </Grid>
              <Grid item xs={6}>
                <ReviewCard businessName={reviews.businessName}
                  content={reviews.content}
                  good={reviews.good}
                  bad={reviews.bad}
                />
              </Grid>
              <Grid item xs={6}>
                <ReviewCard businessName={reviews.businessName}
                  content={reviews.content}
                  good={reviews.good}
                  bad={reviews.bad}
                />
              </Grid>
        </Grid>
      </Dashboard>
    );
  }
}

export default ReviewPage;
