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

// Custom Components
import Container from './layout/Container';
import BusinessCard from './utils/BusinessCard';
import { loadFromStorage } from '../helpers/webStorage';
import webStorageTypes from '../constants/webStorage.types';
import Areas from '../constants/nanjing.areas';

// Actions
import { getBusinessList, clearBusinessList } from '../actions/business.actions.js';
import { getCategoriesList } from '../actions/category.actions.js';

const styles = theme => ({
  "button": {
    marginRight: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  "areasPopover": {
    width: 450,
    padding: theme.spacing.unit * 2,
  }
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
      "category": '',
      "categoryPopoverOpen": false,
      "areaPopoverOpen": false,
      "sortPopoverOpen": false,
    };

    this.state.myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR);

    this.loadMore = this.loadMore.bind(this);
    this.handleClickArea = this.handleClickArea.bind(this);
    this.handleClickOrderBy = this.handleClickOrderBy.bind(this);
    this.handleEventSwitch = this.handleEventSwitch.bind(this);
    this.handleOpenAreaPopover = this.handleOpenAreaPopover.bind(this);
    this.handleCloseAreaPopover = this.handleCloseAreaPopover.bind(this);
    this.handleOpenCategoryPopover = this.handleOpenCategoryPopover.bind(this);
    this.handleCloseCategoryPopover = this.handleCloseCategoryPopover.bind(this);
    this.handleOpenSortPopover = this.handleOpenSortPopover.bind(this);
    this.handleCloseSortPopover = this.handleCloseSortPopover.bind(this);
  }

  componentDidMount() {
    this.props.getBusinessList({
      limit: this.state.limit,
      filter: {
        category: this.props.match.params.slug,
      }
    })
    .then(response => {
      if (response) {
        this.setState({
          count: this.state.limit,
          hasMore: this.state.limit < response.totalCount,
        });
      }
    });

    this.props.categories.map(item => {
      if (item.enName === this.props.match.params.slug) {
        this.setState({
          category: item
        });
      }
    });

  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      this.props.getBusinessList({
        limit: this.state.limit,
        filter: {
          category: this.props.match.params.slug,
          area: this.state.area.code,
          event: this.state.event,
        },
        orderBy: this.state.orderBy,
      })
      .then(response => {
        if (response) {
          this.setState({
            count: this.state.limit,
            hasMore: this.state.limit < response.totalCount,
            categoryPopoverOpen: false,
          });
        }
      });

      this.props.categories.map(item => {
        if (item.enName === this.props.match.params.slug) {
          this.setState({
            category: item
          });
        }
      });
    }
  }

  componentWillUnmount() {
    this.props.clearBusinessList();
  }

  handleOpenCategoryPopover() {
    this.setState({
      categoryPopoverOpen: true,
    });
  }

  handleCloseCategoryPopover() {
    this.setState({
      categoryPopoverOpen: false,
    });
  }

  handleOpenAreaPopover() {
    this.setState({
      areaPopoverOpen: true
    });
  }

  handleCloseAreaPopover() {
    this.setState({
      areaPopoverOpen: false
    });
  }

  handleOpenSortPopover() {
    this.setState({
      sortPopoverOpen: true
    });
  }

  handleCloseSortPopover() {
    this.setState({
      sortPopoverOpen: false
    });
  }

  handleClickArea = item => e => {
    if (this.state.area.code !== item.code) {
      this.props.getBusinessList({
        limit: this.state.limit,
        filter: {
          category: this.state.category.enName,
          area: item.code,
          event: this.state.event,
        },
        orderBy: this.state.orderBy
      })
      .then(response => {
        if (response) {
          this.setState({
            count: this.state.limit,
            hasMore: this.state.limit < response.totalCount,
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
        filter: {
          category: this.state.category.enName,
          area: this.state.area.code,
          event: this.state.event,
        },
        orderBy: item
      })
      .then(response => {
        if (response) {
          this.setState({
            orderBy: item,
            count: this.state.limit,
            hasMore: this.state.limit < response.totalCount
          });
        }
      });
    }

    this.setState({
      sortPopoverOpen: false
    });
  }

  handleEventSwitch() {
    this.setState({
      event: !this.state.event,
    });

    this.props.getBusinessList({
      limit: this.state.limit,
      filter: {
        category: this.state.category.enName,
        area: this.state.area.code,
        event: !this.state.event,
      },
      orderBy: this.state.orderBy
    })
    .then(response => {
      if (response) {
        this.setState({
          count: this.state.limit,
          hasMore: this.state.limit < response.totalCount
        });
      }
    });
  }

  loadMore() {
    if (this.state.count < this.props.totalCount) {
      this.props.getBusinessList({
        limit: this.state.count + this.state.limit,
        filter: {
          category: this.state.category.enName,
          area: this.state.area.code,
          event: this.state.event,
        },
        search: this.state.search,
        orderBy: this.state.orderBy,
      })
      .then((response => {
        this.setState({
          count: this.state.count + this.state.limit,
          hasMore: this.state.count + this.state.limit < response.totalCount
        });
      }));
    }
  }

  render() {
    const { classes, businessList, categories } = this.props;
    let index;

    return (
      <Container>
        <div>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Button
                color="primary"
                variant="outlined"
                size="large"
                className={classes.button}
                onClick={this.handleOpenCategoryPopover}
                buttonRef={node => {
                  this.categoryAnchorEl = node;
                }}
              >
                {_.isEmpty(this.state.category) ? 'All' : this.state.category.krName}
              </Button>

              <Button
                color="primary"
                variant="outlined"
                size="large"
                className={classes.button}
                onClick={this.handleOpenAreaPopover}
                buttonRef={node => {
                  this.areasAnchorEl = node;
                }}
              >
                {
                  _.isEmpty(this.state.area) ? 'Area' : (this.state.area.cnName)
                }
              </Button>

              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={this.handleOpenSortPopover}
                className={classes.button}
                buttonRef={node => {
                  this.sortAnchorEl = node;
                }}
              >
                Sort by
              </Button>

              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={this.state.event}
                    onChange={this.handleEventSwitch}
                    value="event"
                  />
                }
                label="이벤트"
              />
            </Grid>
          </Grid>

          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={this.state.hasMore}
            loader={<div className="loader" key={0}>Loading ...</div>}
          >
            <Grid container spacing={16}>
              {
                _.isEmpty(businessList)
                ? <Grid item xs={12}><Typography variant="headline" align="center">None</Typography></Grid>
                : businessList.map(item => {
                    if (!_.isEmpty(this.state.myFavors)) {
                      index = this.state.myFavors.indexOf(item._id);
                    }

                    return (
                      <Grid item xs={3} key={item._id}>
                        <BusinessCard
                          history={this.props.history}
                          key={item._id}
                          bid={item._id}
                          title={item.krName}
                          enName={item.enName}
                          rating={item.ratingAverage}
                          thumbnailUri={item.thumbnailUri}
                          isFavor={(!_.isUndefined(index) && index > -1) ? true : false}
                        />
                      </Grid>
                    );
                  })
              }
            </Grid>
          </InfiniteScroll>

          <div>
            <Popover
              open={this.state.categoryPopoverOpen}
              anchorEl={this.categoryAnchorEl}
              onClose={this.handleCloseCategoryPopover}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <div>
                <Grid container className={classes.areasPopover}>
                  {
                    categories.map(item => (
                      <Grid item xs={4} key={item._id}>
                        <Link to={'/business/category/' + item.enName}>
                          <Button
                            color="primary"
                            variant={this.state.category.enName === item.enName ? 'raised' : 'text'}
                          >
                            {item.krName}
                          </Button>
                        </Link>
                      </Grid>

                    ))

                  }
                </Grid>
              </div>
            </Popover>

            <Popover
              open={this.state.areaPopoverOpen}
              anchorEl={this.areasAnchorEl}
              onClose={this.handleCloseAreaPopover}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <div>
                <Grid container className={classes.areasPopover}>
                  <Grid item xs={6}>
                    <Button
                      color="primary"
                      className={classes.button}
                      variant={_.isEmpty(this.state.area) ? 'raised' : 'text'}
                      onClick={this.handleClickArea('')}
                    >
                    All
                    </Button>
                  </Grid>
                  {
                    Areas.map(item =>
                      <Grid item xs={6} key={item.code}>
                        <Button
                          color="primary"
                          variant={this.state.area.code === item.code ? 'raised' : 'text'}
                          className={classes.button}
                          onClick={this.handleClickArea(item)}>
                          {item.cnName + '-' + item.pinyin}
                        </Button>
                      </Grid>
                    )
                  }
                </Grid>
              </div>
            </Popover>

            <Popover
              open={this.state.sortPopoverOpen}
              anchorEl={this.sortAnchorEl}
              onClose={this.handleCloseSortPopover}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <div>
                <MenuList role="menu">
                  <MenuItem selected={_.isEmpty(this.state.orderBy)} onClick={this.handleClickOrderBy('')}>
                    <ListItemText primary="Recommend" />
                  </MenuItem>
                  <MenuItem selected={this.state.orderBy === 'rating'} onClick={this.handleClickOrderBy('rating')}>
                    <ListItemText primary="Rating" />
                  </MenuItem>
                  <MenuItem selected={this.state.orderBy === 'new'} onClick={this.handleClickOrderBy('new')}>
                    <ListItemText primary="New" />
                  </MenuItem>
                </MenuList>
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
