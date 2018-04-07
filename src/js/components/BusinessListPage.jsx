import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';

import Container from './utils/Container';
import BusinessCard from './utils/BusinessCard';
import BusinessFilter from './utils/BusinessFilter';

// Mock data
const business = {
  id: '1',
  title: 'SteakHouse',
  description: 'Awesome Steak House',
  rating: 5
};

const styles = theme => ({});

class BusinessListPage extends Component {
  render() {
    return (
      <Container>
        <div>
          <Grid container spacing={16} justify="center">
            <Grid item xs={12}>
              <BusinessFilter />
            </Grid>
          </Grid>
          <Grid container spacing={16} justify="center">
            <Grid item xs={3}>
              <BusinessCard title={business.title} rating={business.rating}/>
            </Grid>
            <Grid item xs={3}>
              <BusinessCard title={business.title} rating={business.rating}/>
            </Grid>
            <Grid item xs={3}>
              <BusinessCard title={business.title} rating={business.rating}/>
            </Grid>
            <Grid item xs={3}>
              <BusinessCard title={business.title} rating={business.rating}/>
            </Grid>
            <Grid item xs={3}>
              <BusinessCard title={business.title} rating={business.rating}/>
            </Grid>
            <Grid item xs={3}>
              <BusinessCard title={business.title} rating={business.rating}/>
            </Grid>
            <Grid item xs={3}>
              <BusinessCard title={business.title} rating={business.rating}/>
            </Grid>
            <Grid item xs={3}>
              <BusinessCard title={business.title} rating={business.rating}/>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(BusinessListPage);
