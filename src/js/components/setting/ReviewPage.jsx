import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';

import SettingContainer from './SettingContainer';
import ReviewCard from '../utils/ReviewCard';
import { getReviews, updateReview, deleteReview } from '../../actions/review.actions';
import { loadFromStorage } from '../../helpers/webStorage';
import webStorageTypes from '../../constants/webStorage.types';

const styles = theme => ({

});

class ReviewPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "limit": 10,
      "count": 0,
      'orderBy': 'new',
      'hasMore': false,
    };

    this.state.userId = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);

    this.handleOrderBy = this.handleOrderBy.bind(this);
    this.loadMoreReviews = this.loadMoreReviews.bind(this);
  }

  componentDidMount() {
    if (this.state.userId) {
      this.props.getReviews(0, this.state.count, {
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
      this.props.getReviews(0, this.state.limit, {
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
      this.props.getReviews(0, this.state.count + this.state.limit, {
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


  render() {
    const { classes, reviews } = this.props;

    return (
      <SettingContainer>
        <div>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography type="display3" gutterBottom>
                My Reviews Total Count: {this.props.totalCount}
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
                      : reviews.map((review, index) => (
                          <ReviewCard
                            key={index}
                            className={classes.card}
                            id={review._id}
                            owner={review.user}
                            business={review.business}
                            showBusinessName={true}
                            isOwn={review.userId === this.props.user._id}
                            content={review.content}
                            rating={review.rating}
                            upVoteNum={review.upVote.length}
                            downVoteNum={review.downVote.length}
                            serviceGood={review.serviceGood}
                            envGood={review.envGood}
                            comeback={review.comeback}
                            handleUpdate={this.props.updateReview}
                            handleDelete={this.props.deleteReview}
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

export default connect(mapStateToProps, { getReviews, updateReview, deleteReview })(withStyles(styles)(ReviewPage));
