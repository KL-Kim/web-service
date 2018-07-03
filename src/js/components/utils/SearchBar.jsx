import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Manager, Reference, Popper } from 'react-popper';

// Material UI Componets
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Portal from '@material-ui/core/Portal';
import Paper from '@material-ui/core/Paper';
import Collapse from '@material-ui/core/Collapse';

// Material UI Icons
import Search from '@material-ui/icons/Search';

// WebStorage
import { loadFromStorage, saveToStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

// Actions
import { getCategoriesList } from 'js/actions/category.actions';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 8,
  },
  guide: {
    width: 400,
    margin: 3,
    padding: theme.spacing.unit * 2,
  },
});

const options = (<Button>Options</Button>)

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "search": '',
      "categories": [],
      "searchPopoverOpen": false,
      "result": null,
      typing: false,
      typingTimeout: 0,
    };

    const searchHistory = loadFromStorage(webStorageTypes.SEARCH_HISTORY) || [];
    this.state.searchHistory = searchHistory.reverse();

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleFocusInput = this.handleFocusInput.bind(this);
    this.handlePopoverClose = this.handlePopoverClose.bind(this);
    this.searchCategoryOrTag = this.searchCategoryOrTag.bind(this);
  }

  handleChange(e) {
    const { value } = e.target

    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState({
      search: value,
      typing: false,
      typingTimeout: setTimeout(() => {
        this.searchCategoryOrTag(value);
      }, 300),
    });
  }

  searchCategoryOrTag(query) {
    console.log(query);
  }

  handleFocusInput(e) {
    this.setState({
      searchPopoverOpen: true,
    });
  }

  handlePopoverClose() {
    this.setState({
      searchPopoverOpen: false,
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
          <Grid item xs={8}>
            <ClickAwayListener onClickAway={this.handlePopoverClose}>
            <Manager>
              <Reference>
                {({ref}) => {
                  return (<form onSubmit={this.handleSearch} ref={ref}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="search">Search</InputLabel>
                      <Input
                        autoComplete="off"
                        type="search"
                        id="search"
                        name="search"
                        onFocus={this.handleFocusInput}
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
                  </form>)
                }}
              </Reference>
              <Portal>
                <Popper
                  placement="bottom-start"
                  eventsEnabled={true}
                  style={{
                    backgroundColor: "grey"
                  }}
                >
                  {({ref, style, placement, arrowProps}) =>
                    <div ref={ref} style={style} data-placement={placement}>
                      <Collapse
                        in={this.state.searchPopoverOpen}
                        id="search-collapse"
                        style={{ transformOrigin: '0 0 0' }}
                        timeout={{enter: 300, exit: 0}}
                      >
                        <Paper className={classes.guide}>
                          <div>
                            <Typography variant="title" gutterBottom>Recent search</Typography>
                            {
                              this.state.searchHistory.map((item, index) => (
                                <MenuItem>{item}</MenuItem>
                              ))
                            }
                          </div>
                        </Paper>
                      </Collapse>
                      <div ref={arrowProps.ref} style={arrowProps.style} />
                    </div>
                  }
                </Popper>
              </Portal>
            </Manager>
            </ClickAwayListener>

          </Grid>
        </Grid>
      </div>
    );
  }
}

SearchBar.propTypes = {
  "classes": PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "categories": state.categoryReducer.categoriesList,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getCategoriesList })(withStyles(styles)(SearchBar));
