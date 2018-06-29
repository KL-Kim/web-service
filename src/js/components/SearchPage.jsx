import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'querystring';
import { connect } from 'react-redux';
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
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';

// Material UI Icons
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

// Custom Components
import Container from './layout/Container';
import BusinessCard from './utils/BusinessCard';
import CustomButton from './utils/Button';

// Actions
import { getBusinessList } from 'js/actions/business.actions.js';

// WebStorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

const styles = theme => ({
  "categoryButton": {
    marginRight: theme.spacing.unit * 2,
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
  }
});

class SearchPage extends Component {
  constructor(props) {
    super(props);

    const parsed = qs.parse(props.location.search.slice(1));

    this.state = {
      "limit": 12,
      "count": 0,
      "categories": [],
      "categorySlug": '',
      "areas": [],
      "area": '',
      "orderBy": '',
      "event": false,
      "hasMore": false,
      "filterPopoverOpen": false,
      ...parsed,
    };

    this.state.myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

    this.handleClickCategory = this.handleClickCategory.bind(this);
    this.handleClickArea = this.handleClickArea.bind(this);
    this.handleClickOrderBy = this.handleClickOrderBy.bind(this);
    this.handleEventSwitch = this.handleEventSwitch.bind(this);
    this.handleOpenFilterPopover = this.handleOpenFilterPopover.bind(this);
    this.handleCloseFilterPopover = this.handleCloseFilterPopover.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    if (this.state.s && !_.isEmpty(this.state.s)) {
      this.props.getBusinessList({
        limit: this.state.limit,
        search: this.state.s,
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


            return '';
          });

          this.setState({
            categories: categories.slice(),
            areas: areas.slice(),
            count: response.list.length,
            hasMore: response.list.length < this.props.totalCount,
          });
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      const parsed = qs.parse(this.props.location.search.slice(1));

      this.props.getBusinessList({
        limit: this.state.limit,
        search: parsed.s,
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

            return '';
          });

          this.setState({
            s: parsed.s,
            categories: categories.slice(),
            areas: areas.slice(),
            count: response.list.length,
            hasMore: response.list.length < this.props.totalCount
          });
        }
      });

    }
  }

  handleClickCategory = slug => e => {
    if (this.state.categorySlug !== slug) {
      this.props.getBusinessList({
        limit: this.state.limit,
        category: slug,
        area: this.state.area.code,
        event: this.state.event,
        orderBy: this.state.orderBy,
        search: this.state.s,
      })
      .then(response => {
        if (response) {
          this.setState({
            categorySlug: slug,
            count: response.list.length,
            hasMore: response.list.length < this.props.totalCount
          });
        }
      });
    }
  }

  handleClickArea = area => e => {
    if (this.state.area.code !== area.code) {
      this.props.getBusinessList({
        limit: this.state.limit,
        category: this.state.categorySlug,
        area: area.code,
        event: this.state.event,
        orderBy: this.state.orderBy,
        search: this.state.s,
      })
      .then(response => {
        if (response) {
          this.setState({
            area: area,
            count: response.list.length,
            hasMore: response.list.length < this.props.totalCount,
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
        category: this.state.categorySlug,
        area: this.state.area.code,
        event: this.state.event,
        orderBy: item,
        search: this.state.s,
      })
      .then(response => {
        if (response) {
          this.setState({
            orderBy: item,
            count: response.list.length,
            hasMore: response.list.length < this.props.totalCount
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
      category: this.state.categorySlug,
      area: this.state.area.code,
      event: !this.state.event,
      orderBy: this.state.orderBy,
      search: this.state.s,
    })
    .then(response => {
      if (response) {
        this.setState({
          count: response.list.length,
          hasMore: response.list.length < this.props.totalCount
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

  loadMore() {
    if (this.state.count < this.props.totalCount) {
      this.props.getBusinessList({
        limit: this.state.count + this.state.limit,
        category: this.state.categorySlug,
        area: this.state.area.code,
        event: this.state.event,
        search: this.state.s,
        orderBy: this.state.orderBy,
    })
    .then((response => {
        this.setState({
          count: response.list.length,
          hasMore: response.list.length < this.props.totalCount
        });
      }));
    }
  }

  render() {
    const { classes, businessList } = this.props;

    return (
      <Container>
        <div>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="display1">Search: {this.state.s}</Typography>
            </Grid>
            <Grid item>
              <Button
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

          {
            this.props.isFetching
              ? <LinearProgress style={{ height: 1 }} />
              : <Divider />
          }
          <br />

          <div>
            <CustomButton
              color={_.isEmpty(this.state.categorySlug) ? "primary" : 'white'}
              round
              className={classes.categoryButton}
              onClick={this.handleClickCategory('')}
            >
              All
            </CustomButton>
            {
              _.isEmpty(this.state.categories) ? ''
                : this.state.categories.map((item) => (
                  <CustomButton
                    key={item._id}
                    color={this.state.categorySlug === item.enName ? "primary" : 'white'}
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

          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={this.state.hasMore}
            loader={<div style={{ textAlign: 'center' }} key={0}>
                      <CircularProgress size={30} />
                    </div>}
          >
            <Grid container spacing={16}>
              {
                _.isEmpty(businessList)
                  ? <Grid item xs={12}>
                      <Typography variant="headline" align="center">None</Typography>
                    </Grid>
                  : businessList.map(item => (
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

          <div>
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
                    <Grid container justify="space-between">
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
                    <Button variant="raised" color="primary" onClick={this.handleCloseFilterPopover}>
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

export default connect(mapStateToProps, { getBusinessList })(withStyles(styles)(SearchPage));
