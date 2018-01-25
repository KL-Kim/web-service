import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const styles = theme => ({});

class BusinessFilter extends Component {
  render() {
    return (
      <Grid container spacing={8} align="center">
        <Grid item>
          <Typography type="title">Category:</Typography>
          <Button color="primary">Category1</Button>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(BusinessFilter);
