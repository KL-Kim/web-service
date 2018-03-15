import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography';

const styles = theme => ({
  footer: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    marginLeft: 260,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    background: theme.palette.background.appBar
  }
});

class Footer extends Component{
  render() {
    const { classes } = this.props;
    return (
      <footer className={classes.footer}>
        <Grid container spacing={16} justify="center" alignItems="center" >
          <Grid item xs={12}>
            <Typography type="caption" align="center">
               Copyright 2018 iKoreaTown
            </Typography>
          </Grid>
        </Grid>
      </footer>
    );
  }
}

export default withStyles(styles)(Footer);
