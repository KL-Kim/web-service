import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import Dashboard from './Dashboard';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class ChangePasswordPage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Dashboard>
        <Grid container className={classes.root} spacing={16} justify="center" alignItems="top">
          <Grid item xs={12}>
            <Typography type="display3" gutterBottom>
              Change password
            </Typography>
            <Button raised color="primary">Send links</Button>
          </Grid>
        </Grid>
      </Dashboard>
    );
  }
}

export default withStyles(styles)(ChangePasswordPage);
