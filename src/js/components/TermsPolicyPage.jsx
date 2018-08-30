import React, { Component } from 'react';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// Custom Components
import Container from './layout/Container';

// Common Style
import { root } from 'assets/jss/common.style';

const styles = theme => ({
  "root": root(theme),
  "paper": {
    padding: theme.spacing.unit * 4,
  }
});

class TermsPolicyPage extends Component {
  render() {
    const { classes } = this.props;
    
    return (
      <Container>
        <div className={classes.root}>
          <Grid container >
            <Grid item xs={12}>
              <Typography variant="display3" align="center" gutterBottom>Terms & Policy</Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="body1" align="center">
                  Terms & Policy Content
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(TermsPolicyPage);
