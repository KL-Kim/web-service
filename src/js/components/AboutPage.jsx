import React, { Component } from 'react';

// Material UI Componetns
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
  paper: {
    padding: theme.spacing.unit * 5,
  }
});

class AboutPage extends Component {
  render() {
    const { classes } = this.props;
    
    return (
      <Container>
        <div className={classes.root}>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography variant="display3" align="center">About us</Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="body1" align="center">
                  Founder & CEO: Tony Kim
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="display3" align="center">Contact us</Typography>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography variant="body1" align="center">
                  Telephone: 123-4567-8901
                </Typography>
                <Typography variant="body1" align="center">
                  Address: Bla Bla Bla
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(AboutPage);
