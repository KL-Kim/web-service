import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import ThumbUp from 'material-ui-icons/ThumbUp';
import ThumbDown from 'material-ui-icons/ThumbDown';
import IconButton from 'material-ui/IconButton';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import { FormControl, FormControlLabel, FormLabel, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';

import Avatar from './Avatar';
import ProperName from './ProperName';
import ElapsedTime from '../../helpers/ElapsedTime';

import image from '../../../css/ikt-icon.gif';

const styles = theme => ({
  "paper": {
    padding: theme.spacing.unit * 3,
  },
  "buttonContainer": {
    "display": "flex",
    "justifyContent": "flex-end",
  },
});

class CommentPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "replyDialogOpen": false,
      "content": '',
      "upvoteNum": props.upvote,
      "downvoteNum": props.downvote,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleOpenReplyDialog = this.handleOpenReplyDialog.bind(this);
    this.handleCloseReplyDialog = this.handleCloseReplyDialog.bind(this);
    this.handleSubmitComment = this.handleSubmitComment.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleOpenReplyDialog() {
    this.setState({
      "replyDialogOpen": true,
    });
  }

  handleCloseReplyDialog() {
    this.setState({
      "replyDialogOpen": false,
    });
  }

  handleSubmitComment() {
    this.props.addNewComment({
      userId: this.props.user._id,
      replyToUser: this.props.owner._id,
      postId: this.props.postId,
      parentId: this.props.commentId,
      content: this.state.content + ' || Reply to @' + this.props.owner.username + ': ' + this.props.content,
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

  handleVoteComment = (vote) => e => {
    this.props.voteComment(this.props.commentId, {
      uid: this.props.user._id,
      postTitle: this.props.postTitle,
      vote: vote,
    })
    .then(response => {
      if (response) {
        this.setState({
          upvoteNum: response.comment.upvote.length,
          downvoteNum: response.comment.downvote.length,
        })
      }
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Paper className={classes.paper}>
          <Grid container>
            <Grid item xs={2}>
              <Avatar user={this.props.owner} type="SMALL" />
            </Grid>
            <Grid item xs={10}>
              <Typography type="title" gutterBottom>

                  <strong>
                    <ProperName user={this.props.owner} />
                  </strong>

                <span> - {ElapsedTime(this.props.createdAt)}</span>
              </Typography>
              <Typography type="body1" gutterBottom>{this.props.status === 'NORMAL' ? this.props.content : 'This comment violated the policy of iKoreaTown'}</Typography>
              {
                this.props.status === 'NORMAL'
                  ? (<Grid container alignItems="center">
                      <Grid item xs={6}>
                        <span>
                          <IconButton disabled={this.props.isOwn} onClick={this.handleVoteComment("UPVOTE")}>
                            <ThumbUp color={this.props.isOwn ? "inherit" : "primary"} />
                          </IconButton>
                          {this.state.upvoteNum}
                        </span>
                        <span>
                          <IconButton disabled={this.props.isOwn} onClick={this.handleVoteComment("DOWNVOTE")}>
                            <ThumbDown color={this.props.isOwn ? "inherit" : "action"}/>
                          </IconButton>
                          {this.state.downvoteNum}
                        </span>
                      </Grid>
                      <Grid item xs={6}>
                        <div className={classes.buttonContainer}>
                          <Button color="primary" disabled={this.props.isOwn} onClick={this.handleOpenReplyDialog}>
                            reply
                          </Button>
                        </div>
                      </Grid>
                    </Grid>)
                  : ''
              }
            </Grid>
          </Grid>
        </Paper>
        <div>
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
              <Button raised color="primary" disabled={!this.state.content} onClick={this.handleSubmitComment}>
                Save
              </Button>
              <Button color="primary" onClick={this.handleCloseReplyDialog}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

CommentPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "postId": PropTypes.string.isRequired,
  "postTitle": PropTypes.string,
  "commentId": PropTypes.string.isRequired,
  "status": PropTypes.string.isRequired,
  "content": PropTypes.string.isRequired,
  "owner": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "isOwn": PropTypes.bool.isRequired,
  "upvote": PropTypes.number.isRequired,
  "downvote": PropTypes.number.isRequired,
  "createdAt": PropTypes.string.isRequired,
  "addNewComment": PropTypes.func,
  "getNewComments": PropTypes.func,
  "voteComment": PropTypes.func,
};

export default withStyles(styles)(CommentPanel);
