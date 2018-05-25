import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import WriteReviewDialog from './WriteReviewDialog';
import { getSingleReview } from '../../actions/review.actions';

const styles = theme => ({
});

class MessageContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "dialogOpen": false,
      "review": {},
      "message": '',
      "commentId": '',
    }
  }

  componentDidMount() {
    const { type, event, subjectTitle, commentId } = this.props;

    switch (type) {
      case "BUSINESS":
        switch (event) {
          case "START_EVENT":
            this.setState({
              message: subjectTitle + "started new event",
            });
            break;

          default:
            return ;
        }
        break;

      case "REVIEW":
        switch (event) {
          case "UPVOTE":
            this.setState({
              message: "likes your review about " + subjectTitle,
            });
            break;

          case "CANCEL_UPVOTE":
            this.setState({
              message: "cancel the like for your review about " + subjectTitle,
            });
            break;

          default:
            return ;
        }
        break;

      default:
        return ;
    }
  }

  handleClose() {
    this.setState({
      dialogOpen: false,
    });
  }

  render() {
    const { classes } = this.props;
    const { review } = this.state;


    return (
      <div>
        <strong>{_.isEmpty(this.props.sender) ? '' : this.props.sender.username}</strong>
        {' ' + this.state.message}
      </div>
    )
  }
}

MessageContent.propTypes = {
  "classes": PropTypes.object.isRequired,
  "type": PropTypes.string.isRequired,
  "content": PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
  };
};

export default connect(mapStateToProps, { getSingleReview })(withStyles(styles)(MessageContent));
