import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';

// Material UI Icons
import Delete from '@material-ui/icons/Delete';

// Custom Components
import WriteCommentDialog from 'js/components/dialogs/WriteCommentDialog';
import Avatar from 'js/components/utils/Avatar';
import ProperName from 'js/components/utils/ProperName';
import ConfirmationDialog from 'js/components/dialogs/ConfirmationDialog';
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
      "isRemoved": false,
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
      
      return ;
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
      
      return ;
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

  handleVoteComment = (vote) => e => {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();
      
      return ;
    }

    if (this.props.voteComment && this.props.isLoggedIn && this.props.userId && this.props.commentId) {
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
    if (this.props.deleteComment && this.props.isLoggedIn && this.props.isOwn && this.props.commentId && this.props.userId ) {
      this.props.deleteComment(this.props.commentId, this.props.userId)
        .then(response => {
          if (response) {
            this.setState({
              "isRemoved": true,
              "deleteDialogOpen": false,
            });
          }
        });
    }
  }

  render() {
    const { classes } = this.props;

    return this.state.isRemoved ? null : (
      <div>
        <Card>
          <CardHeader
            avatar={<Link to={"/profile/" + this.props.owner.username}>
                      <Avatar user={this.props.owner} type="small"/>
                    </Link>}
            title={<Link to={"/profile/" + this.props.owner.username}>
                    <Typography variant="body2">
                      <ProperName user={this.props.owner} />
                    </Typography>
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
                  onSubmit={this.handleDeleteComment}
                  onClose={this.handleCloseDeleteDialog}
                />
              : <WriteCommentDialog 
                  open={this.state.replyDialogOpen} 
                  onClose={this.handleCloseReplyDialog} 

                  isLoggedIn={this.props.isLoggedIn}
                  userId={this.props.userId}
                  isVerified={this.props.isVerified}
                  postId={this.props.postId}
                  parentId={this.props.commentId}
                  replyToUser={this.props.owner._id}
                  addNewComment={this.props.addNewComment}
                  getNewComments={this.props.getNewComments}
                />
          }
        </div>
      </div>
    );
  }
}

CommentCard.defaultProps = {
  "isLoggedIn": false,
  "userId": '',
  "isVerified": false,
  "isOwn": false,
  "showReplyIcon": false,
  "showDeleteIcon": false,
};

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
  "userId": PropTypes.string.isRequired,
  "isVerified": PropTypes.bool.isRequired,
  "isOwn": PropTypes.bool.isRequired,
  "showDeleteIcon": PropTypes.bool,
  "showReplyIcon": PropTypes.bool,

  // Methods
  "addNewComment": PropTypes.func,
  "getNewComments": PropTypes.func,
  "voteComment": PropTypes.func,
  "deleteCommment": PropTypes.func,
};

export default withStyles(styles)(CommentCard);
