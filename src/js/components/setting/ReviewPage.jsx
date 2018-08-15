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
import { getReviews, clearReviewsList } from 'js/actions/review.actions';

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

  componentWillUnmount() {
    this.props.clearReviewsList();
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

  render() {
    const { classes } = this.props;

    return _.isEmpty(this.props.user) ? null : (
      <Container>
        <div>
          <Typography variant="title" gutterBottom>My Reviews</Typography>
          
          <ReviewPanel
            hasMore={this.state.hasMore}
            loadMore={this.loadMore}
            showBusinessName
            showDeleteIcon
          />
        </div>
      </Container>
    );
  }
}

ReviewPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "userId": PropTypes.string.isRequired,
  "user": PropTypes.object.isRequired,

  // Methods
  "getReviews": PropTypes.func.isRequired,
  "clearReviewsList": PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
  };
};

export default connect(mapStateToProps, { 
  getReviews, 
  clearReviewsList,
})(withStyles(styles)(ReviewPage));
