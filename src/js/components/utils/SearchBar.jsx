import React, { Component } from 'react';

// Material UI Componets
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

// Material UI Icons
import Search from '@material-ui/icons/Search';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit * 8,
  }
});

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "search": '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleSearch(e) {
    e.preventDefault();

    this.props.history.push("/search?s=" + this.state.search);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={8} justify="center" alignItems="center">
          <Grid item xs={6}>
            <form onSubmit={this.handleSearch}>
              <FormControl fullWidth>
                <InputLabel htmlFor="search">Search</InputLabel>
                <Input
                  type="text"
                  id="search"
                  name="search"
                  onChange={this.handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Searching"
                        onClick={this.handleSearch}
                      >
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </form>
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

      </div>
    );
  }
}

export default withStyles(styles)(SearchBar);
