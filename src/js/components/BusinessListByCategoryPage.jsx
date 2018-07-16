import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';

// Material UI Icons
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Restaurant from '@material-ui/icons/Restaurant';

// Custom Components
import Container from './layout/Container';
import BusinessCard from './utils/BusinessCard';
import BusinessCardAlt from './utils/BusinessCardAlt';
import CustomButton from './utils/Button';

// Actions
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions.js';
import { getCategoriesList } from 'js/actions/category.actions.js';

// WebStorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

const styles = theme => ({
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
    marginBottom: theme.spacing.unit / 2,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },
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
});

class BusinessListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "limit": 24,
      "orderBy": '',
      "event": false,
      "hasMore": false,
      "count": 0,
      "area": '',
      "areas": [],
      "category": '',
      "categoryPopoverOpen": false,
      "areaPopoverOpen": false,
      "sortPopoverOpen": false,
      "filterPopoverOpen": false,
    };

    this.state.myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

    this.loadMore = this.loadMore.bind(this);
    this.handleClickArea = this.handleClickArea.bind(this);
    this.handleClickOrderBy = this.handleClickOrderBy.bind(this);
    this.handleSwithEvent = this.handleSwithEvent.bind(this);
    this.handleOpenFilterPopover = this.handleOpenFilterPopover.bind(this);
    this.handleCloseFilterPopover = this.handleCloseFilterPopover.bind(this);
    this.hanldeShowAllAreas = this.hanldeShowAllAreas.bind(this);
  }

  componentDidMount() {
    this.props.getBusinessList({
      limit: this.state.limit,
      category: this.props.match.params.slug,
    })
    .then(response => {
      if (response) {
        const areas = [];
        const areaIds = [];
        let aIndex;

        response.list.map(business => {
          aIndex = areaIds.indexOf(business.address.area.code)

          if (aIndex < 0) {
            areaIds.push(business.address.area.code);
            areas.push(business.address.area);
          }

          return '';
        });

        this.setState({
          areas: areas.slice(),
          count: response.list.length,
          hasMore: response.list.length < response.totalCount,
        });
      }
    });

    this.props.getCategoriesList()
      .then(response => {
        if (response) {
          _.find(response, item => {
            if (item.enName === this.props.match.params.slug) {
              this.setState({
                category: item
              });

              return item;
            }
          });
        }
      });

    // this.props.categories.map(item => {
    //   if (item.enName === this.props.match.params.slug) {
    //     this.setState({
    //       category: item
    //     });
    //   }
    // });

  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      this.props.getBusinessList({
        limit: this.state.limit,
        category: this.props.match.params.slug,
      })
      .then(response => {
        if (response) {
          const areas = [];
          const areaIds = [];
          let aIndex;

          response.list.map(business => {
            aIndex = areaIds.indexOf(business.address.area.code)

            if (aIndex < 0) {
              areaIds.push(business.address.area.code);
              areas.push(business.address.area);
            }

            return '';
          });

          this.setState({
            areas: areas.slice(),
            area: '',
            "orderBy": '',
            "event": false,
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
      });

      this.props.getCategoriesList()
        .then(response => {
          if (response) {
            _.find(response, item => {
              if (item.enName === this.props.match.params.slug) {
                this.setState({
                  category: item
                });

                return item;
              }
            });
          }
        });
    }
  }

  componentWillUnmount() {
    this.props.clearBusinessList();
  }

  handleClickArea = item => e => {
    if (this.state.area.code !== item.code) {
      this.props.getBusinessList({
        limit: this.state.limit,
        category: this.state.category.enName,
        area: item.code,
        event: this.state.event,
        orderBy: this.state.orderBy
      })
      .then(response => {
        if (response) {
          this.setState({
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
      });

      this.setState({
        area: item,
        areaPopoverOpen: false,
      });
    }
  }

  handleClickOrderBy = item => e => {
    if (this.state.orderBy !== item) {
      this.props.getBusinessList({
        limit: this.state.limit,
        category: this.state.category.enName,
        area: this.state.area.code,
        event: this.state.event,
        orderBy: item
      })
      .then(response => {
        if (response) {
          this.setState({
            orderBy: item,
            count: response.list.length,
            hasMore: response.list.length < response.totalCount
          });
        }
      });
    }

    this.setState({
      sortPopoverOpen: false
    });
  }

  handleSwithEvent() {
    this.setState({
      event: !this.state.event,
    });

    this.props.getBusinessList({
      limit: this.state.limit,
      category: this.state.category.enName,
      area: this.state.area.code,
      event: !this.state.event,
      orderBy: this.state.orderBy
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

  handleOpenFilterPopover() {
    this.setState({
      filterPopoverOpen: true,
    });
  }

  handleCloseFilterPopover() {
    this.setState({
      filterPopoverOpen: false,
      areaCount: 5,
    });
  }

  hanldeShowAllAreas() {
    this.setState({
      areaCount: Number.MAX_VALUE
    });
  }

  loadMore() {
    if (this.state.count < this.props.totalCount) {
      this.props.getBusinessList({
        limit: this.state.count + this.state.limit,
        category: this.state.category.enName,
        area: this.state.area.code,
        event: this.state.event,
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
    const { classes, businessList, categories } = this.props;

    return (
      <Container>
        <div>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="display1" className={classes.flex}>
                {
                  _.isEmpty(this.state.category) ? '' : this.state.category.krName
                }
              </Typography>
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

          <div >
            {
              this.props.categories.map(item => (item.parent === this.state.category.code)
                ? (
                    <Link to={"/business/category/" + item.enName} key={item._id}>
                      <CustomButton
                        round
                        color="primary"
                        className={classes.categoryButton}
                      >
                        {item.krName}
                      </CustomButton>
                    </Link>
                  )
                : ''
              )
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
            <Grid container spacing={24}>
              {
                _.isEmpty(businessList)
                  ? (this.props.isFetching
                      ? ''
                      :
                        <Grid item xs={12}>
                          <Typography variant="body1" align="center">--- None ---</Typography>
                        </Grid>)
                  : businessList.map(item => (
                      <Grid item xs={4} key={item._id}>
                        <BusinessCardAlt
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
                    <Typography variant="title">Category</Typography>
                  </Grid>

                  <Grid item xs={9}>
                    <Grid container>
                    {
                      categories.map(item => item.parent ? '' : (
                        <Grid item xs={4} key={item._id} className={classes.menuItem}>
                          <Link to={'/business/category/' + item.enName}>
                            <Button
                              fullWidth
                              size="small"
                              color={this.state.category.code === item.code ? 'primary' : 'default'}
                              variant={this.state.category.code === item.code ? 'outlined' : 'text'}
                            >
                              {item.krName}
                            </Button>
                          </Link>
                        </Grid>
                      ))
                    }
                    </Grid>
                  </Grid>
                </Grid>
                <Divider />

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
                        this.state.areas.map((item, index) =>
                          <Grid item xs={4} key={item.code} className={classes.menuItem}>
                            <Button
                              fullWidth
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
                          fullWidth
                          size="small"
                          color={_.isEmpty(this.state.orderBy) ? 'primary' : 'default'}
                          variant={_.isEmpty(this.state.orderBy) ? 'outlined' : 'text'}
                          onClick={this.handleClickOrderBy('')}
                        >
                          Recommend
                        </Button>
                      </Grid>
                      <Grid item xs={4} className={classes.menuItem}>
                        <Button
                          fullWidth
                          size="small"
                          color={this.state.orderBy === 'rating' ? 'primary' : 'default'}
                          variant={this.state.orderBy === 'rating' ? 'outlined' : 'text'}
                          onClick={this.handleClickOrderBy('rating')}
                        >
                          Rating
                        </Button>
                      </Grid>
                      <Grid item xs={4} className={classes.menuItem}>
                        <Button
                          fullWidth
                          size="small"
                          color={this.state.orderBy === 'new' ? 'primary' : 'default'}
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
                        onChange={this.handleSwithEvent}
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
    );
  }
}

BusinessListPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "businessList": PropTypes.array.isRequired,
  "totalCount": PropTypes.number.isRequired,
  "categories": PropTypes.array.isRequired,
  "isFetching": PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "businessList": state.businessReducer.businessList,
    "totalCount": state.businessReducer.totalCount,
    "categories": state.categoryReducer.categoriesList,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getBusinessList, getCategoriesList, clearBusinessList })(withStyles(styles)(BusinessListPage));
