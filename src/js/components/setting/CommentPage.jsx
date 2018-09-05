import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Custom Components
import Container from '../layout/Container';
import CommentPanel from '../sections/CommentPanel';

// Actions
import { getComments, clearCommentsList } from 'js/actions/comment.actions';

// Common Style
import { root } from 'assets/jss/common.style';

const styles = (theme) => ({
  "root": {
    ...root(theme),
    maxWidth: 720,
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

  componentWillUnmount() {
    this.props.clearCommentsList();
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
    });
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
    const { classes } = this.props;

    return isEmpty(this.props.user) ? null : (
      <Container>
        <div className={classes.root}>
          <Typography variant="title" gutterBottom>My Comments</Typography>

          <CommentPanel
            hasMore={this.state.hasMore}
            loadMore={this.loadMore}
            showDeleteIcon
          />
        </div>
      </Container>
    );
  }
}

CommentsPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "userId": PropTypes.string.isRequired,
  "user": PropTypes.object.isRequired,

  // Methods
  "getComments": PropTypes.func.isRequired,
  "clearCommentsList": PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
  };
};

export default connect(mapStateToProps, { 
  getComments, 
  clearCommentsList, 
})(withStyles(styles)(CommentsPage));
