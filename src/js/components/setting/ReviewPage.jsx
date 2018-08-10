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
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

// Custom Components
import Container from 'js/components/layout/Container';
import ReviewPanel from 'js/components/sections/ReviewPanel';

// Actions
import { getReviews, deleteReview, clearReviewsList } from 'js/actions/review.actions';

const styles = theme => ({
});

class ReviewPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "limit": 12,
      "count": 0,
      'hasMore': false,
    };

    this.loadMore = this.loadMore.bind(this);
    this.getNewReviews = this.getNewReviews.bind(this);
  }

  componentDidMount() {
    if (this.props.userId) {
      this.props.getReviews({
        'limit': this.state.limit,
        'uid': this.props.userId,
        'orderBy': 'new',
      }).then(response => {
        if (response) {
          this.setState({
            'hasMore': response.list.length < response.totalCount,
            'count': response.list.length,
          });
        }
      });
    }
  }

  loadMore() {
    if (this.state.hasMore) {
      this.props.getReviews({
        'limit': this.state.count + this.state.limit,
        'uid': this.props.userId,
        'orderBy': 'new',
      }).then(response => {
        this.setState({
          count: response.list.length,
          hasMore: response.list.length < response.totalCount
        });
      });
    }
  }

  getNewReviews() {
    if (this.props.userId) {
      this.props.getReviews({
        'limit': this.state.count,
        'uid': this.props.userId,
        'orderBy': 'new',
      });
    }
  }

  render() {
    const { classes, reviews } = this.props;

    return _.isEmpty(this.props.user) ? null : (
      <Container>
        <div>
          <Typography variant="title" gutterBottom>My Reviews</Typography>
          
          <ReviewPanel
            reviews={reviews}
            totalCount={this.props.totalCount}
            hasMore={this.state.hasMore}
            loadMore={this.loadMore}
            clearReviewsList={this.props.clearReviewsList}
            isLoggedIn={this.props.isLoggedIn}
            userId={this.props.user._id}
            deleteReview={this.props.deleteReview}
            getNewReviews={this.getNewReviews}
            showBusinessName
          />
        </div>
      </Container>
    );
  }
}

ReviewPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "isLoggedIn": PropTypes.bool.isRequired,
  "reviews": PropTypes.array.isRequired,

  // Methods
  "getReviews": PropTypes.func.isRequired,
  "deleteReview": PropTypes.func.isRequired,
  "clearReviewsList": PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "reviews": state.reviewReducer.reviews,
  };
};

export default connect(mapStateToProps, { getReviews, deleteReview, clearReviewsList })(withStyles(styles)(ReviewPage));
