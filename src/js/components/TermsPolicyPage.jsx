import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';

import Container from './Container';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 5,
    color: theme.palette.text.secondary
  }
});

class TermsPolicyPage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography type="display3" align="center">Terms & Policy</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography type="body1" align="center">
                Terms & Policy Content
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles)(TermsPolicyPage);
