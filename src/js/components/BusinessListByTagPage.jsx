import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import CustomButton from './utils/Button';
import BusinessPanel from './sections/BusinessPanel';
import HorizontalScrollBar from './sections/HorizontalScrollBar';

// Actions
import { openLoginDialog } from 'js/actions/app.actions';
import { favorOperation } from 'js/actions/user.actions';
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions';
import { getTagsList } from 'js/actions/tag.actions';

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
    marginBottom: theme.spacing.unit / 2,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  }
});

class BusinessListByTag extends Component {
  constructor(props) {
    super(props);

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
      "tag": {},
    };

    this.handleClickCategory = this.handleClickCategory.bind(this);
    this.handleClickArea = this.handleClickArea.bind(this);
    this.handleClickOrderBy = this.handleClickOrderBy.bind(this);
    this.handleEventSwitch = this.handleEventSwitch.bind(this);
    this.handleOpenFilterPopover = this.handleOpenFilterPopover.bind(this);
    this.handleCloseFilterPopover = this.handleCloseFilterPopover.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.props.getBusinessList({
      limit: this.state.limit,
      tag: this.props.match.params.slug,
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
          hasMore: response.list.length < response.totalCount,
        });
      }
    });

    this.props.tags.map(item => {
      if (item.enName === this.props.match.params.slug) {
        this.setState({
          tag: item
        });
      }
    });

    this.props.getTagsList()
      .then(response => {
        if (response) {
          _.find(response, item => {
            if (item.enName === this.props.match.params.slug) {
              this.setState({
                tag: item
              });
            }
          });
        }
      });
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      this.props.getBusinessList({
        limit: this.state.limit,
        tag: this.props.match.params.slug,
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


            return null;
          });

          this.setState({
            categories: categories.slice(),
            areas: areas.slice(),
            area: '',
            "orderBy": '',
            "event": false,
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
      });

      this.props.getTagsList()
        .then(response => {
          if (response) {
            _.find(response, item => {
              if (item.enName === this.props.match.params.slug) {
                this.setState({
                  tag: item
                });
              }
            });
          }
        });
    }
  }

  handleClickCategory = slug => e => {
    if (this.state.categorySlug !== slug) {
      this.props.getBusinessList({
        limit: this.state.limit,
        tag: this.props.match.params.slug,
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
        tag: this.props.match.params.slug,
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
        tag: this.props.match.params.slug,
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
            hasMore: response.list.length < response.totalCount,
            sortPopoverOpen: false,
          });
        }
      });
    }
  }

  handleEventSwitch() {
    this.props.getBusinessList({
      limit: this.state.limit,
      tag: this.props.match.params.slug,
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

  loadMore() {
    if (this.state.hasMore) {
      this.props.getBusinessList({
        limit: this.state.count + this.state.limit,
        tag: this.props.match.params.slug,
        category: this.state.categorySlug,
        area: this.state.area.code,
        event: this.state.event,
        search: this.state.s,
        orderBy: this.state.orderBy,
    })
    .then(response => {
        this.setState({
          count: response.list.length,
          hasMore: response.list.length < response.totalCount
        });
      });
    }
  }

  render() {
    const { classes, businessList } = this.props;

    return (
      <Container>
        <div>
          <Grid container justify="space-between" alignItems="flex-end">
            <Grid item>
              <Typography variant="display1">#{this.state.tag.krName}</Typography>
            </Grid>
            <Grid item>
              <Button
                variant="text"
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

          <br/>

          {
            this.props.isFetching
              ? <LinearProgress style={{ height: 1 }} />
              : <Divider />
          }
          <br />

          <HorizontalScrollBar>
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
          </HorizontalScrollBar>

          <br />

          <BusinessPanel
            hasMore={this.state.hasMore}
            loadMore={this.loadMore} 
            businessList={this.props.businessList}
            totalCount={this.props.totalCount}
            isLoggedIn={this.props.isLoggedIn}
            userId={_.isEmpty(this.props.user) ? '' : this.props.user._id}
            favorOperation={this.props.favorOperation}
            openLoginDialog={this.props.openLoginDialog}
            clearBusinessList={this.props.clearBusinessList}
          />

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
                    <Grid container justify="flex-start">
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

BusinessListByTag.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object,
  "isLoggedIn": PropTypes.bool.isRequired,
  "businessList": PropTypes.array.isRequired,
  "totalCount": PropTypes.number.isRequired,
  "isFetching": PropTypes.bool,
  "tags": PropTypes.array.isRequired,

  // Methods
  "getTagsList": PropTypes.func.isRequired,
  "getBusinessList": PropTypes.func.isRequired,
  "clearBusinessList": PropTypes.func.isRequired,
  "openLoginDialog": PropTypes.func.isRequired,
  "favorOperation": PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "businessList": state.businessReducer.businessList,
    "totalCount": state.businessReducer.totalCount,
    "isFetching": state.businessReducer.isFetching,
    "tags": state.tagReducer.tagsList,
  };
};

export default connect(mapStateToProps, { 
  getBusinessList, 
  clearBusinessList,
  getTagsList,
  openLoginDialog,
  favorOperation, 
})(withStyles(styles)(BusinessListByTag));
