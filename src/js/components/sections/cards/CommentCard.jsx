import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
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

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';

// Material UI Icons
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';
import Delete from '@material-ui/icons/Delete';

// Custom Components
import Avatar from 'js/components/utils/Avatar';
import ProperName from 'js/components/utils/ProperName';
import ElapsedTime from 'js/helpers/ElapsedTime';
import ConfirmationDialog from 'js/components/utils/ConfirmationDialog';
import ThumbButton from 'js/components/utils/ThumbButton';

const styles = theme => ({
  "root": {
    padding: theme.spacing.unit * 4,
  },
});

class CommentCard extends Component {
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
      this.props.history.push("/signin", {
        from: this.props.location.pathname,
      });
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
      this.props.history.push("/signin", {
        from: this.props.location.pathname,
      });
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
      this.props.history.push("/signin", {
        from: this.props.location.pathname,
      });
    }

    if (this.props.addNewComment && this.props.userId && this.props.postId) {
      this.props.addNewComment({
        userId: this.props.userId,
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
      this.props.history.push("/signin", {
        from: this.props.location.pathname,
      });
    }

    if (this.props.voteComment && this.props.userId && this.props.commentId) {
      this.props.voteComment(this.props.commentId, {
        uid: this.props.userId,
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
      this.props.history.push("/signin", {
        from: this.props.location.pathname,
      });
    }

    if (this.props.deleteComment && this.props.commentId && this.props.userId) {
      this.props.deleteComment(this.props.commentId, this.props.userId)
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
        <Card>
          <CardHeader
            avatar={<Link to={"/profile/" + this.props.owner.username}>
                      <Avatar user={this.props.owner} type="small"/>
                    </Link>}
            title={<Link to={"/profile/" + this.props.owner.username}>
                    <ProperName user={this.props.owner} />
                  </Link>}
          />
          <CardContent>
              <Typography variant="body1" gutterBottom>
                {
                  this.props.status === 'NORMAL' ? this.props.content : 'This comment violated the policy of iKoreaTown'
                }
              </Typography>
              {
                this.props.parentComment 
                  ? <Typography variant="caption" gutterBottom>
                      <strong>
                      @
                      {
                        this.props.parentComment ? <ProperName user={this.props.replyToUser} /> : null
                      }
                      :
                      </strong>
                      {' '}
                      {this.props.parentComment.status === 'NORMAL' ? this.props.parentComment.content : 'This comment violated the policy of iKoreaTown'}
                    </Typography>
                  : null
              }
          </CardContent>
          <CardActions>
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
                            this.props.isOwn || !this.props.showReplyIcon
                              ? null
                              : <Button color="primary" onClick={this.handleOpenReplyDialog}>
                                  Reply
                                </Button>
                          }
                          {
                            this.props.isOwn && this.props.showDeleteIcon
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
          </CardActions>
        </Card>

        <div>
          {
            this.props.isOwn
              ? <ConfirmationDialog
                  open={this.state.deleteDialogOpen}
                  title="Warning"
                  content="Are you sure to delete the comment?"
                  operation={this.handleDeleteComment}
                  handleClose={this.handleCloseDeleteDialog}
                />
              : <Dialog fullWidth
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
          }
        </div>
      </div>
    );
  }
}

CommentCard.defaultProps = {
  "isLoggedIn": false,
  "userId": '',
  "isOwn": false,
  "showReplyIcon": false,
  "showDeleteIcon": false,
}

CommentCard.propTypes = {
  "classes": PropTypes.object.isRequired,
  "commentId": PropTypes.string.isRequired,
  "postId": PropTypes.string.isRequired,
  "postTitle": PropTypes.string,
  "status": PropTypes.string.isRequired,
  "content": PropTypes.string.isRequired,
  "owner": PropTypes.object.isRequired,
  "parentComment": PropTypes.object,
  "replyToUser": PropTypes.object,
  "upvoteCount": PropTypes.number.isRequired,
  "downvoteCount": PropTypes.number.isRequired,
  "createdAt": PropTypes.string.isRequired,

  "isLoggedIn": PropTypes.bool.isRequired,
  "userId": PropTypes.string,
  "isOwn": PropTypes.bool.isRequired,
  "showDeleteIcon": PropTypes.bool,
  "showReplyIcon": PropTypes.bool,

  // Methods
  "addNewComment": PropTypes.func,
  "getNewComments": PropTypes.func,
  "voteComment": PropTypes.func,
  "deleteCommment": PropTypes.func,
};

export default withRouter(withStyles(styles)(CommentCard));
