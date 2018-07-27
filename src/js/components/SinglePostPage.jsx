import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Img from 'react-image';
import InfiniteScroll from 'react-infinite-scroller';

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
import Popover from '@material-ui/core/Popover';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';

// Material UI Icons
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Custom Components
import Container from './layout/Container';
import CommentPanel from './sections/CommentPanel';
import ReportDialog from './utils/ReportDialog';
import ProperName from './utils/ProperName';
import ThumbButton from './utils/ThumbButton';

// Actions
import { getSinglePost, votePost, reportPost } from 'js/actions/blog.actions';
import { getComments,
  addNewComment,
  voteComment,
  deleteComment,
  clearCommentsList,
} from 'js/actions/comment.actions';
import { openLoginDialog } from 'js/actions/app.actions';

// Mock image
import image from 'img/background_1.jpg';

const styles = theme => ({
  "root": {
    maxWitdh: 760,
    margin: 'auto',
  },
  "section": {
    marginBottom: theme.spacing.unit * 3,
  },
  "paper": {
    padding: theme.spacing.unit * 4,
  },
  "rightIcon": {
    marginLeft: theme.spacing.unit,
  },
  "image": {
    width: '100%',
    borderRadius: "6px",
    boxShadow: "0 5px 15px -8px rgba(0, 0, 0, 0.24), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },
  "iconButton": {
    marginRight: theme.spacing.unit,
  },
});

class SinglePostPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      sortPopoverOpen: false,
      reportDialogOpen: false,
      orderBy: 'useful',
      writeCommentDialogOpen: false,
      content: '',
      parentId: '',
      replyToComment: '',
      replyToUser: '',
      limit: 10,
      count: 0,
      hasMore: false,
    };

    this.state.id = props.match.params.id;

    this.handleChange = this.handleChange.bind(this);
    this.handleToggleSortPopover = this.handleToggleSortPopover.bind(this);
    this.handleSortPopoverClose = this.handleSortPopoverClose.bind(this);
    this.handleOpenWriteCommentDialog = this.handleOpenWriteCommentDialog.bind(this);
    this.handleCloseWriteCommentDialog = this.handleCloseWriteCommentDialog.bind(this);
    this.handleSubmitComment = this.handleSubmitComment.bind(this);
    this.getNewComments = this.getNewComments.bind(this);
    this.handleVoteComment = this.handleVoteComment.bind(this);
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
          limit: this.state.limit,
          pid: this.state.id,
          orderBy: this.state.orderBy,
        }).then(response => {
          if (response) {
            this.setState({
              count: response.list.length,
              hasMore: response.list.length < response.totalCount,
            });
          }
        });
      });
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleToggleSortPopover() {
    this.setState({
      sortPopoverOpen: !this.state.sortPopoverOpen
    });
  }

  handleSortPopoverClose(e) {
    this.setState({
      sortPopoverOpen: false
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
          sortPopoverOpen: false,
        });
      }
    });
  }

  handleOpenWriteCommentDialog() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return;
    }

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
      this.props.openLoginDialog();

      return;
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
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
      });
    }
  }

  handleVoteComment = vote => e => {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return;
    }

    if (this.state.id) {
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
      });
    }
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
          count: response.list.length,
          hasMore: response.list.length < response.totalCount,
        })
      }
    })
  }

  render() {
    const { classes, comments } = this.props;
    const { post } = this.state;

    return _.isEmpty(post) ? null : (
      <Container>
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid item xs={12} className={classes.section}>
              <Typography variant="display2" align="center" gutterBottom>{post.title}</Typography>
              <Typography variant="title" align="center">
                By <strong><ProperName  user={post.authorId} /></strong>
              </Typography>
            </Grid>

            <Grid item xs={12} className={classes.section}>
              <Img src={image} className={classes.image} />
            </Grid>

            <Grid item xs={12} className={classes.section}>
              <Paper className={classes.paper}>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                <div>
                  <span className={classes.iconButton}>
                    <ThumbButton type="up" count={_.isEmpty(post.upvote) ? 0 :post.upvote.length} handleSubmit={this.handleVoteComment("UPVOTE")} />
                  </span>

                  <span className={classes.iconButton}>
                    <ThumbButton type="down" count={_.isEmpty(post.downvote) ? 0 :post.downvote.length} handleSubmit={this.handleVoteComment("DOWNVOTE")} />
                  </span>

                  <span>
                    <IconButton
                      className={classes.iconButton}
                      color="default"
                      onClick={this.handleReportDialogOpen}>
                      <Tooltip title="Report" id="tooltip-report">
                        <ErrorOutline />
                      </Tooltip>
                    </IconButton>
                  </span>
                </div>
              </Paper>
            </Grid>
          </Grid>

          <Grid container justify="center">
            <Grid item xs={12}>
              <Typography variant="display1" align="center" gutterBottom>Comments</Typography>
            </Grid>

            <Grid item xs={12} >
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={this.handleToggleSortPopover}
                    buttonRef={node => {
                      this.sortAnchorEl = node;
                    }}
                  >
                    {
                      this.state.orderBy ? this.state.orderBy : "Sort By"
                    }
                    <ExpandMoreIcon className={classes.rightIcon} />
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="raised" color="primary" onClick={this.handleOpenWriteCommentDialog}>
                    Write Comment
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <CommentPanel
            hasMore={this.state.hasMore}
            loadMore={this.loadMore}
            commentsList={this.props.comments}
            totalCount={this.props.totalCount}
            isLoggedIn={this.props.isLoggedIn}
            userId={_.isEmpty(this.props.user) ? '' : this.props.user._id}
            openLoginDialog={this.props.openLoginDialog}
            showReplyIcon
            addNewComment={this.props.addNewComment}
            voteComment={this.props.voteComment}
            deleteComment={this.props.deleteComment}
            getNewComments={this.getNewComments}
          />

          <div id="modal-container">
            <Popover
              open={this.state.sortPopoverOpen}
              anchorEl={this.sortAnchorEl}
              onClose={this.handleSortPopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <div>
                <MenuList role="menu">
                  <MenuItem selected={this.state.orderBy === 'useful'} onClick={this.handleSelectSort('useful')}>
                    <ListItemText primary="Useful" />
                  </MenuItem>
                  <MenuItem selected={this.state.orderBy === 'new'} onClick={this.handleSelectSort('new')}>
                    <ListItemText primary="New" />
                  </MenuItem>
                </MenuList>
              </div>
            </Popover>

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
  openLoginDialog,
})(withStyles(styles)(SinglePostPage));
