import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Img from 'react-image';
import Stars from 'react-stars';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';
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
import Whatshot from 'material-ui-icons/Whatshot';
import Share from 'material-ui-icons/Share';
import FavoriteBorder from 'material-ui-icons/FavoriteBorder';
import ErrorOutline from 'material-ui-icons/ErrorOutline';

import Container from './utils/Container'
import ReviewCard from './utils/ReviewCard';
import StoryCard from './utils/StoryCard';
import WriteReviewDialog from './utils/WriteReviewDialog';
import { getSingleBusiness } from '../actions/business.actions';
import { getReviews, addNewReview, updateReview, voteReview, clearReviewsList } from '../actions/review.actions';

import config from '../config/config';
import image from '../../css/ikt-icon.gif';

const story = {
  id: '1',
  userId: '5a4ef8f5537cd042155581a3',
  businessId: '5a4ef8f5537cd042155581a3',
  businessName: 'SteakHouse',
  title: 'Tasting SteakHouse',
  content: 'Bla bla bla',
  commentCount: 10,
  upVote: 10,
  downVote: 2
};

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
    };

    this.handleReviewDialogOpen = this.handleReviewDialogOpen.bind(this);
    this.handleReviewDialogClose = this.handleReviewDialogClose.bind(this);
    this.handleOrderBy = this.handleOrderBy.bind(this);
    this.loadMoreReviews = this.loadMoreReviews.bind(this);
  }

  componentDidMount() {
    this.props.getSingleBusiness("enName", this.props.match.params.slug).then(business => {
      if (business) {
        this.setState({
          business: business,
        });
        return this.props.getReviews(0, this.state.limit, { 'bid': business._id });
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
    }));
  }

  componentWillUnmount() {
    this.props.clearReviewsList();
  }

  handleReviewDialogOpen() {
    this.setState({
      "addNewDialogOpen": true,
    });
  }

  handleReviewDialogClose() {
    this.setState({
      "addNewDialogOpen": false,
    });
  }

  handleOrderBy = (item) => e => {
    this.props.getReviews(0, this.state.limit, {
      'bid': this.state.business._id,
      'orderBy': item,
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

  loadMoreReviews() {
    if (this.state.hasMore) {
      this.props.getReviews(0, this.state.count + this.state.limit, {
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
    const { business } = this.state;
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
                        <Tooltip id="share-icon" title="Share">
                          <IconButton aria-label="Share">
                            <Share />
                          </IconButton>
                        </Tooltip>
                        <Tooltip id="favor-icon" title="Add to Favor">
                          <IconButton>
                            <FavoriteBorder />
                          </IconButton>
                        </Tooltip>
                        <Tooltip id="report-icon" title="Report">
                          <IconButton>
                            <ErrorOutline />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </Grid>
                  </Grid>
                  <Typography type="body1" gutterBottom>{business.cnName}</Typography>
                  <Stars count={5} size={24} value={business.ratingSum/business.reviewsList.length} edit={false} />
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
                  <Typography type="title" gutterBottom>More</Typography>
                  <Typography type="body1" gutterBottom>가격: {business.priceRange}</Typography>
                  <Typography type="body1" gutterBottom>배달: {business.delivery}</Typography>
                  <Typography type="body1" gutterBottom>언어: {business.supportedLanguage}</Typography>
                  <Typography type="body1" gutterBottom>Payments: {business.payment}</Typography>
                  <Typography type="body1" gutterBottom>휴식일: {business.rest}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>영업시간</Typography>
                  <Typography type="body1" gutterBottom>월요일: {business.openningHoursSpec.mon}</Typography>
                  <Typography type="body1" gutterBottom>화요일: {business.openningHoursSpec.tue}</Typography>
                  <Typography type="body1" gutterBottom>수요일: {business.openningHoursSpec.wed}</Typography>
                  <Typography type="body1" gutterBottom>목요일: {business.openningHoursSpec.thu}</Typography>
                  <Typography type="body1" gutterBottom>금요일: {business.openningHoursSpec.fri}</Typography>
                  <Typography type="body1" gutterBottom>토요일: {business.openningHoursSpec.sat}</Typography>
                  <Typography type="body1" gutterBottom>일요일: {business.openningHoursSpec.sun}</Typography>
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
                <Typography type="display3" align="center">
                  Reviews
                </Typography>
              </Grid>
              <Grid item xs={4}>
                  <Button color="primary" onClick={this.handleOrderBy('recommended')}>Recommend</Button>
                  <Button color="primary" onClick={this.handleOrderBy('new')}>Newest</Button>
                  <Button color="primary" onClick={this.handleOrderBy('useful')}>Most Useful</Button>
              </Grid>
              <Grid item xs={4}>
                <Button raised color="primary" onClick={this.handleReviewDialogOpen}>Write a review</Button>
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
                        : reviews.map((review, index) => (
                          <ReviewCard
                            key={index}
                            id={review._id}
                            owner={review.user}
                            user={this.props.user}
                            business={review.business}
                            showUser={true}
                            content={review.content}
                            rating={review.rating}
                            upVoteNum={review.upVote.length}
                            downVoteNum={review.downVote.length}
                            handleUpdate={this.props.updateReview}
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

            <Grid container spacing={16}>
              <Grid item xs={12}>
                <Typography type="display3" align="center">
                  Stories
                </Typography>
              </Grid>
              <Grid item xs={12}>
                  <Button color="primary">Newest</Button>
                  <Button color="primary">Most Useful</Button>
              </Grid>
              <Grid item xs={4}>
                <StoryCard businessName={story.businessName}
                  title={story.title}
                  content={story.content}
                  commentCount={story.commentCount}
                  upVote={story.upVote}
                  downVote={story.downVote}
                />
              </Grid>
            </Grid>

            <WriteReviewDialog
              user={this.props.user}
              business={this.state.business}
              open={this.state.addNewDialogOpen}
              handleSubmit={this.props.addNewReview}
              handleClose={this.handleReviewDialogClose}
           />
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
    "reviews": state.reviewReducer.reviews,
    "totalCount": state.reviewReducer.totalCount,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getSingleBusiness, addNewReview, getReviews, updateReview, voteReview, clearReviewsList })(withStyles(styles)(SingleBusinessPage));
