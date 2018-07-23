import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { Manager, Reference, Popper } from 'react-popper';
import _ from 'lodash';

// Material UI Componets
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
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

// Helpers
import searchCategoryOrTag from 'js/helpers/searchCategoryOrTag';

const styles = theme => ({
  "guide": {
    margin: 4,
    padding: theme.spacing.unit * 2,
  },
  "bootstrapRoot": {
    padding: 0,
    borderRadius: 4,
    border: '2px solid #fff',
  },
  "bootstrapInput": {
    fontSize: 20,
    paddingLeft: theme.spacing.unit * 2,
    '&:focus': {
      backgroundColor: theme.palette.common.white,
    }
  },
  "adornmentRoot":{
    maxHeight: '3em',
    margin: 0,
  },
});

const options = (<Button>Options</Button>);

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "search": '',
      "categories": [],
      "tags": [],
      "searchPopoverOpen": false,
      "result": null,
      typing: false,
      typingTimeout: 0,
      searchHistory: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleFocusInput = this.handleFocusInput.bind(this);
    this.handlePopoverClose = this.handlePopoverClose.bind(this);
    this.searchCategoryOrTag = this.searchCategoryOrTag.bind(this);
  }

  componentDidMount() {
    const searchHistory = loadFromStorage(webStorageTypes.WEB_STORAGE_SEARCH_HISTORY) || [];

    this.state.searchHistory = searchHistory.reverse().slice();
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
    if (query) {
      const categories = searchCategoryOrTag('category', query);
      const tags = searchCategoryOrTag('tag', query);

      this.setState({
        categories: categories.slice(),
        tags: tags.slice(),
      });
    } else {
      this.setState({
        categories: [],
        tags: [],
      });
    }
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

  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <ClickAwayListener onClickAway={this.handlePopoverClose}>
          <Manager>
            <Reference>
              {({ ref }) => {
                return (
                  <div ref={ref}>
                    <form onSubmit={this.handleSearch}>
                      <FormControl style={{ width: this.props.width }}>
                        <Input
                          classes={{
                            root: classes.bootstrapRoot,
                            input: classes.bootstrapInput,
                          }}
                          id="search-bar"
                          type="text"
                          name="search"
                          placeholder="Search..."
                          autoComplete="off"
                          defaultValue={this.state.search}
                          disableUnderline
                          onFocus={this.handleFocusInput}
                          onChange={this.handleChange}
                          startAdornment={
                            <InputAdornment position="start" classes={{ root: classes.adornmentRoot }}>
                              <IconButton
                                disableRipple
                                aria-label="Toggle password visibility"
                                onClick={this.handleSearch}
                                style={{
                                  paddingLeft: 4,
                                  paddingRight: 4,
                                }}
                              >
                                <Search />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </form>
                  </div>
                );
              }}
            </Reference>
            <Portal>
              <Popper
                placement="bottom"
                eventsEnabled={true}
                positionFixed={true}
              >
                {({ ref, style, placement, arrowProps }) =>
                  <div ref={ref} style={{...style, zIndex: 1201}} data-placement={placement}>
                    <Collapse
                      in={this.state.searchPopoverOpen}
                      id="search-collapse"
                      style={{ transformOrigin: '0 0 0' }}
                      timeout={{ enter: 200, exit: 0 }}
                    >
                      <Paper className={classes.guide} style={{ width: this.props.width }}>
                        <div>

                          {
                            this.state.categories.map(item => (
                              <Link to={"/business/category/" + item.enName} key={item._id}>
                                <MenuItem>#{item.krName}</MenuItem>
                              </Link>
                            ))
                          }

                          {
                            this.state.tags.map(item => (
                              <Link to={"/business/tag/" + item.enName} key={item._id}>
                                <MenuItem>#{item.krName}</MenuItem>
                              </Link>
                            ))
                          }
                          <Typography variant="title" gutterBottom>Recent search</Typography>
                          {
                            this.state.searchHistory.map((item, index) => (
                              <MenuItem key={index}>{item}</MenuItem>
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
      </div>
    );
  }
}

SearchBar.propTypes = {
  "classes": PropTypes.object.isRequired,
  "width": PropTypes.number.isRequired,
};

export default withRouter(withStyles(styles)(SearchBar));
