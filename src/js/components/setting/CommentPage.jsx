import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Components
import SettingContainer from '../layout/SettingContainer';
import CommentPanel from '../utils/CommentPanel';

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

    this.state.userId = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);

    this.loadMore = this.loadMore.bind(this);
    this.getNewComments = this.getNewComments.bind(this);
  }

  componentDidMount() {
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

          {
            _.isEmpty(comments)
              ? <Typography align="center">None</Typography>
              : <div>
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMore}
                    hasMore={this.state.hasMore}
                    loader={<div style={{ textAlign: 'center' }} key={0}>
                              <CircularProgress size={30} />
                            </div>}
                  >
                    {
                      comments.map(comment => (
                        <div key={comment._id} className={classes.itemWrapper}>
                          <CommentPanel
                            showDelete
                            commentId={comment._id}
                            postId={comment.postId._id}
                            postTitle={comment.postId.title}
                            parentComment={comment.parentId}
                            replyToUser={comment.replyToUser}
                            status={comment.status}
                            content={comment.content}
                            owner={comment.userId}
                            isLoggedIn={this.props.isLoggedIn}
                            user={this.props.user}
                            isOwn={this.props.user && comment.userId._id === this.props.user._id}
                            upvoteCount={comment.upvote.length}
                            downvoteCount={comment.downvote.length}
                            createdAt={comment.createdAt}
                            addNewComment={this.props.addNewComment}
                            getNewComments={this.getNewComments}
                            voteComment={this.props.voteComment}
                            deleteComment={this.props.deleteComment}
                          />
                        </div>
                      ))
                    }
                  </InfiniteScroll>
                  {
                    this.state.hasMore
                      ? null
                      : <Typography variant="caption" align="center">
                          --- No more comments ---
                        </Typography>
                  }
                </div>
          }
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
