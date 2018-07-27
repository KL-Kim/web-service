import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Components
import SettingContainer from '../layout/SettingContainer';
import CommentPanel from '../sections/CommentPanel';

// Webstorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

// Actions
import { getComments, deleteComment } from 'js/actions/comment.actions';

const styles = (theme) => ({
  "root": {
    maxWidth: 720,
    margin: 'auto'
  },
  "itemWrapper": {
    marginBottom: theme.spacing.unit * 2,
  },
});

class CommentsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 20,
      count: 0,
      hasMore: false,
    };

    this.loadMore = this.loadMore.bind(this);
    this.getNewComments = this.getNewComments.bind(this);
  }

  componentDidMount() {
    const userId = this.props.user._id || loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);

    if (userId) {
      this.props.getComments({
        limit: this.state.limit,
        uid: userId,
        orderBy: 'new',
      }).then(response => {
        if (response) {
          this.setState({
            userId,
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
      });
    }
  }

  loadMore() {
    this.props.getComments({
      limit: this.state.limit,
      uid: this.state.userId,
      orderBy: 'new',
    })
    .then(response => {
      if (response) {
        this.setState({
          count: response.list.length,
          hasMore: response.list.length < response.totalCount,
        })
      }
    })
  }

  getNewComments() {
    if (this.state.userId) {
      this.props.getComments({
        limit: this.state.limit,
        uid: this.state.userId,
        orderBy: 'new',
      }).then(response => {
        if (response) {
          this.setState({
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
      });
    }
  }

  render() {
    const { classes, comments } = this.props;

    return _.isEmpty(this.props.user) ? null : (
      <SettingContainer>
        <div className={classes.root}>
          <Typography variant="display1">My Comments</Typography>
          <br />

          <CommentPanel
            hasMore={this.state.hasMore}
            loadMore={this.loadMore}
            commentsList={this.props.comments}
            totalCount={this.props.totalCount}
            isLoggedIn={this.props.isLoggedIn}
            userId={this.props.user._id}
            showDeleteIcon
            deleteComment={this.props.deleteComment}
            getNewComments={this.getNewComments}
          />
        </div>
      </SettingContainer>
    );
  }
}

CommentsPage.propTypes = {
  "classes": PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "isLoggedIn": state.userReducer.isLoggedIn,
    "user": state.userReducer.user,
    "comments": state.commentReducer.comments,
    "totalCount": state.commentReducer.totalCount,
  };
};

export default connect(mapStateToProps, { getComments, deleteComment })(withStyles(styles)(CommentsPage));
