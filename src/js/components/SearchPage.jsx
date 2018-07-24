import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'querystring';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Toolbar from '@material-ui/core/Toolbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';

import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';

// Material UI Icons
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Search from '@material-ui/icons/Search';

// Custom Components
import Container from './layout/Container';
import BusinessCard from './utils/BusinessCard';
import CustomButton from './utils/Button';
import SearchBar from './utils/SearchBar'

// Actions
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions';

// WebStorage
import { loadFromStorage, saveToStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

// Helpers
import searchCategoryOrTag from 'js/helpers/searchCategoryOrTag';
import saveSearchHistory from 'js/helpers/saveSearchHistory';

const queries = [
  '꼬치',
  '삼계탕',
  '병원',
  '수리',
]

const styles = theme => ({
  "paper": {
    padding: theme.spacing.unit * 2,
  },
  "section": {
    marginBottom: theme.spacing.unit * 4,
  },
  "categoryButton": {
    marginRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    fontSize: '1rem',
    minWidth: 100,
  },
  "popoverContainer": {
    width: 500,
    padding: theme.spacing.unit * 3,
  },
  "menuSection": {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    paddingTop: theme.spacing. unit * 2,
    paddingBottom: theme.spacing. unit * 2,
  },
  "menuItem": {
    textAlign: "center",
    marginBottom: theme.spacing.unit / 2,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
  "leftIcon": {
    marginRight: theme.spacing.unit,
  },
  "chip": {
    margin: theme.spacing.unit,
  },
});

class SearchPage extends Component {
  constructor(props) {
    super(props);

    const parsed = qs.parse(props.location.search.slice(1));

    this.state = {
      "search": '',
      "searchedQuery": '',
      "limit": 24,
      "count": 0,
      "categories": [],
      "selectedCategory": '',
      "areas": [],
      "area": '',
      "orderBy": '',
      "event": false,
      "hasMore": false,
      "filterPopoverOpen": false,
      "searchCategoryResponse": [],
      "searchTagResponse": [],
      "searchHistory": [],
    };

    this.state.myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleClickCategory = this.handleClickCategory.bind(this);
    this.handleClickArea = this.handleClickArea.bind(this);
    this.handleClickOrderBy = this.handleClickOrderBy.bind(this);
    this.handleEventSwitch = this.handleEventSwitch.bind(this);
    this.handleOpenFilterPopover = this.handleOpenFilterPopover.bind(this);
    this.handleCloseFilterPopover = this.handleCloseFilterPopover.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    const searchHistory = loadFromStorage(webStorageTypes.WEB_STORAGE_SEARCH_HISTORY) || [];

    this.setState({
      searchHistory: searchHistory.reverse().slice(),
    });
  }

  componentWillUnmount() {
    this.props.clearBusinessList();
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
        searchCategoryResponse: categories.slice(),
        searchTagResponse: tags.slice(),
      });
    }
  }

  handleClickCategory = slug => e => {
    if (this.state.selectedCategory !== slug) {
      this.props.getBusinessList({
        limit: this.state.limit,
        category: slug,
        area: this.state.area.code,
        event: this.state.event,
        orderBy: this.state.orderBy,
        search: this.state.search,
      })
      .then(response => {
        if (response) {
          this.setState({
            selectedCategory: slug,
            count: response.list.length,
            hasMore: response.list.length < response.totalCount
          });
        }
      });
    }
  }

  handleClickArea = area => e => {
    if (this.state.area.code !== area.code) {
      this.props.getBusinessList({
        limit: this.state.limit,
        category: this.state.selectedCategory,
        area: area.code,
        event: this.state.event,
        orderBy: this.state.orderBy,
        search: this.state.search,
      })
      .then(response => {
        if (response) {
          this.setState({
            area: area,
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
        this.setState({
          areaPopoverOpen: false,
        });
      });
    }
  }

  handleClickOrderBy = item => e => {
    if (this.state.orderBy !== item) {
      this.props.getBusinessList({
        limit: this.state.limit,
        category: this.state.selectedCategory,
        area: this.state.area.code,
        event: this.state.event,
        orderBy: item,
        search: this.state.search,
      })
      .then(response => {
        if (response) {
          this.setState({
            orderBy: item,
            count: response.list.length,
            hasMore: response.list.length < response.totalCount
          });
        }
        this.setState({
          sortPopoverOpen: false,
        });
      });
    }
  }

  handleEventSwitch() {
    this.props.getBusinessList({
      limit: this.state.limit,
      category: this.state.selectedCategory,
      area: this.state.area.code,
      event: !this.state.event,
      orderBy: this.state.orderBy,
      search: this.state.search,
    })
    .then(response => {
      if (response) {
        this.setState({
          count: response.list.length,
          hasMore: response.list.length < response.totalCount
        });
      }
    });

    this.setState({
      event: !this.state.event,
    })
  }

  handleOpenFilterPopover() {
    this.setState({
      filterPopoverOpen: true,
    });
  }

  handleCloseFilterPopover() {
    this.setState({
      filterPopoverOpen: false,
    });
  }

  handleSearch(e) {
    e.preventDefault();

    if (this.state.search) {
      this.props.getBusinessList({
        limit: this.state.limit,
        search: this.state.search,
      })
      .then(response => {
        if (response) {
          const categories = [];
          const categoryIds = [];
          const areas = [];
          const areaIds = [];
          let cIndex, aIndex;

          response.list.map(business => {
            cIndex = categoryIds.indexOf(business.category._id);

            if (cIndex < 0) {
              categories.push(business.category);
              categoryIds.push(business.category._id);
            }

            aIndex = areaIds.indexOf(business.address.area.code)

            if (aIndex < 0) {
              areaIds.push(business.address.area.code);
              areas.push(business.address.area);
            }

            return ;
          });

          this.setState({
            searchedQuery: this.state.search,
            categories: categories.slice(),
            areas: areas.slice(),
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
      });

      saveSearchHistory(this.state.search);
    }
  }

  loadMore() {
    if (this.state.count < this.props.totalCount) {
      this.props.getBusinessList({
        limit: this.state.count + this.state.limit,
        category: this.state.selectedCategory,
        area: this.state.area.code,
        event: this.state.event,
        search: this.state.search,
        orderBy: this.state.orderBy,
    })
    .then((response => {
        this.setState({
          count: response.list.length,
          hasMore: response.list.length < response.totalCount
        });
      }));
    }
  }

  render() {
    const { classes, businessList } = this.props;

    return (
      <Container>
        <div>

          <div className={classes.section}>
            <Paper className={classes.paper}>
              <form onSubmit={this.handleSearch}>
                <FormControl fullWidth>
                  <Input
                    type="search"
                    name="search"
                    placeholder="Search..."
                    autoComplete="off"
                    defaultValue={this.state.search}
                    disableUnderline
                    onChange={this.handleChange}
                    startAdornment={
                      <InputAdornment position="start" classes={{ root: classes.adornmentRoot }}>
                        <IconButton
                          disableRipple
                          aria-label="Toggle password visibility"
                          onClick={this.handleSearch}
                        >
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </form>
            </Paper>
          </div>

          {
            this.state.search
              ? null
              : <div className={classes.section}>
                  <Grid container spacing={24}>
                    <Grid item xs={6}>
                      <Paper>
                          <List subheader={<ListSubheader component="div">Recent Searches</ListSubheader> }>
                            {
                              _.isEmpty(this.state.searchHistory)
                                ? <ListItem>
                                    <ListItemText primary={'None'} />
                                  </ListItem>
                                : this.state.searchHistory.map((item, index) => (
                                  <ListItem key={index} button>
                                    <ListItemText primary={item} />
                                  </ListItem>
                                ))
                            }
                          </List>
                        </Paper>
                    </Grid>

                    <Grid item xs={6}>
                      <Paper>
                        <List subheader={<ListSubheader component="div">Popular Searches</ListSubheader> }>
                          {
                            queries.map((item, index) => (
                              <ListItem key={index} button>
                                <ListItemText primary={item} />
                              </ListItem>
                            ))
                          }
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                </div>
          }



          {
            _.isEmpty(this.state.searchCategoryResponse)
              ? null
              : <div className={classes.section}>
                  <Typography variant="title" gutterBottom>Category: '{this.state.search}'</Typography>
                  <Divider />
                  <br />
                  {
                    this.state.searchCategoryResponse.map((item) => (
                      <Link to={"/business/category/" + item.enName} key={item._id}>
                        <CustomButton
                          round
                          className={classes.categoryButton}
                        >
                          {item.krName}
                        </CustomButton>
                      </Link>
                    ))
                  }
                  <br />
                </div>
          }

          {
            _.isEmpty(this.state.searchTagResponse)
              ? null
              : <div className={classes.section}>
                  <Typography variant="title" gutterBottom>Tag: '{this.state.search}'</Typography>
                  <Divider />
                  <br />
                  {
                    this.state.searchTagResponse.map((item) => (
                      <Link to={"/business/tag/" + item.enName} key={item._id}>
                        <CustomButton
                          round
                          className={classes.categoryButton}
                        >
                          #{item.krName}
                        </CustomButton>
                      </Link>
                    ))
                  }
                  <br />
                </div>
          }

          {
            _.isEmpty(businessList)
              ? null
              : <div>
                  <Grid container justify="space-between" alignItems="flex-end">
                    <Grid item>
                      <Typography variant="title">

                          Business: "{this.state.searchedQuery}"

                      </Typography>
                    </Grid>

                    <Grid item>
                      <Button
                        color="primary"
                        onClick={this.handleOpenFilterPopover}
                        buttonRef={node => {
                          this.filterAnchorEl = node;
                        }}
                      >
                        Filter
                        {
                          this.state.filterPopoverOpen
                            ? <ArrowDropUp />
                            : <ArrowDropDown />
                        }
                      </Button>
                    </Grid>
                  </Grid>

                  <br />
                  {
                    this.props.isFetching
                      ? <LinearProgress style={{ height: 1 }} />
                      : <Divider />
                  }
                  <br />

                  <div>
                    <CustomButton
                      color={_.isEmpty(this.state.selectedCategory) ? "primary" : 'white'}
                      round
                      className={classes.categoryButton}
                      onClick={this.handleClickCategory('')}
                    >
                      All
                    </CustomButton>

                    {
                      _.isEmpty(this.state.categories)
                        ? null
                        : this.state.categories.map(item => (
                          <CustomButton
                            key={item._id}
                            color={this.state.selectedCategory === item.enName ? "primary" : 'white'}
                            round
                            className={classes.categoryButton}
                            onClick={this.handleClickCategory(item.enName)}
                          >
                            {item.krName}
                          </CustomButton>
                        ))
                    }
                  </div>

                  <br />

                  {
                    <InfiniteScroll
                      pageStart={0}
                      loadMore={this.loadMore}
                      hasMore={this.state.hasMore}
                      loader={<div style={{ textAlign: 'center' }} key={0}>
                                <CircularProgress size={30} />
                              </div>}
                    >
                      <Grid container spacing={16} style={{ marginBottom: 12 }}>
                        {
                          businessList.map(item => (
                            <Grid item xs={4} key={item._id}>
                              <BusinessCard
                                bid={item._id}
                                title={item.krName}
                                enName={item.enName}
                                rating={item.ratingAverage}
                                thumbnailUri={item.thumbnailUri}
                                category={item.category}
                                tags={item.tags}
                                event={item.event}
                                myFavors={this.state.myFavors}
                              />
                            </Grid>
                          ))
                        }
                      </Grid>
                    </InfiniteScroll>
                  }
                </div>
          }



          <div id="modal-container">
            <Popover
              open={this.state.filterPopoverOpen}
              anchorEl={this.filterAnchorEl}
              onClose={this.handleCloseFilterPopover}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <div className={classes.popoverContainer}>
                <Grid container className={classes.menuSection}>
                  <Grid item xs={3}>
                    <Typography variant="title">District</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Grid container justify="flex-start">
                      <Grid item xs={4} className={classes.menuItem}>
                        <Button
                          fullWidth
                          size="small"
                          color={_.isEmpty(this.state.area) ? 'primary' : 'default'}
                          variant={_.isEmpty(this.state.area) ? 'outlined' : 'text'}
                          onClick={this.handleClickArea('')}
                        >
                          All
                        </Button>
                      </Grid>
                      {
                        _.isEmpty(this.state.areas) ? ''
                          : this.state.areas.map(item =>
                            <Grid item xs={4} key={item.code}>
                              <Button
                                fullWidth
                                key={item.code}
                                size="small"
                                color={this.state.area.code === item.code ? 'primary' : 'default'}
                                variant={this.state.area.code === item.code ? 'outlined' : 'text'}
                                onClick={this.handleClickArea(item)}
                              >
                                {item.name}
                              </Button>
                            </Grid>
                          )
                      }
                    </Grid>
                  </Grid>
                </Grid>
                <Divider />

                <Grid container className={classes.menuSection} alignItems="center">
                  <Grid item xs={3}>
                    <Typography variant="title">Order by</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <Grid container justify="space-around">
                      <Grid item xs={4} className={classes.menuItem}>
                        <Button
                          fullWidth
                          color={_.isEmpty(this.state.orderBy) ? 'primary' : 'default'}
                          size="small"
                          variant={_.isEmpty(this.state.orderBy) ? 'outlined' : 'text'}
                          onClick={this.handleClickOrderBy('')}
                        >
                          Recommend
                        </Button>
                      </Grid>
                      <Grid item xs className={classes.menuItem}>
                        <Button
                          fullWidth
                          color={this.state.orderBy === 'rating' ? 'primary' : 'default'}
                          size="small"
                          variant={this.state.orderBy === 'rating' ? 'outlined' : 'text'}
                          onClick={this.handleClickOrderBy('rating')}
                        >
                          Rating
                        </Button>
                      </Grid>
                      <Grid item xs className={classes.menuItem}>
                        <Button
                          fullWidth
                          color={this.state.orderBy === 'new' ? 'primary' : 'default'}
                          size="small"
                          variant={this.state.orderBy === 'new' ? 'outlined' : 'text'}
                          onClick={this.handleClickOrderBy('new')}
                        >
                          New
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider />

                <Grid container className={classes.menuSection} alignItems="center">
                  <Grid item xs={3}>
                    <Typography variant="title">Event</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <FormControl>
                      <Switch
                        color="primary"
                        checked={this.state.event}
                        onChange={this.handleEventSwitch}
                        value="event"
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Grid container justify="flex-end" alignItems="center">
                  <Grid item>
                    <Button variant="raised" size="small" color="primary" onClick={this.handleCloseFilterPopover}>
                      Ok
                    </Button>
                  </Grid>
                </Grid>

              </div>
            </Popover>
          </div>
        </div>
      </Container>
    )
  }

}

SearchPage.propTypes = {
  "classes": PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "businessList": state.businessReducer.businessList,
    "totalCount": state.businessReducer.totalCount,
    "categories": state.categoryReducer.categoriesList,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, {
  getBusinessList,
  clearBusinessList,
})(withStyles(styles)(SearchPage));
