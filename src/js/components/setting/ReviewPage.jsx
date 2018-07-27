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
import SettingContainer from 'js/components/layout/SettingContainer';
import ReviewPanel from 'js/components/sections/ReviewPanel';

// Webstorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

// Actions
import { getReviews, deleteReview, clearReviewsList } from 'js/actions/review.actions';

const styles = theme => ({
  "mansoryWrapper": {
    width: 976,
    position: 'relative',
    top: 0,
    left: - theme.spacing.unit,
  },
  "mansoryItem": {
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
      "limit": 12,
      "count": 0,
      'hasMore': false,
      'userId': '',
    };

    this.loadMore = this.loadMore.bind(this);
    this.getNewReviews = this.getNewReviews.bind(this);
  }

  componentDidMount() {
    const userId = this.props.user._id || loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);

    if (userId) {
      this.props.getReviews({
        'limit': this.state.limit,
        'uid': userId,
        'orderBy': 'new',
      }).then(response => {
        if (response) {
          this.setState({
            userId,
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
        'uid': this.state.userId,
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
    if (this.state.userId) {
      this.props.getReviews({
        'limit': this.state.count,
        'uid': this.state.userId,
        'orderBy': 'new',
      });
    }
  }

  render() {
    const { classes, reviews } = this.props;

    return _.isEmpty(this.props.user) ? null : (
      <SettingContainer>
        <div>
          <Typography variant="display1" gutterBottom>My Reviews</Typography>
          {
            _.isEmpty(reviews)
              ? <Typography align="center">None</Typography>
              : <ReviewPanel
                  reviews={reviews}
                  totalCount={this.props.totalCount}
                  hasMore={this.state.hasMore}
                  loadMore={this.loadMore}
                  clearReviewsList={this.props.clearReviewsList}
                  isLoggedIn={this.props.isLoggedIn}
                  userId={this.props.user._id}
                  deleteReview={this.props.deleteReview}
                  getNewReviews={this.getNewReviews}
                />
          }
        </div>
      </SettingContainer>
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
