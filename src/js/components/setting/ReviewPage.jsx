import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Custom Components
import SettingContainer from '../layout/SettingContainer';
import ReviewCard from '../utils/ReviewCard';
import { loadFromStorage } from '../../helpers/webStorage';
import webStorageTypes from '../../constants/webStorage.types';
import { getReviews, deleteReview } from '../../actions/review.actions';

const styles = theme => ({});

class ReviewPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "limit": 9,
      "count": 0,
      'orderBy': 'new',
      'hasMore': false,
    };

    this.state.userId = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);

    this.handleOrderBy = this.handleOrderBy.bind(this);
    this.loadMoreReviews = this.loadMoreReviews.bind(this);
    this.getNewReviews = this.getNewReviews.bind(this);
  }

  componentDidMount() {
    if (this.state.userId) {
      this.props.getReviews({
        limit: this.state.count,
        'uid': this.state.userId,
        'orderBy': this.state.orderBy,
      }).then(response => {
        if (response) {
          this.setState({
            hasMore: this.state.limit < this.props.totalCount,
            count: this.state.count + this.state.limit
          });
        }
      });
    }
  }

  handleOrderBy = (item) => e => {
    if (this.state.userId) {
      this.props.getReviews({
        limit: this.state.limit,
        'uid': this.state.userId,
        'orderBy': item,
      }).then(response => {
        if (response) {
          this.setState({
            'orderBy': item,
            hasMore: this.state.limit < this.props.totalCount,
            count: this.state.limit,
          });
        }
      });
    }
  }

  loadMoreReviews() {
    if (this.state.hasMore) {
      this.props.getReviews({
        limit: this.state.count + this.state.limit,
        'uid': this.state.userId,
        'orderBy': this.state.orderBy,
      }).then(response => {
        this.setState({
          count: this.state.count + this.state.limit,
          hasMore: this.state.count + this.state.limit < this.props.totalCount
        });
      });
    }
  }

  getNewReviews() {
    if (this.state.userId) {
      this.props.getReviews({
        limit: this.state.count,
        'uid': this.state.userId,
        'orderBy': this.state.orderBy,
      });
    }
  }

  render() {
    const { classes, reviews } = this.props;

    return (
      <SettingContainer>
        <div>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography type="display1" gutterBottom>
                My Reviews
              </Typography>
            </Grid>
            <Grid item xs={12}>
                <Button color="primary" onClick={this.handleOrderBy('new')}>Newest</Button>
                <Button color="primary" onClick={this.handleOrderBy('useful')}>Most Useful</Button>
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
                            className={classes.card}
                            id={review._id}
                            owner={review.user}
                            business={review.business}
                            showBusinessName={true}
                            isOwn={review.userId === this.props.user._id}
                            isLoggedIn={this.props.isLoggedIn}
                            content={review.content}
                            rating={review.rating}
                            upvoteNum={review.upvote.length}
                            serviceGood={review.serviceGood}
                            envGood={review.envGood}
                            comeback={review.comeback}
                            handleDelete={this.props.deleteReview}
                            getNewReviews={this.getNewReviews}
                          />
                      ))
                  }
                </Masonry>
              </InfiniteScroll>
            </Grid>

            <Grid item xs={12}>
              <Typography type="caption" align="center">
                --- No more reviews, You have total {this.props.totalCount} reviews ---
              </Typography>
            </Grid>
          </Grid>
        </div>
      </SettingContainer>
    );
  }
}

ReviewPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "updatedAt": state.userReducer.updatedAt,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "reviews": state.reviewReducer.reviews,
    "totalCount": state.reviewReducer.totalCount,
    "error": state.reviewReducer.error,
  };
};

export default connect(mapStateToProps, { getReviews, deleteReview })(withStyles(styles)(ReviewPage));
