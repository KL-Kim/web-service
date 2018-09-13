import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

// Material UI Icons
import Edit from '@material-ui/icons/Edit'

// Custom Components
import CommentCard from './cards/CommentCard';
import LoadingProgress from 'js/components/utils/LoadingProgress';

// Actions
import { openLoginDialog } from 'js/actions/app.actions'; 
import { 
    addNewComment,
    voteComment,
    deleteComment,
} from 'js/actions/comment.actions';

const styles = theme => ({
    "root": {
        padding: theme.spacing.unit * 4,
    },
    "iconButton": {
        marginRight: theme.spacing.unit
    },
    "itemWrapper": {
        marginBottom: theme.spacing.unit * 2,
    }
});

class CommentPanel extends Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.comments !== this.props.comments) {
            return true;
        }
        else if (nextProps.hasMore !== this.props.hasMore) {
            return true;
        }
        else {
            return false;
        }
    }

    handleFocus(e) {
        if (this.props.onFocusAddNew) {
            this.props.onFocusAddNew();
            e.target.blur();
        }
    }
 
    render() {
        const { classes } = this.props;

        if (this.props.totalCount === 0 && this.props.isFetching) {
            return <LoadingProgress isLoading={this.props.isFetching} />;
        }

        return (
            <div>
                {
                    this.props.addNew
                        ?   <div className={classes.itemWrapper}>
                                <Card>
                                    <CardContent>
                                        <FormControl fullWidth>
                                            <Input
                                                id="add-new"
                                                type="text"
                                                name="new"
                                                placeholder="Any ideas?"
                                                autoComplete="off"
                                                onFocus={this.handleFocus.bind(this)}
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <Edit />
                                                    </InputAdornment>
                                                }
                                            />
                                        </FormControl>
                                    </CardContent>
                                </Card>
                            </div>
                        :   null
                }
                {
                    isEmpty(this.props.comments) 
                        ?   <Typography align="center">None</Typography> 
                        :   <InfiniteScroll
                                pageStart={0}
                                loadMore={this.props.loadMore}
                                hasMore={this.props.hasMore}
                                loader={<LoadingProgress isLoading key={0} />}
                            >
                                <Grid container justify="center">
                                    {
                                        this.props.comments.map(comment => (
                                            <Grid item xs={12} key={comment._id} className={classes.itemWrapper}>
                                                <CommentCard
                                                    commentId={comment._id}
                                                    parentComment={comment.parentId}
                                                    replyToUser={comment.replyToUser}
                                                    status={comment.status}
                                                    content={comment.content}
                                                    owner={comment.userId}
                                                    createdAt={comment.createdAt}
                                                    upvoteCount={comment.upvote.length}
                                                    downvoteCount={comment.downvote.length}
                                                    postId={comment.postId._id}
                                                    postTitle={comment.postId.title}

                                                    isLoggedIn={this.props.isLoggedIn}
                                                    userId={isEmpty(this.props.user) ? '' : this.props.user._id}
                                                    isVerified={this.props.isVerified}
                                                    isOwn={isEmpty(this.props.user) ? false : this.props.user._id === comment.userId._id}
                                                    showReplyIcon={this.props.showReplyIcon}
                                                    showDeleteIcon={this.props.showDeleteIcon}

                                                    addNewComment={this.props.addNewComment}
                                                    getNewComments={this.props.getNewComments}
                                                    voteComment={this.props.voteComment}
                                                    deleteComment={this.props.deleteComment}
                                                    openLoginDialog={this.props.openLoginDialog}

                                                />
                                            </Grid>
                                        ))
                                    }
                                </Grid>
                            </InfiniteScroll>
                }
                {
                    this.props.hasMore || isEmpty(this.props.comments) 
                        ?   null
                        :   <Typography variant="caption" align="center">
                                --- No More Comments ---
                            </Typography>
                }
            </div>
        );
    }
}

CommentPanel.defaultProps = {
    "isLoggedIn": false,
    "user": {},
    "comments": [],
    "hasMore": false,
    "loadMore": () => {},
};

CommentPanel.propTypes = {
    "classes": PropTypes.object.isRequired,
    "isLoggedIn": PropTypes.bool.isRequired,
    "user": PropTypes.object.isRequired,
    "hasMore": PropTypes.bool.isRequired,
    "comments": PropTypes.array.isRequired,
    "totalCount": PropTypes.number.isRequired,
    "isFetching": PropTypes.bool.isRequired,

    // Methods
    "addNewComment": PropTypes.func,
    "voteComment": PropTypes.func,
    "deleteCommment": PropTypes.func,
    "getNewComments": PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
    return {
        "isLoggedIn": state.userReducer.isLoggedIn,
        "isVerified": state.userReducer.isUserVerified,
        "user": state.userReducer.user,
        "comments": state.commentReducer.comments,
        "totalCount": state.commentReducer.totalCount,
        "isFetching": state.commentReducer.isFetching,
    };
};

export default connect(mapStateToProps, {
    addNewComment,
    voteComment,
    deleteComment,
    openLoginDialog,
})(withStyles(styles)(CommentPanel));