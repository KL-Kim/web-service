import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Img from 'react-image';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
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
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

// Custom Components
import Container from './layout/Container';
import CommentPanel from './sections/CommentPanel';
import ReportDialog from 'js/components/dialogs/ReportDialog';
import VerifyDialog from 'js/components/dialogs/VerifyDialog';
import ProperName from './utils/ProperName';
import ThumbButton from './utils/ThumbButton';
import WriteCommentDialog from 'js/components/dialogs/WriteCommentDialog';

// Actions
import { openLoginDialog } from 'js/actions/app.actions'; 
import { getSinglePost, votePost, reportPost } from 'js/actions/blog.actions';
import { getComments,
  addNewComment,
  voteComment,
  deleteComment,
  clearCommentsList,
} from 'js/actions/comment.actions';

// Mock image
import image from 'img/background_1.jpg';

const styles = theme => ({
  "root": {
    maxWidth: 760,
    margin: 'auto',
  },
  "section": {
    marginBottom: theme.spacing.unit * 3,
  },
  "paper": {
    padding: theme.spacing.unit * 4,
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

    this.handleToggleSortPopover = this.handleToggleSortPopover.bind(this);
    this.handleSortPopoverClose = this.handleSortPopoverClose.bind(this);
    this.handleWriteCommentDialogOpen = this.handleWriteCommentDialogOpen.bind(this);
    this.handleWriteCommentDialogClose = this.handleWriteCommentDialogClose.bind(this);
    this.handleVotePost = this.handleVotePost.bind(this);
    this.handleReportDialogOpen = this.handleReportDialogOpen.bind(this);
    this.handleReportDialogClose = this.handleReportDialogClose.bind(this);
    this.handleSubmitReport = this.handleSubmitReport.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.getNewComments = this.getNewComments.bind(this);
  }

  componentDidMount() {
    if (_.isEmpty(this.state.id)) this.props.history.push('/404');

    this.props.getSinglePost(this.state.id)
      .then(response => {
        if (response) {
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
        })
        .then(response => {
          if (response) {
            this.setState({
              count: response.list.length,
              hasMore: response.list.length < response.totalCount,
            });
          }
        });
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
    });

    this.setState({
      orderBy: sort,
      sortPopoverOpen: false,
    });
  }

  handleWriteCommentDialogOpen() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return ;
    }

    this.setState({
      writeCommentDialogOpen: true,
    });
  }

  handleWriteCommentDialogClose() {
    this.setState({
      writeCommentDialogOpen: false,
    });
  }

  getNewComments() {
    if (this.state.id) {
      this.props.getComments({
        pid: this.state.id,
        limit: this.state.limit,
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

  

  handleVotePost = vote => e => {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return ;
    }
    
    if (this.state.id && !_.isEmpty(this.props.user)) {
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
    if (!_.isEmpty(this.state.post)) {
      this.props.reportPost(this.state.post._id, {
        type,
        content,
        contact,
      });
      
      this.setState({
        "reportDialogOpen": false
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
          count: response.list.length,
          hasMore: response.list.length < response.totalCount,
        })
      }
    })
  }

  render() {
    const { classes } = this.props;
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
                    <ThumbButton type="up" count={_.isEmpty(post.upvote) ? 0 :post.upvote.length} handleSubmit={this.handleVotePost("UPVOTE")} />
                  </span>

                  <span className={classes.iconButton}>
                    <ThumbButton type="down" count={_.isEmpty(post.downvote) ? 0 :post.downvote.length} handleSubmit={this.handleVotePost("DOWNVOTE")} />
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

          
          <div>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography variant="title" gutterBottom>Comments</Typography>
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  onClick={this.handleToggleSortPopover}
                  buttonRef={node => {
                    this.sortAnchorEl = node;
                  }}
                >
                  
                  Sort By
                  {
                    this.state.sortPopoverOpen
                      ? <ArrowDropUp />
                      : <ArrowDropDown />
                  }
                </Button>
              </Grid>
            </Grid>
          </div>
          
          <CommentPanel
            hasMore={this.state.hasMore}
            loadMore={this.loadMore}
            
            showReplyIcon
            getNewComments={this.getNewComments}

            addNew
            onFocusAddNew={this.handleWriteCommentDialogOpen}
          />

          <div id="modal-container">
            <Popover
              open={this.state.sortPopoverOpen}
              anchorEl={this.sortAnchorEl}
              onClose={this.handleSortPopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <div>
                <MenuList role="menu" style={{ width: 150 }}>
                  <MenuItem selected={this.state.orderBy === 'useful'} onClick={this.handleSelectSort('useful')}>
                    <ListItemText primary="Useful" />
                  </MenuItem>
                  <MenuItem selected={this.state.orderBy === 'new'} onClick={this.handleSelectSort('new')}>
                    <ListItemText primary="New" />
                  </MenuItem>
                </MenuList>
              </div>
            </Popover>

            <WriteCommentDialog 
              open={this.state.writeCommentDialogOpen} 
              onClose={this.handleWriteCommentDialogClose} 
              isLoggedIn={this.props.isLoggedIn}
              userId={_.isEmpty(this.props.user) ? '' : this.props.user._id}
              isVerified={this.props.isVerified}
              postId={this.state.id}
              addNewComment={this.props.addNewComment}
              getNewComments={this.getNewComments}
            />

            <ReportDialog
              open={this.state.reportDialogOpen}
              onSubmit={this.handleSubmitReport}
              onClose={this.handleReportDialogClose}
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
    "isLoggedIn": state.userReducer.isLoggedIn,
    "isVerified": state.userReducer.isUserVerified,
    "user": state.userReducer.user,
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
