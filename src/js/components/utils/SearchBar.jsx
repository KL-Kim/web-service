import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit * 8,
  }
});

class SearchBar extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <form noValidate autoComplete="off" >
          <Grid container spacing={8} justify="center" alignItems="center">
            <Grid item xs={7}>
              <TextField id="search" placeholder="Search placeholder..." fullWidth margin="normal" />
            </Grid>
            <Grid item xs={1}>
              <Button raised color="primary">Search</Button>
            </Grid>
          </Grid>
          <Grid container spacing={0} justify="center" alignItems="center">
            <Grid item xs={8}>
              <Grid container spacing={0} justify="center" alignItems="center">
                <Grid item xs={3}>
                  <Button color="primary">#Tag1</Button>
                </Grid>
                <Grid item xs={3}>
                  <Button color="primary">#Tag2</Button>
                </Grid>
                <Grid item xs={3}>
                  <Button color="primary">#Tag3</Button>
                </Grid>
                <Grid item xs={3}>
                  <Button color="primary">#Tag4</Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

export default withStyles(styles)(SearchBar);
