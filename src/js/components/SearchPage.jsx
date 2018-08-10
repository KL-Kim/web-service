import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
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
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';

// Material UI Icons
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Search from '@material-ui/icons/Search';

// Custom Components
import Container from './layout/Container';
import CustomButton from './utils/Button';
import BusinessPanel from './sections/BusinessPanel';
import HorizontalScrollBar from 'js/components/utils/HorizontalScrollBar';

// Actions
import { favorOperation } from 'js/actions/user.actions';
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions';

// WebStorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

// Helpers
import searchCategoryOrTag from 'js/helpers/searchCategoryOrTag';
import saveSearchHistory from 'js/helpers/saveSearchHistory';

const queries = [
  '꼬치',
  '삼계탕',
  '병원',
  '수리',
  '이따바',
];

const styles = theme => ({
  "section": {
    marginBottom: theme.spacing.unit * 4,
  },
  "paper": {
    padding: theme.spacing.unit * 2,
  },
  "chipBar": {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  "chip": {
    marginRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    fontSize: theme.typography.pxToRem(16),
    width: 'auto',
    display: 'inline-block',
  },
  "popoverContainer": {
    maxWidth: 400,
    padding: theme.spacing.unit * 2,
  },
  "divider": {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class SearchPage extends Component {
  constructor(props) {
    super(props);

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

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSelectCategory = this.handleSelectCategory.bind(this);
    this.handleSelectArea = this.handleSelectArea.bind(this);
    this.handleSelectOrder = this.handleSelectOrder.bind(this);
    this.handleToggleEvent = this.handleToggleEvent.bind(this);
    this.handleOpenFilterPopover = this.handleOpenFilterPopover.bind(this);
    this.handleCloseFilterPopover = this.handleCloseFilterPopover.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
  }

  componentDidMount() {
    const searchHistory = loadFromStorage(webStorageTypes.WEB_STORAGE_SEARCH_HISTORY) || [];

    this.setState({
      searchHistory: searchHistory.reverse().slice(),
    });
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

  handleSelectCategory = slug => e => {
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

  handleSelectArea = area => e => {
    if (this.state.area.code !== area.code) {
      this.setState({
        area: area,
      });
    }
  }

  handleSelectOrder = item => e => {
    if (this.state.orderBy !== item) {
      this.setState({
        orderBy: item,
      });
    }
  }

  handleToggleEvent() {
    this.setState({
      event: !this.state.event,
    });
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
    if (this.state.hasMore) {
      this.props.getBusinessList({
        limit: this.state.count + this.state.limit,
        category: this.state.selectedCategory,
        area: this.state.area.code,
        event: this.state.event,
        search: this.state.search,
        orderBy: this.state.orderBy,
      })
      .then(response => {
        if (response) {
          this.setState({
            count: response.list.length,
            hasMore: response.list.length < response.totalCount
          });
        }
      });
    }
  }

  handleSubmitFilter() {
    this.props.getBusinessList({
      limit: this.state.limit,
      category: this.state.selectedCategory,
      area: this.state.area.code,
      event: this.state.event,
      search: this.state.search,
      orderBy: this.state.orderBy,
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
      filterPopoverOpen: false,
    });
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
                    autoFocus
                    disableUnderline
                    autoComplete="off"
                    placeholder="Search..."
                    onChange={this.handleChange}
                    startAdornment={
                      <InputAdornment position="start" classes={{ root: classes.adornmentRoot }}>
                        <IconButton
                          disableRipple
                          aria-label="Search Icon"
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
                  <Grid container spacing={16}>
                    <Grid item xs={12} sm={6}>
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

                    <Grid item xs={12} sm={6}>
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
                  </Grid>
                </div>
          }

          {
            _.isEmpty(this.state.searchCategoryResponse) || _.isEmpty(this.state.search)
              ? null
              : <div className={classes.section}>
                  <Paper className={classes.paper}>
                    <Typography variant="title" gutterBottom>Category: '{this.state.search}'</Typography>
                    <div>
                      {
                        this.state.searchCategoryResponse.map((item) => (
                          <Link to={"/business/category/" + item.enName} key={item._id}>
                            <CustomButton
                              round
                              className={classes.chip}
                            >
                              {item.krName}
                            </CustomButton>
                          </Link>
                        ))
                      }
                    </div>
                  </Paper>
                </div>
          }

          {
            _.isEmpty(this.state.searchTagResponse) || _.isEmpty(this.state.search)
              ? null
              : <div className={classes.section}>
                  <Paper className={classes.paper}>
                    <Typography variant="title" gutterBottom>Tag: '{this.state.search}'</Typography>
                    <div>
                      {
                        this.state.searchTagResponse.map((item) => (
                          <Link to={"/business/tag/" + item.enName} key={item._id}>
                            <CustomButton
                              round
                              className={classes.chip}
                            >
                              #{item.krName}
                            </CustomButton>
                          </Link>
                        ))
                      }
                    </div>
                  </Paper>
                </div>
          }

          {
            _.isEmpty(businessList) || _.isEmpty(this.state.search)
              ? null
              : <div>
                  <Grid container justify="space-between" alignItems="flex-end">
                    <Grid item>
                      <Typography variant="title" gutterBottom>
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
                  <Divider />
                  
                  <div className={classes.chipBar}>
                    <HorizontalScrollBar>
                      <CustomButton
                        color={_.isEmpty(this.state.selectedCategory) ? "primary" : 'white'}
                        round
                        className={classes.chip}
                        onClick={this.handleSelectCategory('')}
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
                              className={classes.chip}
                              onClick={this.handleSelectCategory(item.enName)}
                            >
                              {item.krName}
                            </CustomButton>
                          ))
                      }
                    </HorizontalScrollBar>
                  </div>

                  <BusinessPanel
                    hasMore={this.state.hasMore}
                    loadMore={this.loadMore} 
                    businessList={businessList}
                    totalCount={this.props.totalCount}
                    isLoggedIn={this.props.isLoggedIn}
                    userId={_.isEmpty(this.props.user) ? '' : this.props.user._id}
                    favorOperation={this.props.favorOperation}
                    clearBusinessList={this.props.clearBusinessList}
                    showNoMore
                  />
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
                <Grid container spacing={8} alignItems="center">
                  <Grid item xs={12}>
                    <Typography variant="body2">District</Typography>
                  </Grid>

                  <Grid item>
                    <Button
                      fullWidth
                      size="small"
                      color={_.isEmpty(this.state.area) ? 'primary' : 'default'}
                      variant={_.isEmpty(this.state.area) ? 'outlined' : 'text'}
                      onClick={this.handleSelectArea('')}
                    >
                      All
                    </Button>
                  </Grid>

                  {
                    this.state.areas.map(item =>
                      <Grid item key={item.code}>
                        <Button
                          fullWidth
                          size="small"
                          color={this.state.area.code === item.code ? 'primary' : 'default'}
                          variant={this.state.area.code === item.code ? 'outlined' : 'text'}
                          onClick={this.handleSelectArea(item)}
                        >
                          {item.name}
                        </Button>
                      </Grid>
                    )
                  }

                  <Grid item xs={12}>
                    <Divider className={classes.divider} />
                    <Typography variant="body2">Order by</Typography>
                  </Grid>
                  
                  <Grid item>
                    <Button
                      fullWidth
                      size="small"
                      color={_.isEmpty(this.state.orderBy) ? 'primary' : 'default'}
                      variant={_.isEmpty(this.state.orderBy) ? 'outlined' : 'text'}
                      onClick={this.handleSelectOrder('')}
                    >
                      Recommend
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      fullWidth
                      size="small"
                      color={this.state.orderBy === 'rating' ? 'primary' : 'default'}
                      variant={this.state.orderBy === 'rating' ? 'outlined' : 'text'}
                      onClick={this.handleSelectOrder('rating')}
                    >
                      Rating
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      fullWidth
                      size="small"
                      color={this.state.orderBy === 'new' ? 'primary' : 'default'}
                      variant={this.state.orderBy === 'new' ? 'outlined' : 'text'}
                      onClick={this.handleSelectOrder('new')}
                    >
                      New
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider className={classes.divider} />
                  </Grid>

                  <Grid item>
                    <Typography variant="body2">Event</Typography>
                  </Grid>

                  <Grid item>
                    <FormControl margin="none">
                      <Switch
                        color="primary"
                        checked={this.state.event}
                        onChange={this.handleToggleEvent}
                        value="event"
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider className={classes.divider} />
                <Grid container spacing={8} justify="flex-end" alignItems="center">
                  <Grid item>
                    <Button size="small" onClick={this.handleCloseFilterPopover}>
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button color="primary" size="small" onClick={this.handleSubmitFilter}>
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
  "businessList": PropTypes.array.isRequired,
  "totalCount": PropTypes.number.isRequired,
  "isFetching": PropTypes.bool,
  "user": PropTypes.object,
  "isLoggedIn": PropTypes.bool.isRequired,

  // Methods
  "getBusinessList": PropTypes.func.isRequired,
  "clearBusinessList": PropTypes.func.isRequired,
  "favorOperation": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "businessList": state.businessReducer.businessList,
    "totalCount": state.businessReducer.totalCount,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, {
  getBusinessList,
  clearBusinessList,
  favorOperation,
})(withStyles(styles)(SearchPage));
