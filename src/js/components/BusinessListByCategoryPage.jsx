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

// Custom Components
import Container from './layout/Container';
import CustomButton from './utils/Button';
import BusinessPanel from './sections/BusinessPanel';

// Actions
import { openLoginDialog } from 'js/actions/app.actions';
import { favorOperation } from 'js/actions/user.actions';
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions.js';
import { getCategoriesList } from 'js/actions/category.actions.js';

const styles = theme => ({
  "chip": {
    marginRight: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    fontSize: '1rem',
    width: 'auto',
    display: 'inline-block',
  },
  "horizontalScrollBar": {
    width: 'auto',
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    paddingBottom: theme.spacing.unit * 2,
    [theme.breakpoints.down('sx')]: {
      whiteSpace: 'normal',
    },
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
    marginBottom: theme.spacing.unit / 2,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
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
      "area": {},
      "areas": [],
      "tagSlug": '',
      "tags": [],
      "category": {},
      "filterPopoverOpen": false,
    };

    this.loadMore = this.loadMore.bind(this);
    this.handleClickTag = this.handleClickTag.bind(this);
    this.handleClickArea = this.handleClickArea.bind(this);
    this.handleClickOrderBy = this.handleClickOrderBy.bind(this);
    this.handleSwithEvent = this.handleSwithEvent.bind(this);
    this.handleOpenFilterPopover = this.handleOpenFilterPopover.bind(this);
    this.handleCloseFilterPopover = this.handleCloseFilterPopover.bind(this);
    this.hanldeShowAllAreas = this.hanldeShowAllAreas.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.slug) {
      this.props.getBusinessList({
        'limit': this.state.limit,
        'category': this.props.match.params.slug,
      })
      .then(response => {
        if (response) {
          const areas = [];
          const areaIds = [];
          let aIndex, tIndex;

          const tags = [];
          const tagsIds = [];

          response.list.map(business => {
            if (_.isEmpty(business)) return ;

            aIndex = areaIds.indexOf(business.address.area.code);

            if (aIndex < 0) {
              areaIds.push(business.address.area.code);
              areas.push(business.address.area);
            }

            business.tags.map(tag => {
              if (_.isEmpty(tag)) return ;

              tIndex = tagsIds.indexOf(tag.code);

              if (tIndex < 0) {
                tagsIds.push(tag.code);
                tags.push(tag);
              }
            });

            return null;
          });

          this.setState({
            areas: [...areas],
            tags: [...tags],
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
              }
            });
          }
        });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      this.props.getBusinessList({
        'limit': this.state.limit,
        'category': this.props.match.params.slug,
      })
      .then(response => {
        if (response) {
          const areas = [];
          const areaIds = [];
          let aIndex, tIndex;

          const tags = [];
          const tagsIds = [];

          response.list.map(business => {
            if (_.isEmpty(business)) return ;

            aIndex = areaIds.indexOf(business.address.area.code);

            if (aIndex < 0) {
              areaIds.push(business.address.area.code);
              areas.push(business.address.area);
            }

            business.tags.map(tag => {
              if (_.isEmpty(tag)) return ;

              tIndex = tagsIds.indexOf(tag.code);

              if (tIndex < 0) {
                tagsIds.push(tag.code);
                tags.push(tag);
              }
            });

            return null;
          });

          this.setState({
            areas: [...areas],
            tags: [...tags],
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

  handleClickTag = slug => e => {
    this.props.getBusinessList({
      tag: slug,
      limit: this.state.limit,
      category: this.state.category.enName,
      area: this.state.area.code,
      event: this.state.event,
      orderBy: this.state.orderBy,
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
      tagSlug: slug,
    });
  }

  handleClickArea = item => e => {
    if (this.state.area.code !== item.code) {
      this.props.getBusinessList({
        limit: this.state.limit,
        category: this.state.category.enName,
        tag: this.state.tagSlug,
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
      });
    }
  }

  handleClickOrderBy = item => e => {
    if (this.state.orderBy !== item) {
      this.props.getBusinessList({
        limit: this.state.limit,
        category: this.state.category.enName,
        tag: this.state.tagSlug,
        area: this.state.area.code,
        event: this.state.event,
        orderBy: item
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
        orderBy: item,
      });
    }
  }

  handleSwithEvent() {
    this.props.getBusinessList({
      limit: this.state.limit,
      category: this.state.category.enName,
      tag: this.state.tagSlug,
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
      areaCount: 5,
    });
  }

  hanldeShowAllAreas() {
    this.setState({
      areaCount: Number.MAX_VALUE
    });
  }

  loadMore() {
    if (this.state.hasMore) {
      this.props.getBusinessList({
        limit: this.state.count + this.state.limit,
        category: this.state.category.enName,
        tag: this.state.tagSlug,
        area: this.state.area.code,
        event: this.state.event,
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
    const { classes } = this.props;

    return (
      <Container>
        <div>
          <Grid container justify="space-between" alignItems="flex-end">
            <Grid item>
              <Typography variant="display1">
                {
                  _.isEmpty(this.state.category) ? null : this.state.category.krName
                }
              </Typography>
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

          {
            this.props.isFetching
              ? <LinearProgress style={{ height: 1 }} />
              : <Divider />
          }
          <br />

          <div className={classes.horizontalScrollBar}>
            <CustomButton
              round
              color={!this.state.tagSlug ? "primary" : "white"}
              className={classes.chip}
              onClick={this.handleClickTag()}
            >
              All
            </CustomButton>
            {
              this.state.tags.map(item => (
                <CustomButton
                  key={item._id}
                  round
                  color={this.state.tagSlug === item.enName ? "primary" : "white"}
                  className={classes.chip}
                  onClick={this.handleClickTag(item.enName)}
                >
                  #{item.krName}
                </CustomButton>
              ))
            }
          </div>
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
            showNoMore
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
                    <Button variant="raised" color="primary" size="small" onClick={this.handleCloseFilterPopover}>
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
  "isFetching": PropTypes.bool,
  "user": PropTypes.object,
  "isLoggedIn": PropTypes.bool.isRequired,

  // Methods
  "getBusinessList": PropTypes.func.isRequired,
  "clearBusinessList": PropTypes.func.isRequired,
  "getCategoriesList": PropTypes.func.isRequired,
  "openLoginDialog": PropTypes.func.isRequired,
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
  getCategoriesList, 
  openLoginDialog,
  favorOperation,
})(withStyles(styles)(BusinessListPage));
