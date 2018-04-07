import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

import Container from './utils/Container';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 5,
    color: theme.palette.text.secondary
  }
});

class AboutPage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography type="display3" align="center">About us</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography type="body1" align="center">
                Founder & CEO: Tony Kim
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Typography type="display3" align="center">Contact us</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography type="body1" align="center">
                Telephone: 123-4567-8901
              </Typography>
              <Typography type="body1" align="center">
                Address: Bla Bla Bla
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles)(AboutPage);
