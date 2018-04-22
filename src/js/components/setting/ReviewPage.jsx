import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import SettingContainer from './SettingContainer';
import ReviewCard from '../utils/ReviewCard';
import { getReviews, updateReview, deleteReview } from '../../actions/review.actions';
import { loadFromStorage } from '../../helpers/webStorage';
import webStorageTypes from '../../constants/webStorage.types';

const styles = theme => ({});

class ReviewPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "rowsPerPage": 20,
      "page": 0,
    };

  }

  componentDidMount() {
    const uid = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);
    if (uid) {
      this.props.getReviews(0, this.state.rowsPerPage, {
        'uid': uid,
        'orderBy': 'new'
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
                My Reviews
              </Typography>
            </Grid>
            {
              _.isEmpty(reviews) ? (<Grid item>None</Grid>)
                : reviews.map((review, index) => (
                  <Grid item xs={3} key={index}>
                    <ReviewCard
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
                  </Grid>
                ))
            }
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
    "error": state.reviewReducer.error,
  };
};

export default connect(mapStateToProps, { getReviews, updateReview, deleteReview })(withStyles(styles)(ReviewPage));
