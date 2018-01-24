import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper'

import Dashboard from './Dashboard';

// Mock data
import image from '../../../css/logo.svg';

const user = {
  "username": "regularUser0",
  "email": "user0@abc.com",
  "address": "Bla bla bla bla bla",
  "gender": "male",
  "lastName": "Kim",
  "firstName": "Tony",
  "userStatus": "normal",
  "profilePhotoUri": image,
  "point": 0,
  "role": "regular"
};


const styles = (theme) => ({

});

class PhotoPage extends Component {

  render() {
    const { classes } = this.props;

    return (
      <Dashboard>
        <Grid container className={classes.root} spacing={16} justify="center" alignItems="center">
              <Grid item xs={6}>
                <Typography type="display3" gutterBottom>
                  Photo
                </Typography>
                <Paper className={classes.paper}>
                  <img src={user.profilePhotoUri} alt={user.username} className={classes.profilePhoto} />
                </Paper>
              </Grid>
            </Grid>
      </Dashboard>
    );
  }
}

export default withStyles(styles)(PhotoPage);
