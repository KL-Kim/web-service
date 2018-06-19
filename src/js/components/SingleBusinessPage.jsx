import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Img from 'react-image';
import Stars from 'react-stars';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Table, { TableBody, TableCell, TableHead, TableRow, } from 'material-ui/Table';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';

// Material UI Icons
import Whatshot from 'material-ui-icons/Whatshot';
import FavoriteBorder from 'material-ui-icons/FavoriteBorder';
import ErrorOutline from 'material-ui-icons/ErrorOutline';
import Favorite from 'material-ui-icons/Favorite';

// Custom Components
import Container from './utils/Container'
import ReviewCard from './utils/ReviewCard';
import WriteReviewDialog from './utils/WriteReviewDialog';
import ReportDialog from './utils/ReportDialog';

// Actions
import { favorOperation } from '../actions/user.actions';
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
    padding: theme.spacing.unit * 5,
    color: theme.palette.text.secondary
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
    };

    if (props.location.state && !_.isEmpty(props.location.state.reviewId)) {
      this.state.reviewId = props.location.state.reviewId;
    }

    this.state.myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

    this.handleAddNewReviewDialogOpen = this.handleAddNewReviewDialogOpen.bind(this);
    this.handleAddNewReviewDialogClose = this.handleAddNewReviewDialogClose.bind(this);
    this.handleOrderBy = this.handleOrderBy.bind(this);
    this.loadMoreReviews = this.loadMoreReviews.bind(this);
    this.handleReviewDialogClose = this.handleReviewDialogClose.bind(this);
    this.handleAddtoFavor = this.handleAddtoFavor.bind(this);
    this.handleReportDialogOpen = this.handleReportDialogOpen.bind(this);
    this.handleReportDialogClose = this.handleReportDialogClose.bind(this);
    this.handleSubmitReport = this.handleSubmitReport.bind(this);
  }

  componentDidMount() {
    this.props.getSingleBusiness(this.props.match.params.slug)
      .then(business => {
        if (_.isEmpty(business) || business.status !== 'PUBLISHED') {
          this.props.history.push('/404');
        } else {
          const index = this.state.myFavors.indexOf(business._id);
          this.setState({
            business: business,
            isMyFavor: (!_.isUndefined(index) && index > -1) ? true : false,
          });
          return this.props.getReviews({
            limit: this.state.limit,
            bid: business._id,
          });
        }

        return ;
      })
      .then((response => {
        if (response) {
          this.setState({
            hasMore: this.state.limit < response.totalCount,
            count: this.state.count + this.state.limit,
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

      }));
  }

  componentWillUnmount() {
    this.props.clearReviewsList();
  }

  handleAddNewReviewDialogOpen() {
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

  handleOrderBy = (item) => e => {
    this.props.getReviews({
      limit: this.state.limit,
      bid: this.state.business._id,
      orderBy: item,
    }).then((response => {
      if (response) {
        this.setState({
          'orderBy': item,
          hasMore: this.state.limit < this.props.totalCount,
          count: this.state.limit,
        });
      }
    }));
  }

  handleAddtoFavor() {
    if (!this.props.isLoggedIn) {
      this.props.history.push('/signin');
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

  loadMoreReviews() {
    if (this.state.hasMore) {
      this.props.getReviews({
        limit: this.state.count + this.state.limit,
        'bid': this.state.business._id,
        'orderBy': this.state.orderBy,
      }).then((response => {
        this.setState({
          count: this.state.count + this.state.limit,
          hasMore: this.state.count + this.state.limit < this.props.totalCount
        });
      }));
    }
  }

  render() {
    const { classes, reviews } = this.props;
    const { business, review } = this.state;
    const thumbnail = _.isEmpty(business) || _.isEmpty(business.thumbnailUri) ? image : config.API_GATEWAY_ROOT + '/' + business.thumbnailUri.hd;

    return (
      <Container>
        {
          _.isEmpty(business) ? <div></div> :
          <div>
            <Grid container spacing={16}>
              <Grid item xs={4}>
                <Img src={thumbnail} className={classes.thumbnail} />
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <Typography type="display1" color="primary">{business.krName}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.buttonContainer}>
                        <Tooltip id="favor-icon" title="Add to Favor">
                          <IconButton color={this.state.isMyFavor ? "secondary" : 'default'} onClick={this.handleAddtoFavor}>
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
                  <Typography type="body1" gutterBottom>{business.cnName}</Typography>
                  <Stars count={5} size={24} value={business.ratingAverage} edit={false} />
                    <Typography type="body2">{business.category.krName}</Typography>
                  <Typography type="body1">Tel: {business.tel}</Typography>
                  <Typography type="body1">{business.address.area.name + ' ' + business.address.street}</Typography>
                </Paper>
              </Grid>

              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>지도</Typography>

                </Paper>
              </Grid>

              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="display1" gutterBottom>More</Typography>
                  <Typography type="body1" gutterBottom>가격: {business.priceRange}</Typography>
                  <Typography type="body1" gutterBottom>배달: {business.delivery}</Typography>
                  <Typography type="body1" gutterBottom>언어: {business.supportedLanguage}</Typography>
                  <Typography type="body1" gutterBottom>Payments: {business.payment}</Typography>
                  <Typography type="body1" gutterBottom>휴식일: {business.rest}</Typography>
                </Paper>
              </Grid>

              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>분점</Typography>
                  {business.chains.map(item =>
                    (<Link to={item.enName} key={item.enName}>
                      <Typography type="body1">{item.krName}</Typography>
                    </Link>)
                  )}
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>영업시간</Typography>
                  <Typography type="body1" gutterBottom>월요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.mon}</Typography>
                  <Typography type="body1" gutterBottom>화요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.tue}</Typography>
                  <Typography type="body1" gutterBottom>수요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.wed}</Typography>
                  <Typography type="body1" gutterBottom>목요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.thu}</Typography>
                  <Typography type="body1" gutterBottom>금요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.fri}</Typography>
                  <Typography type="body1" gutterBottom>토요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.sat}</Typography>
                  <Typography type="body1" gutterBottom>일요일: {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.sun}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>Description</Typography>
                  <Typography type="body1" gutterBottom>{business.description}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>Event</Typography>
                  <Typography type="body1" gutterBottom>{business.event}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>Menu</Typography>
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
                                    <Typography type="body1" className={classes.badgeContent}>{item.name}</Typography>
                                  </Badge>
                              } else if (item.new) {
                                name = <Badge color="primary" badgeContent="New">
                                    <Typography type="body1" className={classes.badgeContent}>{item.name}</Typography>
                                  </Badge>
                              } else {
                                name = <Typography type="body1" className={classes.badgeContent}>{item.name}</Typography>
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

            <Divider />

            <Grid container spacing={16} justify="space-between" alignItems="flex-start">
              <Grid item xs={12}>
                <Typography type="display3" align="center" id="reviews">
                  Reviews
                </Typography>
              </Grid>
              <Grid item xs={4}>
                  <Button color="primary" onClick={this.handleOrderBy('recommended')}>Recommend</Button>
                  <Button color="primary" onClick={this.handleOrderBy('new')}>Newest</Button>
                  <Button color="primary" onClick={this.handleOrderBy('useful')}>Most Useful</Button>
              </Grid>
              <Grid item xs={4}>
                <div className={classes.buttonContainer}>
                  <Button raised color="primary" onClick={this.handleAddNewReviewDialogOpen}>Write a review</Button>
                </div>
              </Grid>
              <Grid item xs={12}>
                <InfiniteScroll
                  pageStart={0}
                  loadMore={this.loadMoreReviews}
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
                          />
                        ))
                    }
                  </Masonry>
                </InfiniteScroll>
              </Grid>
              <Grid item xs={12}>
                <Typography type="caption" align="center">
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
  favorOperation
})(withStyles(styles)(SingleBusinessPage));
