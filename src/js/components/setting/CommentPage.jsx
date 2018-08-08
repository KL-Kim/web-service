import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Components
import Container from '../layout/Container';
import CommentPanel from '../sections/CommentPanel';

// Actions
import { getComments, deleteComment } from 'js/actions/comment.actions';

const styles = (theme) => ({
  "root": {
    maxWidth: 720,
    margin: 'auto'
  },
  "itemWrapper": {
    marginBottom: theme.spacing.unit * 2,
  },
});

class CommentsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 20,
      count: 0,
      hasMore: false,
    };

    this.loadMore = this.loadMore.bind(this);
    this.getNewComments = this.getNewComments.bind(this);
  }

  componentDidMount() {
    if (this.props.userId) {
      this.props.getComments({
        limit: this.state.limit,
        uid: this.props.userId,
        orderBy: 'new',
      }).then(response => {
        if (response) {
          this.setState({
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
      });
    }
  }

  loadMore() {
    this.props.getComments({
      limit: this.state.limit,
      uid: this.props.userId,
      orderBy: 'new',
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

  getNewComments() {
    if (this.props.userId) {
      this.props.getComments({
        limit: this.state.limit,
        uid: this.props.userId,
        orderBy: 'new',
      }).then(response => {
        if (response) {
          this.setState({
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
      });
    }
  }

  render() {
    const { classes, comments } = this.props;

    return _.isEmpty(this.props.user) ? null : (
      <Container>
        <div className={classes.root}>
          <Typography variant="display1">My Comments</Typography>
          <br />

          <CommentPanel
            hasMore={this.state.hasMore}
            loadMore={this.loadMore}
            commentsList={this.props.comments}
            totalCount={this.props.totalCount}
            isLoggedIn={this.props.isLoggedIn}
            userId={this.props.user._id}
            showDeleteIcon
            deleteComment={this.props.deleteComment}
            getNewComments={this.getNewComments}
          />
        </div>
      </Container>
    );
  }
}

CommentsPage.propTypes = {
  "classes": PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "isLoggedIn": state.userReducer.isLoggedIn,
    "user": state.userReducer.user,
    "comments": state.commentReducer.comments,
    "totalCount": state.commentReducer.totalCount,
  };
};

export default connect(mapStateToProps, { getComments, deleteComment })(withStyles(styles)(CommentsPage));
