import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Custom Components
import SettingContainer from '../layout/SettingContainer';
import CommentPanel from '../utils/CommentPanel';

// Webstorage
import { loadFromStorage } from '../../helpers/webStorage';
import webStorageTypes from '../../constants/webStorage.types';

// Actions
import { getComments, deleteComment } from '../../actions/comment.actions';

const styles = (theme) => ({});

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
            count: this.state.limit,
            hasMore: this.state.limit < response.totalCount,
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
          count: this.state.count + this.state.limit,
          hasMore: this.state.count + this.state.limit < response.totalCount,
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
            count: this.state.count,
            hasMore: this.state.count < response.totalCount,
          });
        }
      });
    }
  }

  render() {
    const { classes, comments } = this.props;

    return (
      <SettingContainer>
        <div>
          <Grid container justify="center">
            <Grid item xs={12}>
              <Typography variant="display1">Comments</Typography>
            </Grid>
          </Grid>

            <InfiniteScroll
              pageStart={0}
              loadMore={this.loadMore}
              hasMore={this.state.hasMore}
              loader={<div className="loader" key={0}>Loading ...</div>}
            >
              <Grid container justify="center">
                {
                  _.isEmpty(comments) ? ''
                    : comments.map((comment, index) => (
                      <Grid item xs={8} key={index}>
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
                          user={this.props.user}
                          isOwn={this.props.user && comment.userId._id === this.props.user._id}
                          upvote={comment.upvote.length}
                          downvote={comment.downvote.length}
                          createdAt={comment.createdAt}
                          addNewComment={this.props.addNewComment}
                          getNewComments={this.getNewComments}
                          voteComment={this.props.voteComment}
                          deleteComment={this.props.deleteComment}
                        />
                      </Grid>
                    ))
                }
              </Grid>
            </InfiniteScroll>

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
    "user": state.userReducer.user,
    "comments": state.commentReducer.comments,
    "totalCount": state.commentReducer.totalCount,
  };
};

export default connect(mapStateToProps, { getComments, deleteComment })(withStyles(styles)(CommentsPage));
