import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import classNames from 'classnames';
import Img from 'react-image';
import Quill from 'react-quill';
import InfiniteScroll from 'react-infinite-scroller';
import { Manager, Target, Popper } from 'react-popper';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Portal from '@material-ui/core/Portal';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Collapse from '@material-ui/core/Collapse';
import Tooltip from '@material-ui/core/Tooltip';

// Material UI Icons
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';

// Custom Components
import Container from './layout/Container';
import CommentPanel from './utils/CommentPanel';
import ReportDialog from './utils/ReportDialog';
import ProperName from './utils/ProperName';
import ElapsedTime from '../helpers/ElapsedTime';

// Actions
import { getSinglePost, votePost, reportPost } from '../actions/blog.actions';
import { getComments,
  addNewComment,
  voteComment,
  deleteComment,
  clearCommentsList,
} from '../actions/comment.actions';

// Mock image
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
  "image": {
    width: '100%',
  },
});

class SinglePostPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      sortPopperOpen: false,
      reportDialogOpen: false,
      orderBy: 'useful',
      writeCommentDialogOpen: false,
      content: '',
      parentId: '',
      replyToComment: '',
      replyToUser: '',
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
    this.handleVote = this.handleVote.bind(this);
    this.handleReportDialogOpen = this.handleReportDialogOpen.bind(this);
    this.handleReportDialogClose = this.handleReportDialogClose.bind(this);
    this.handleSubmitReport = this.handleSubmitReport.bind(this);
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
      });
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

  handleVote = vote => e => {
    this.props.votePost(this.state.id, {
      uid: this.props.user._id,
      vote: vote,
    })
    .then(response => {
      if (response) {
        this.setState({
          post: response.post
        });
      }
    })
  }

  handleReportDialogOpen() {
    this.setState({
      "reportDialogOpen": true
    });
  }

  handleReportDialogClose() {
    this.setState({
      "reportDialogOpen": false
    });
  }

  handleSubmitReport(type, content, contact) {
    if (this.state.post) {
      this.props.reportPost(this.state.post._id, {
        type,
        content,
        contact,
      })
      .then(response => {
        this.setState({
          "reportDialogOpen": false
        });
      })
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
                    <Typography variant="display3" align="center" gutterBottom>{post.title}</Typography>
                    <Typography variant="title" align="center">
                      By <strong><ProperName  user={post.authorId} /></strong>
                    </Typography>
                    <Typography variant="caption" align="center" gutterBottom>{ElapsedTime(post.createdAt)}</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Img src={image} className={classes.image} />
                  </Grid>
                  <Grid item xs={8}>
                    <Paper className={classes.paper}>
                      <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </Paper>
                  </Grid>

                  <Grid item xs={8}>
                    <Paper className={classes.paper}>
                      <span>
                        <IconButton color="primary" onClick={this.handleVote("UPVOTE")}>
                          <ThumbUp />
                        </IconButton>
                        {_.isEmpty(post.upvote) ? 0 :post.upvote.length}
                      </span>

                      <span>
                        <IconButton color="default" onClick={this.handleVote("DOWNVOTE")}>
                          <ThumbDown />
                        </IconButton>
                        {_.isEmpty(post.downvote) ? 0 :post.downvote.length}
                      </span>

                      <span>
                        <IconButton color="default" onClick={this.handleReportDialogOpen}>
                          <Tooltip title="Report" id="tooltip-report">
                            <ErrorOutline />
                          </Tooltip>
                        </IconButton>
                      </span>
                    </Paper>
                  </Grid>
                </Grid>

                <Grid container justify="center">
                  <Grid item xs={8}>
                    <Typography variant="display1" align="center" gutterBottom>Comments</Typography>
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
                                  <Paper style={{
                                      width: 150,
                                    }}
                                  >
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
                          <Button variant="raised" color="primary" onClick={this.handleOpenWriteCommentDialog}>
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
                      <Button variant="raised" color="primary" disabled={!this.state.content} onClick={this.handleSubmitComment}>
                        Save
                      </Button>
                      <Button color="primary" onClick={this.handleCloseWriteCommentDialog}>
                        Cancel
                      </Button>
                    </DialogActions>
                  </Dialog>

                  <ReportDialog
                    open={this.state.reportDialogOpen}
                    handleSubmit={this.handleSubmitReport}
                    handleClose={this.handleReportDialogClose}
                  />
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
  votePost,
  reportPost,
  getComments,
  addNewComment,
  voteComment,
  deleteComment,
  clearCommentsList,
})(withStyles(styles)(SinglePostPage));
