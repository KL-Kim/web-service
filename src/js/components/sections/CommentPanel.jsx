import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

// Material UI Icons
import Edit from '@material-ui/icons/Edit'

// Custom Components
import CommentCard from './cards/CommentCard';

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
    componentWillUnmount() {
        if (this.props.clearCommentsList) {
            this.props.clearCommentsList();
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

        return _.isEmpty(this.props.commentsList) 
            ? <Typography align="center">None</Typography> 
            : (
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
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={this.props.loadMore}
                        hasMore={this.props.hasMore}
                        loader={<div style={{ textAlign: 'center' }} key={0}>
                                <CircularProgress size={30} />
                                </div>}
                    >
                        <Grid container justify="center">
                            {
                                this.props.commentsList.map(comment => (
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
                                            userId={this.props.userId}
                                            isVerified={this.props.isVerified}
                                            isOwn={comment.userId._id === this.props.userId}
                                            showReplyIcon={this.props.showReplyIcon}
                                            showDeleteIcon={this.props.showDeleteIcon}

                                            addNewComment={this.props.addNewComment}
                                            getNewComments={this.props.getNewComments}
                                            voteComment={this.props.voteComment}
                                            deleteComment={this.props.deleteComment}
                                        />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </InfiniteScroll>
                    {
                    this.props.hasMore
                        ? null
                        : <Typography variant="caption" align="center">
                            --- No more comments---
                        </Typography>
                    }
                </div>
        )
    }
}

CommentPanel.defaultProps = {
    "isLoggedIn": false,
    "userId": '',
    "commentsList": [],
    "hasMore": false,
    "loadMore": () => {},
}

CommentPanel.propTypes = {
    "classes": PropTypes.object.isRequired,
    "isLoggedIn": PropTypes.bool.isRequired,
    "userId": PropTypes.string.isRequired,
    "isVerified": PropTypes.bool.isRequired,
    "hasMore": PropTypes.bool.isRequired,
    "commentsList": PropTypes.array.isRequired,
    "totalCount": PropTypes.number,

    // Methods
    "addNewComment": PropTypes.func,
    "getNewComments": PropTypes.func,
    "voteComment": PropTypes.func,
    "deleteCommment": PropTypes.func,
};

export default withStyles(styles)(CommentPanel);