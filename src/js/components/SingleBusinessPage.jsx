import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Img from 'react-image';
import Stars from 'react-stars';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';
import { Map, Marker, Circle } from 'react-amap';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

// Material UI Icons
import Whatshot from '@material-ui/icons/Whatshot';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Favorite from '@material-ui/icons/Favorite';
import LocalPhone from '@material-ui/icons/LocalPhone';
import Place from '@material-ui/icons/Place';

// Custom Components
import Container from './layout/Container'
import ReviewCard from './utils/ReviewCard';
import WriteReviewDialog from './utils/WriteReviewDialog';
import ReportDialog from './utils/ReportDialog';

// Actions
import { favorOperation } from '../actions/user.actions';
import { openLoginDialog } from '../actions/app.actions';
import { getSingleBusiness, reportBusiness } from '../actions/business.actions';
import {
  getReviews,
  addNewReview,
  voteReview,
  clearReviewsList,
  getSingleReview
} from '../actions/review.actions';

import config from '../config/config';
import { loadFromStorage } from '../helpers/webStorage';
import webStorageTypes from '../constants/webStorage.types';

// Mock image
import image from '../../css/ikt-icon.gif';

const styles = theme => ({
  "thumbnail": {
    width: '100%',
  },
  "paper": {
    padding: theme.spacing.unit * 4,
  },
  "button": {
    margin: theme.spacing.unit,
  },
  "badgeContent": {
    paddingRight: theme.spacing.unit * 2,
  },
  "buttonContainer": {
    "display": "flex",
    "justifyContent": "flex-end",
  },
  "map": {
    width: '100%',
    height: 400,
  }
});

class SingleBusinessPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      "business": null,
      "addNewDialogOpen": false,
      "limit": 6,
      'count': 0,
      "hasMore": false,
      "orderBy": 'recommended',
      "review": {},
      "reviewDialogOpen": false,
      "reportDialogOpen": false,
      "isMyFavor": false,
      "sortMenuPopoverOpen": false,
    };

    if (props.location.state && !_.isEmpty(props.location.state.reviewId)) {
      this.state.reviewId = props.location.state.reviewId;
    }

    this.state.myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

    this.handleAddNewReviewDialogOpen = this.handleAddNewReviewDialogOpen.bind(this);
    this.handleAddNewReviewDialogClose = this.handleAddNewReviewDialogClose.bind(this);
    this.hanldeReviewSortBy = this.hanldeReviewSortBy.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleReviewDialogClose = this.handleReviewDialogClose.bind(this);
    this.handleAddtoFavor = this.handleAddtoFavor.bind(this);
    this.handleReportDialogOpen = this.handleReportDialogOpen.bind(this);
    this.handleReportDialogClose = this.handleReportDialogClose.bind(this);
    this.handleSubmitReport = this.handleSubmitReport.bind(this);
    this.handleSortMenuPopoverOpen = this.handleSortMenuPopoverOpen.bind(this);
    this.handleSortMenuPopoverClose = this.handleSortMenuPopoverClose.bind(this);
  }

  componentDidMount() {
    this.props.getSingleBusiness(this.props.match.params.slug)
      .then(business => {
        if (_.isEmpty(business) || business.status !== 'PUBLISHED') {
          this.props.history.push('/404');
        } else {
          const index = this.state.myFavors.indexOf(business._id);
          this.setState({
            business: Object.assign({}, business),
            isMyFavor: (!_.isUndefined(index) && index > -1) ? true : false,
          });

          return this.props.getReviews({
            limit: this.state.limit,
            bid: business._id,
          });
        }

        return ;
      })
      .then(response => {
        if (response) {
          this.setState({
            hasMore: response.list.length < response.totalCount,
            count: response.list.length,
          });
        }

        if (this.state.reviewId) {
          this.props.getSingleReview(this.state.reviewId)
            .then(review => {
              if (review) {
                this.setState({
                  reviewDialogOpen: true,
                  review: Object.assign({}, review),
                });
              }
            });
        }

      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.slug !== this.props.match.params.slug) {
      this.props.getSingleBusiness(this.props.match.params.slug)
        .then(business => {
          if (_.isEmpty(business) || business.status !== 'PUBLISHED') {
            this.props.history.push('/404');

            return ;
          }

          const index = this.state.myFavors.indexOf(business._id);

          this.setState({
            business: Object.assign({}, business),
            isMyFavor: (!_.isUndefined(index) && index > -1) ? true : false,
          });

          return this.props.getReviews({
            limit: this.state.limit,
            bid: business._id,
          });
        })
        .then(response => {
          if (response) {
            this.setState({
              hasMore: response.list.length < response.totalCount,
              count: response.list.length,
            });
          }
        });
    }
  }

  componentWillUnmount() {
    this.props.clearReviewsList();
  }

  handleSortMenuPopoverOpen() {
    this.setState({
      "sortMenuPopoverOpen": true,
    });
  }

  handleSortMenuPopoverClose() {
    this.setState({
      "sortMenuPopoverOpen": false,
    });
  }

  handleAddNewReviewDialogOpen() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return;
    }

    this.setState({
      "addNewDialogOpen": true,
    });
  }

  handleAddNewReviewDialogClose() {
    this.setState({
      "addNewDialogOpen": false,
    });
  }

  handleReviewDialogClose() {
    this.setState({
      "reviewDialogOpen": false,
    });
  }

  handleReportDialogOpen() {
    this.setState({
      "reportDialogOpen": true
    });
  }

  handleReportDialogClose() {
    this.setState({
      "reportDialogOpen": false
    });
  }

  handleSubmitReport(type, content, contact) {
    if (this.state.business) {
      this.props.reportBusiness(this.state.business._id, {
        type,
        content,
        contact,
      })
      .then(response => {
        if (response) {
          this.handleReportDialogClose();
        }
      });
    }
  }

  hanldeReviewSortBy = (item) => e => {
    this.props.getReviews({
      limit: this.state.limit,
      bid: this.state.business._id,
      orderBy: item,
    }).then((response => {
      if (response) {
        this.setState({
          'orderBy': item,
          hasMore: response.list.length < this.props.totalCount,
          count: response.list.length,
        });
      }
    }));

    this.setState({
      sortMenuPopoverOpen: false
    });
  }

  handleAddtoFavor() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return;
    }

    if (!_.isEmpty(this.props.user) && !_.isEmpty(this.state.business)) {
      this.props.favorOperation(this.props.user._id, this.state.business._id)
        .then(response => {
          if (response) {
            this.setState({
              isMyFavor: !this.state.isMyFavor
            });
          }
        });
    }
  }

  loadMore() {
    if (this.state.hasMore) {
      this.props.getReviews({
        limit: this.state.count + this.state.limit,
        'bid': this.state.business._id,
        'orderBy': this.state.orderBy,
      }).then((response => {
        this.setState({
          count: response.list.length,
          hasMore: response.list.length < this.props.totalCount
        });
      }));
    }
  }

  render() {
    const { classes, reviews } = this.props;
    const { business, review } = this.state;
    const thumbnail = (_.isEmpty(business) || _.isEmpty(business.thumbnailUri))
                        ? image
                        : config.API_GATEWAY_ROOT + '/' + business.thumbnailUri.hd;

    const mapPlugins = [
      'Overview',
      'ControlBar',

    ];

    return (
      <Container>
        {
          _.isEmpty(business) ? <div></div> :
          <div>
            <Grid container spacing={16}>
              <Grid item xs={6}>
                <Img src={thumbnail} className={classes.thumbnail} />
              </Grid>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="display2" >{business.krName}</Typography>
                      <Typography variant="body2" >{business.cnName}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.buttonContainer}>
                        <Tooltip id="favor-icon" title="Add to Favor">
                          <IconButton
                            color={this.state.isMyFavor ? "secondary" : 'default'}
                            onClick={this.handleAddtoFavor}
                          >
                            {
                              this.state.isMyFavor ? <Favorite /> : <FavoriteBorder />
                            }
                          </IconButton>
                        </Tooltip>
                        <Tooltip id="report-icon" title="Report">
                          <IconButton onClick={this.handleReportDialogOpen}>
                            <ErrorOutline />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </Grid>
                  </Grid>

                  <br />

                  <Stars count={5} size={32} value={business.ratingAverage} edit={false} />

                  <br />

                  <Grid container justify="flex-end" alignItems="center">

                    <Grid item>
                      <Link to={"/business/category/" + business.category.enName}>
                        <Typography variant="body2" color="primary" gutterBottom>{business.category.krName}</Typography>
                      </Link>
                    </Grid>
                  </Grid>

                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <LocalPhone style={{ fontSize: 30 }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="body2">
                        {business.tel}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container justify="space-between" alignItems="center">
                    <Grid item>
                      <Place style={{ fontSize: 30 }} />
                    </Grid>
                    <Grid item>
                      <Typography variant="body2">
                        {business.address.area.name + ' ' + business.address.street}
                      </Typography>
                    </Grid>
                  </Grid>


                </Paper>
              </Grid>

              {
                business.event
                  ? <Grid item xs={4}>
                      <Paper className={classes.paper}>
                        <Typography variant="title" gutterBottom>Event</Typography>
                        <div dangerouslySetInnerHTML={{ __html: business.event }} />
                      </Paper>
                    </Grid>
                  : ''
              }

              <Grid item xs={6}>
                <Paper className={classes.map}>
                  <Map
                    amapkey={config.AMAP_KEY}
                    zoom={16}
                    center={{
                      longitude: business.geo.coordinates[0],
                      latitude: business.geo.coordinates[1],
                    }}
                    plugins={mapPlugins}
                  >
                    <Marker position={{
                        longitude: business.geo.coordinates[0],
                        latitude: business.geo.coordinates[1],
                      }}
                    />
                  </Map>
                </Paper>
              </Grid>

              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography variant="title" gutterBottom>More</Typography>
                  <div>
                    <Typography variant="body1" gutterBottom><strong>가격:</strong> {business.priceRange}</Typography>
                    <Typography variant="body1" gutterBottom>배달: {business.delivery}</Typography>
                    <Typography variant="body1" gutterBottom>언어: {business.supportedLanguage.toString()}</Typography>
                    <Typography variant="body1" gutterBottom>Payments: {business.payment.toString()}</Typography>
                    <Typography variant="body1" gutterBottom>휴식일: {business.rest}</Typography>
                  </div>
                </Paper>
              </Grid>

              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography variant="title" gutterBottom>분점</Typography>
                  {
                    business.chains.map(item => (
                      <Link to={item.enName} key={item.enName}>
                        <Typography variant="body1">{item.krName}</Typography>
                      </Link>
                    ))
                  }
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography variant="title" gutterBottom>영업시간</Typography>
                  <Typography variant="body1" gutterBottom>월요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.mon}</Typography>
                  <Typography variant="body1" gutterBottom>화요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.tue}</Typography>
                  <Typography variant="body1" gutterBottom>수요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.wed}</Typography>
                  <Typography variant="body1" gutterBottom>목요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.thu}</Typography>
                  <Typography variant="body1" gutterBottom>금요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.fri}</Typography>
                  <Typography variant="body1" gutterBottom>토요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.sat}</Typography>
                  <Typography variant="body1" gutterBottom>일요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.sun}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography variant="title" gutterBottom>Description</Typography>
                  <div dangerouslySetInnerHTML={{ __html: business.description }} />
                </Paper>
              </Grid>

              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography variant="title" gutterBottom>Menu</Typography>
                  {
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          _.isEmpty(business.menu) ? (<TableRow></TableRow>)
                          : business.menu.map((item, index) => {
                              let name;

                              if (item.hot) {
                                name = <Badge color="secondary" badgeContent={<Whatshot />}>
                                    <Typography variant="body1" className={classes.badgeContent}>{item.name}</Typography>
                                  </Badge>
                              } else if (item.new) {
                                name = <Badge color="primary" badgeContent="New">
                                    <Typography variant="body1" className={classes.badgeContent}>{item.name}</Typography>
                                  </Badge>
                              } else {
                                name = <Typography variant="body1" className={classes.badgeContent}>{item.name}</Typography>
                              }

                            return (<TableRow hover key={index}>
                              <TableCell>
                                {name}
                              </TableCell>
                              <TableCell>{item.price}</TableCell>
                            </TableRow>
                          )})
                        }
                      </TableBody>
                    </Table>
                  }
                </Paper>
              </Grid>
            </Grid>

            <Grid container spacing={16} justify="space-between" alignItems="flex-start">
              <Grid item xs={12}>
                <Typography variant="display3" align="center" id="reviews">
                  Reviews
                </Typography>
              </Grid>
              <Grid item xs={4}>
                  <Button
                    color="primary"
                    variant="outlined"
                    buttonRef={node => {
                      this.sortMenuAnchorEl = node;
                    }}
                    onClick={this.handleSortMenuPopoverOpen}
                  >
                    Sort By
                  </Button>
              </Grid>
              <Grid item xs={4}>
                <div className={classes.buttonContainer}>
                  <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleAddNewReviewDialogOpen}
                  >
                    Write a review
                  </Button>
                </div>
              </Grid>
              <Grid item xs={12}>
                <InfiniteScroll
                  pageStart={0}
                  loadMore={this.loadMore}
                  hasMore={this.state.hasMore}
                  loader={<div className="loader" key={0}>Loading ...</div>}
                >
                  <Masonry>
                    {
                      _.isEmpty(reviews) ? (<p>None</p>)
                        : reviews.map(review => (
                          <ReviewCard
                            key={review._id}
                            id={review._id}
                            owner={review.user}
                            user={this.props.user}
                            isLoggedIn={this.props.isLoggedIn}
                            isOwn={review.user._id === this.props.user._id}
                            showUser
                            business={review.business}
                            content={review.content}
                            rating={review.rating}
                            upvoteNum={review.upvote.length}
                            handleVote={this.props.voteReview}
                            openLoginDialog={this.props.openLoginDialog}
                          />
                        ))
                    }
                  </Masonry>
                </InfiniteScroll>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" align="center">
                  --- No more reviews ---
                </Typography>
              </Grid>
            </Grid>

            <div>
              <WriteReviewDialog
                user={this.props.user}
                business={business}
                open={this.state.addNewDialogOpen}
                addNewReview={this.props.addNewReview}
                handleClose={this.handleAddNewReviewDialogClose}
              />

              <WriteReviewDialog
                readOnly
                user={this.props.user}
                rating={review.rating}
                content={review.content}
                serviceGood={review.serviceGood}
                envGood={review.envGood}
                comeback={review.comeback}
                business={business}
                open={this.state.reviewDialogOpen}
                handleClose={this.handleReviewDialogClose}
              />

              <ReportDialog
                open={this.state.reportDialogOpen}
                handleSubmit={this.handleSubmitReport}
                handleClose={this.handleReportDialogClose}
              />

              <Popover
                open={this.state.sortMenuPopoverOpen}
                anchorEl={this.sortMenuAnchorEl}
                onClose={this.handleSortMenuPopoverClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <div className={classes.popoverContainer}>
                  <MenuList role="menu">
                    <MenuItem selected={this.state.orderBy === 'recommended'} onClick={this.hanldeReviewSortBy('recommended')}>
                      <ListItemText primary="Recommend" />
                    </MenuItem>
                    <MenuItem selected={this.state.orderBy === 'useful'} onClick={this.hanldeReviewSortBy('useful')}>
                      <ListItemText primary="Useful" />
                    </MenuItem>
                    <MenuItem selected={this.state.orderBy === 'new'} onClick={this.hanldeReviewSortBy('new')}>
                      <ListItemText primary="New" />
                    </MenuItem>
                  </MenuList>
                </div>
              </Popover>
            </div>
          </div>
        }
      </Container>
    );
  }
}

SingleBusinessPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object,
  "isFetching": PropTypes.bool.isRequired,
  "reviews": PropTypes.array.isRequired,
  "totalCount": PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "reviews": state.reviewReducer.reviews,
    "totalCount": state.reviewReducer.totalCount,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, {
  getSingleBusiness,
  reportBusiness,
  addNewReview,
  getReviews,
  voteReview,
  clearReviewsList,
  getSingleReview,
  favorOperation,
  openLoginDialog,
})(withStyles(styles)(SingleBusinessPage));
