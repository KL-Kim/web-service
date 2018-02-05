import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import SettingContainer from './SettingContainer';
import BusinessCard from '../utils/BusinessCard';


// Mock data
const business = {
  id: '1',
  title: 'SteakHouse',
  rating: 5
};

const styles = (theme) => ({

});

class FavorPage extends Component {
  render() {
    // const { classes } = this.props;

    return (
        <SettingContainer>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography type="display2" gutterBottom>
                Favor
              </Typography>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                <BusinessCard title={business.title} rating={business.rating}/>
              </Grid>
              <Grid item xs={3}>
                <BusinessCard title={business.title} />
              </Grid>
              <Grid item xs={3}>
                <BusinessCard title={business.title} />
              </Grid>
              <Grid item xs={3}>
                <BusinessCard title={business.title} />
              </Grid>
              <Grid item xs={3}>
                <BusinessCard title={business.title} />
              </Grid>
              <Grid item xs={3}>
                <BusinessCard title={business.title} />
              </Grid>
              <Grid item xs={3}>
                <BusinessCard title={business.title} />
              </Grid>
              <Grid item xs={3}>
                <BusinessCard title={business.title} />
              </Grid>
              <Grid item xs={3}>
                <BusinessCard title={business.title} />
              </Grid>
              <Grid item xs={3}>
                <BusinessCard title={business.title} />
              </Grid>
              <Grid item xs={3}>
                <BusinessCard title={business.title} />
              </Grid>
              <Grid item xs={3}>
                <BusinessCard title={business.title} />
              </Grid>
              <Grid item xs={3}>
                <BusinessCard title={business.title} />
              </Grid>
              <Grid item xs={3}>
                <BusinessCard title={business.title} />
              </Grid>
              <Grid item xs={3}>
                <BusinessCard title={business.title} />
              </Grid>
              <Grid item xs={3}>
                <BusinessCard title={business.title} />
              </Grid>
            </Grid>
          </Grid>
        </SettingContainer>
    );
  }
}

export default withStyles(styles, { withTheme: true })(FavorPage);
