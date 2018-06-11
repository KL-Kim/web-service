import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import Img from 'react-image';
import InfiniteScroll from 'react-infinite-scroller';
import { Manager, Target, Popper } from 'react-popper';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import Share from 'material-ui-icons/Share';
import ErrorOutline from 'material-ui-icons/ErrorOutline';
import { FormControl, FormControlLabel, FormLabel, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Portal from 'material-ui/Portal';
import { MenuList, MenuItem } from 'material-ui/Menu';
import ClickAwayListener from 'material-ui/utils/ClickAwayListener';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import { ListItemText } from 'material-ui/List';

import Container from './utils/Container';
import CommentPanel from './utils/CommentPanel';
import ProperName from './utils/ProperName';
import ElapsedTime from '../helpers/ElapsedTime';
import { getSinglePost } from '../actions/blog.actions';
import { getComments,
  addNewComment,
  voteComment,
  deleteComment,
  clearCommentsList,
} from '../actions/comment.actions';

import config from '../config/config';
import image from '../../css/ikt-icon.gif';

const styles = theme => ({
  "paper": {
    padding: theme.spacing.unit * 5,
    color: theme.palette.text.secondary
  },
  "popperClose": {
    pointerEvents: 'none',
  },
  "rightIcon": {
    marginLeft: theme.spacing.unit,
  },
  "buttonContainer": {
    "display": "flex",
    "justifyContent": "flex-end",
  },
});

class SinglePostPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      sortPopperOpen: false,
      orderBy: 'useful',
      writeCommentDialogOpen: false,
      content: '',
      parentId: '',
      replyToComment: '',
      replyToUser: '',
      hasMore: false,
      limit: 5,
      count: 0,
      hasMore: false,
    };

    this.state.id = props.match.params.id;

    this.handleChange = this.handleChange.bind(this);
    this.handleToggleSortPopper = this.handleToggleSortPopper.bind(this);
    this.handleSortPopperClose = this.handleSortPopperClose.bind(this);
    this.handleOpenWriteCommentDialog = this.handleOpenWriteCommentDialog.bind(this);
    this.handleCloseWriteCommentDialog = this.handleCloseWriteCommentDialog.bind(this);
    this.handleSubmitComment = this.handleSubmitComment.bind(this);
    this.getNewComments = this.getNewComments.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    if (_.isEmpty(this.state.id)) this.props.history.push('/404');

    this.props.getSinglePost(this.state.id)
      .then(response => {
        if (response && response.post.status === 'PUBLISHED') {
          this.setState({
            post: response.post
          });
        } else {
          this.props.history.push('/404');
        }
      })
      .then(() => {
        this.props.getComments({
          pid: this.state.id,
          orderBy: 'useful',
        }).then(response => {
          if (response) {
            this.setState({
              count: this.state.limit,
              hasMore: this.state.limit < response.totalCount,
            });
          }
        });
      })

  }

  componentWillUnmount() {
    this.props.clearCommentsList();
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleToggleSortPopper() {
    console.log(this.state.sortPopperOpen);

    this.setState({
      sortPopperOpen: !this.state.sortPopperOpen
    });
  }

  handleSortPopperClose(e) {
    if (this.target.contains(e.target)) {
      return;
    }

    this.setState({
      sortPopperOpen: false
    });
  }

  handleSelectSort = sort => e => {
    this.props.getComments({
      pid: this.state.id,
      orderBy: sort
    }).then(response => {
      if (response) {
        this.setState({
          orderBy: sort,
          sortPopperOpen: false,
        });
      }
    });
  }

  handleOpenWriteCommentDialog() {
    this.setState({
      writeCommentDialogOpen: true,
    });
  }

  handleCloseWriteCommentDialog() {
    this.setState({
      writeCommentDialogOpen: false,
      content: '',
    });
  }

  handleSubmitComment() {
    if (!this.props.isLoggedIn) {
      this.props.history.push('/signin');
    }

    if (!_.isEmpty(this.props.user) && this.state.id && this.state.content) {
      this.props.addNewComment({
        userId: this.props.user._id,
        postId: this.state.id,
        content: this.state.content,
      })
      .then(response => {
        if (response) {
          return this.props.getComments({
            pid: this.state.id,
            orderBy: 'new',
          })
        }

        return ;
      })
      .then(response => {
        this.setState({
          writeCommentDialogOpen: false,
          content: '',
          orderBy: 'new'
        });
      });
    }
  }

  getNewComments() {
    if (this.state.id) {
      this.props.getComments({
        pid: this.state.id,
        limit: this.state.count,
        orderBy: 'new',
      }).then(response => {
        if (response) {
          this.setState({
            orderBy: 'new',
            count: this.state.count,
            hasMore: this.state.count < response.totalCount,
          });
        }
      });
    }
  }

  loadMore() {
    this.props.getComments({
      pid: this.state.id,
      orderBy: this.state.orderBy,
      limit: this.state.count + this.state.limit,
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

  render() {
    const { classes, comments } = this.props;
    const { post } = this.state;

    return (
      <Container>
        {
          _.isEmpty(post) ? <div></div>
            : <div>
                <Grid container justify="center">
                  <Grid item xs={12}>
                    <Typography type="display3" align="center" gutterBottom>{post.title}</Typography>
                    <Typography type="title" align="center">By <strong><ProperName  user={post.authorId} /></strong></Typography>
                    <Typography type="caption" align="center" gutterBottom>{ElapsedTime(post.createdAt)}</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Paper className={classes.paper}>
                      <Typography type="body1">
                        {post.content}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Grid container justify="center">
                  <Grid item xs={8}>
                    <Typography type="display1" align="center" gutterBottom>Comments</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Grid container>
                      <Grid item xs={6}>
                        <Manager>
                          <Target>
                            <div ref={node => {
                                this.target = node;
                              }}
                            >
                              <Button
                                aria-owns={this.state.sortPopperOpen ? 'menu-list-collapse' : null}
                                aria-haspopup="true"
                                onClick={this.handleToggleSortPopper}
                              >
                                {
                                  this.state.orderBy ? this.state.orderBy : "Sort By"
                                }
                                <ExpandMoreIcon className={classes.rightIcon} />
                              </Button>
                            </div>
                          </Target>
                          <Portal>
                            <Popper
                              placement="bottom-start"
                              eventsEnabled={this.state.sortPopperOpen}
                              className={classNames({ [classes.popperClose]: !this.state.sortPopperOpen })}
                            >
                              <ClickAwayListener onClickAway={this.handleSortPopperClose}>
                                <Collapse in={this.state.sortPopperOpen} id="menu-list-collapse" style={{ transformOrigin: '0 0 0' }}>
                                  <Paper style={{ margin: 3 }}>
                                    <MenuList role="menu">
                                      <MenuItem selected={this.state.orderBy === 'useful'} onClick={this.handleSelectSort('useful')}>
                                        <ListItemText primary="Useful" />
                                      </MenuItem>
                                      <MenuItem selected={this.state.orderBy === 'new'} onClick={this.handleSelectSort('new')}>
                                        <ListItemText primary="New" />
                                      </MenuItem>
                                    </MenuList>
                                  </Paper>
                                </Collapse>
                              </ClickAwayListener>
                            </Popper>
                          </Portal>
                        </Manager>
                      </Grid>
                      <Grid item xs={6}>
                        <div className={classes.buttonContainer}>
                          <Button raised color="primary" onClick={this.handleOpenWriteCommentDialog}>
                            Write comment
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
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
                              commentId={comment._id}
                              postId={this.state.id}
                              postTitle={this.state.post.title}
                              parentComment={comment.parentId}
                              replyToUser={comment.replyToUser}
                              status={comment.status}
                              content={comment.content}
                              owner={comment.userId}
                              user={this.props.user}
                              isOwn={comment.userId._id === this.props.user._id}
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

                <div>
                  <Dialog fullWidth
                    open={this.state.writeCommentDialogOpen}
                    onClose={this.handleCloseWriteCommentDialog}
                    aria-labelledby="comment-dialog-title"
                    aria-describedby="comment-dialog-description"
                  >
                    <DialogTitle id="comment-dialog-title">
                      Write Comment
                    </DialogTitle>
                    <DialogContent id="comment-dialog-description">
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
                      <Button color="primary" onClick={this.handleCloseWriteCommentDialog}>
                        Cancel
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </div>
        }
      </Container>
    );
  }
}

SinglePostPage.propTypes = {
  "classes": PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "comments": state.commentReducer.comments,
    "totalCount": state.commentReducer.totalCount,
  };
};

export default connect(mapStateToProps, {
  getSinglePost,
  getComments,
  addNewComment,
  voteComment,
  deleteComment,
  clearCommentsList,
})(withStyles(styles)(SinglePostPage));
