import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Search from '@material-ui/icons/Search';

// Custom Components
import Container from './layout/Container';

// Common Style
import { root } from 'assets/jss/common.style';

const styles = theme => ({
  "root": root(theme),
  "paper": {
    padding: theme.spacing.unit * 2,
  }
});

class NotFoundPage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Container>
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid item xs={12}>
              <Typography variant="display1" align="center" gutterBottom>404 Not found</Typography>
            </Grid>
            <Grid item>
              <Link to="/search">
                <Button variant="raised" color="primary">
                  <Search />
                  Search
                </Button>
              </Link>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(NotFoundPage);
