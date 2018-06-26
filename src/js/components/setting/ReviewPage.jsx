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
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';

// Custom Components
import SettingContainer from '../layout/SettingContainer';
import ReviewCard from '../utils/ReviewCard';

// Webstorage
import { loadFromStorage } from '../../helpers/webStorage';
import webStorageTypes from '../../constants/webStorage.types';

// Actions
import { getReviews, deleteReview } from '../../actions/review.actions';

const styles = theme => ({
  "reviewWrapper": {
    width: 976,
    position: 'relative',
    top: 0,
    left: - theme.spacing.unit,
  },
  "card": {
    width: "33.33%",
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
});

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
    this.loadMore = this.loadMore.bind(this);
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
            hasMore: response.list.length < this.props.totalCount,
            count: response.list.length,
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
            hasMore: response.list.length < this.props.totalCount,
            count: this.state.limit,
          });
        }
      });
    }
  }

  loadMore() {
    if (this.state.hasMore) {
      this.props.getReviews({
        limit: this.state.count + this.state.limit,
        'uid': this.state.userId,
        'orderBy': this.state.orderBy,
      }).then(response => {
        this.setState({
          count: response.list.length,
          hasMore: response.list.length < this.props.totalCount
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
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Typography variant="display1" gutterBottom>
                My Reviews
              </Typography>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Button color="primary" onClick={this.handleOrderBy('new')}>Newest</Button>
              <Button color="primary" onClick={this.handleOrderBy('useful')}>Most Useful</Button>
            </Grid>


            <br />

            <Grid item xs={12}>
              <InfiniteScroll
                pageStart={0}
                loadMore={this.loadMore}
                hasMore={this.state.hasMore}
                loader={<div style={{ textAlign: 'center' }} key={0}>
                          <CircularProgress size={30} />
                        </div>}
              >
                <div className={classes.reviewWrapper}>
                  <Masonry elementType={'div'}>
                    {
                      _.isEmpty(reviews)
                        ? (<div></div>)
                        : reviews.map(review => (
                          <div key={review._id} className={classes.card}>
                            <ReviewCard
                              id={review._id}
                              owner={review.user}
                              business={review.business}
                              showBusinessName={true}
                              user={this.props.user}
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
                          </div>
                        ))
                    }
                  </Masonry>
                </div>
              </InfiniteScroll>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="caption" align="center">
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
