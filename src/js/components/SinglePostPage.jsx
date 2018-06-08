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
import Table, { TableBody, TableCell, TableHead, TableRow, } from 'material-ui/Table';
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
import { getComments, addNewComment } from '../actions/comment.actions';

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
      open: false,
      sortBy: 'useful',
    };

    this.state.id = props.match.params.id;

    this.handleSortPopperOpen = this.handleSortPopperOpen.bind(this);
    this.handleSortPopperClose = this.handleSortPopperClose.bind(this);
  }

  componentDidMount() {
    if (this.state.id) {
      this.props.getSinglePost(this.state.id)
        .then(response => {
          if (response) {
            this.setState({
              post: response.post
            });
          } else {
            this.props.history.push('/404');
          }
        });
      this.props.getComments({
        pid: this.state.id
      });
    } else {
      this.props.history.push('/404');
    }
  }

  handleSortPopperOpen(e) {
    console.log(this.state.open);

    this.setState({
      open: !this.state.open
    });
  }

  handleSortPopperClose() {
    this.setState({
      open: false
    });
  }

  handleSelectSort = sort => e => {
    this.setState({
      sortBy: sort,
      open: false,
    });
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
                                aria-owns={this.state.open ? 'menu-list-collapse' : null}
                                aria-haspopup="true"
                                onClick={this.handleSortPopperOpen}
                              >
                                {
                                  this.state.sortBy ? this.state.sortBy : "Sort By"
                                }
                                <ExpandMoreIcon className={classes.rightIcon} />
                              </Button>
                            </div>
                          </Target>
                          <Portal>
                            <Popper
                              placement="bottom-start"
                              eventsEnabled={this.state.open}
                              className={classNames({ [classes.popperClose]: !this.state.open })}
                            >
                              <ClickAwayListener onClickAway={this.handleSortPopperClose}>
                                <Collapse in={this.state.open} id="menu-list-collapse" style={{ transformOrigin: '0 0 0' }}>
                                  <Paper style={{ margin: 3 }}>
                                    <MenuList role="menu">
                                      <MenuItem selected={this.state.sortBy === 'useful'} onClick={this.handleSelectSort('useful')}>
                                        <ListItemText primary="Useful" />
                                      </MenuItem>
                                      <MenuItem selected={this.state.sortBy === 'newest'} onClick={this.handleSelectSort('newest')}>
                                        <ListItemText primary="Newest" />
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
                          <Button raised color="primary">
                            Write comment
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                  {
                    _.isEmpty(comments) ? ''
                      : comments.map((comment, index) => (
                        <Grid item xs={8} key={index}>
                          <CommentPanel
                            status={comment.status}
                            content={comment.content}
                            user={comment.userId}
                            upVote={comment.upVote.length}
                            downVote={comment.downVote.length}
                            createdAt={comment.createdAt}
                          />
                        </Grid>
                      ))
                  }
                  <Grid item xs={8}>
                    <FormControl fullWidth required>
                      <InputLabel htmlFor="content">Content</InputLabel>
                      <Input
                        type="text"
                        id="content"
                        multiline
                        rows={5}
                        name="content"
                        value={this.state.content}
                        onChange={this.handleChange}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
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
    "comments": state.commentReducer.comments,
    "totalCount": state.commentReducer.totalCount,
  };
};

export default connect(mapStateToProps, {
  getSinglePost,
  getComments,
  addNewComment,
})(withStyles(styles)(SinglePostPage));
