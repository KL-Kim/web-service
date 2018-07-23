import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

// Material UI Icons
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';
import Delete from '@material-ui/icons/Delete';

// Custom Components
import Avatar from './Avatar';
import ProperName from './ProperName';
import ElapsedTime from 'js/helpers/ElapsedTime';
import ConfirmationDialog from './ConfirmationDialog';
import ThumbButton from './ThumbButton';

const styles = theme => ({
  "root": {
    padding: theme.spacing.unit * 4,
  },
  "iconButton": {
    marginRight: theme.spacing.unit
  },
});

class CommentPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "replyDialogOpen": false,
      "deleteDialogOpen": false,
      "content": '',
      "upvoteCount": props.upvoteCount,
      "downvoteCount": props.downvoteCount,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleOpenReplyDialog = this.handleOpenReplyDialog.bind(this);
    this.handleCloseReplyDialog = this.handleCloseReplyDialog.bind(this);
    this.handleOpenDeleteDialog = this.handleOpenDeleteDialog.bind(this);
    this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
    this.handleSubmitComment = this.handleSubmitComment.bind(this);
    this.handleDeleteComment = this.handleDeleteComment.bind(this);
    this.handleVoteComment = this.handleVoteComment.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleOpenReplyDialog() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return;
    }

    this.setState({
      "replyDialogOpen": true,
    });
  }

  handleCloseReplyDialog() {
    this.setState({
      "replyDialogOpen": false,
    });
  }

  handleOpenDeleteDialog() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return;
    }

    this.setState({
      "deleteDialogOpen": true,
    });
  }

  handleCloseDeleteDialog() {
    this.setState({
      "deleteDialogOpen": false,
    });
  }

  handleSubmitComment() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return;
    }

    if (!_.isEmpty(this.props.user) && this.props.postId) {
      this.props.addNewComment({
        userId: this.props.user._id,
        postId: this.props.postId,
        parentId: this.props.commentId,
        content: this.state.content,
        replyToUser: this.props.owner._id,
      })
      .then(response => {
        if (response) {
          return this.props.getNewComments();
        }

        return ;
      })
      .then(response => {
        this.setState({
          "replyDialogOpen": false,
          "content": "",
        })
      });
    }
  }

  handleVoteComment = (vote) => e => {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return;
    }

    if (!_.isEmpty(this.props.user) && this.props.commentId) {
      this.props.voteComment(this.props.commentId, {
        uid: this.props.user._id,
        postTitle: this.props.postTitle,
        vote: vote,
      })
      .then(response => {
        if (response) {
          this.setState({
            upvoteCount: response.comment.upvote.length,
            downvoteCount: response.comment.downvote.length,
          })
        }
      });
    }
  }

  handleDeleteComment() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return;
    }

    if (this.props.commentId && this.props.user) {
      this.props.deleteComment(this.props.commentId, this.props.user._id)
        .then(response => {
          if (response) {
            this.setState({
              "deleteDialogOpen": false
            });

            this.props.getNewComments();
          }
        });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Paper className={classes.root}>
          <Grid container spacing={24}>
            <Grid item>
              <Avatar user={this.props.owner} type="SMALL" />
            </Grid>
            <Grid item xs>
              <Typography variant="subheading" gutterBottom>
                <strong>
                  <ProperName user={this.props.owner} />
                </strong>
                <span> - {ElapsedTime(this.props.createdAt)}</span>
              </Typography>
              <Typography variant="body1" gutterBottom>
                {
                  this.props.status === 'NORMAL' ? this.props.content : 'This comment violated the policy of iKoreaTown'
                }
              </Typography>
              {
                this.props.parentComment ? (
                  <Typography variant="caption" gutterBottom>
                    <strong>
                    @
                    {
                      this.props.parentComment ? <ProperName user={this.props.replyToUser} /> : ''
                    }
                    :
                    </strong>
                    {' '}
                    {this.props.parentComment.status === 'NORMAL' ? this.props.parentComment.content : 'This comment violated the policy of iKoreaTown'}
                  </Typography>
                ) : ''
              }
              {
                this.props.status === 'NORMAL'
                  ? <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <span className={classes.iconButton}>
                          <ThumbButton type="up" disabled={this.props.isOwn} count={this.state.upvoteCount} handleSubmit={this.handleVoteComment("UPVOTE")} />
                        </span>
                        <span className={classes.iconButton}>
                          <ThumbButton type="down" disabled={this.props.isOwn} count={this.state.downvoteCount} handleSubmit={this.handleVoteComment("DOWNVOTE")} />
                        </span>
                      </Grid>

                      <Grid item>
                        <div>
                          {
                            this.props.isOwn
                              ? null
                              : (<Button color="primary" onClick={this.handleOpenReplyDialog}>
                                  Reply
                                </Button>)
                          }
                          {
                            this.props.showDelete
                              ? <IconButton color="secondary" onClick={this.handleOpenDeleteDialog}>
                                  <Delete />
                                </IconButton>
                              : null
                          }
                        </div>
                      </Grid>
                    </Grid>
                  : null
              }
            </Grid>
          </Grid>
        </Paper>
        <div>
          {
            this.props.isOwn
              ? (
                  <ConfirmationDialog
                    open={this.state.deleteDialogOpen}
                    title="Warning"
                    content="Are you sure to delete the comment?"
                    operation={this.handleDeleteComment}
                    handleClose={this.handleCloseDeleteDialog}
                  />
                )
              : (
                  <Dialog fullWidth
                    open={this.state.replyDialogOpen}
                    onClose={this.handleCloseReplyDialog}
                    aria-labelledby="reply-dialog-title"
                    aria-describedby="reply-dialog-description"
                  >
                    <DialogTitle id="reply-dialog-title">
                      Reply to <ProperName user={this.props.owner} />
                    </DialogTitle>
                    <DialogContent id="reply-dialog-description">
                      <FormControl fullWidth required>
                        <InputLabel htmlFor="content">Content</InputLabel>
                        <Input
                          type="text"
                          id="content"
                          multiline
                          rows={10}
                          name="content"
                          value={this.state.content}
                          onChange={this.handleChange}
                        />
                      </FormControl>
                    </DialogContent>
                    <DialogActions>
                      <Button variant="raised" color="primary" disabled={!this.state.content} onClick={this.handleSubmitComment}>
                        Save
                      </Button>
                      <Button color="primary" onClick={this.handleCloseReplyDialog}>
                        Cancel
                      </Button>
                    </DialogActions>
                  </Dialog>
                )
          }
        </div>
      </div>
    );
  }
}

CommentPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "commentId": PropTypes.string.isRequired,
  "postId": PropTypes.string.isRequired,
  "postTitle": PropTypes.string,
  "status": PropTypes.string.isRequired,
  "content": PropTypes.string.isRequired,
  "owner": PropTypes.object.isRequired,
  "isLoggedIn": PropTypes.bool.isRequired,
  "user": PropTypes.object.isRequired,
  "isOwn": PropTypes.bool.isRequired,
  "parentComment": PropTypes.object,
  "replyToUser": PropTypes.object,
  "upvoteCount": PropTypes.number.isRequired,
  "downvoteCount": PropTypes.number.isRequired,
  "createdAt": PropTypes.string.isRequired,
  "addNewComment": PropTypes.func,
  "getNewComments": PropTypes.func,
  "voteComment": PropTypes.func,
  "deleteCommment": PropTypes.func,
};

export default withStyles(styles)(CommentPanel);
