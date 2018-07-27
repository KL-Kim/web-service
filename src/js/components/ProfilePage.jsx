import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// Custom Components
import Container from './layout/Container';
import Avatar from './utils/Avatar';
import ReviewPanel from './sections/ReviewPanel';
import BusinessPanel from './sections/BusinessPanel';
import CommentPanel from './sections/CommentPanel';
import ProperName from './utils/ProperName';

// Actions
import { openLoginDialog } from 'js/actions/app.actions';
import { getUserByUsername, favorOperation } from 'js/actions/user.actions';
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions';
import { getReviews, voteReview, clearReviewsList } from 'js/actions/review.actions';
import { 
    getComments,
    addNewComment,
    voteComment,
    deleteComment,
    clearCommentsList,
} from 'js/actions/comment.actions';

// Webstorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

const styles = theme => ({
    "section": {
        marginBottom: theme.spacing.unit * 4,
    },
    "paper": {
        padding: theme.spacing.unit * 2,
    },
});

class ProfilePage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            tabIndex: 0,

            reviewsLimit: 12,
            reviewsCount: 0,
            reviewsHasMore: false,
            
            commentLimit: 12,
            commentsCount: 0,
            commentsHasMore: false,
            
        };

        this.handleChange = this.handleChange.bind(this);
        this.tabContainer = this.tabContainer.bind(this);
        this.loadMoreReviews = this.loadMoreReviews.bind(this);
    }

    componentDidMount() {
        this.props.getUserByUsername(this.props.match.params.username)
            .then(response => {
                if (response) {
                    this.setState({
                        user: response.user
                    });

                    return response.user;
                }
            })
            .then(user => {
                if (user.favors) {
                    this.props.getBusinessList({
                        ids: user.favors,
                    });
                }
            });
    }

    componentWillUnmount() {
        this.props.clearBusinessList();
    }

    handleChange(e, value) {
        this.setState({
            tabIndex: value,
        });

        if (value === 1) {
            this.props.getReviews({
                'limit': this.state.reviewsLimit,
                'uid': this.state.user._id,
                'orderBy': 'new',
            }).then(response => {
                if (response) {
                  this.setState({
                    'reviewsHasMore': response.list.length < response.totalCount,
                    'reviewsCount': response.list.length,
                  });
                }
            });
        } else if (value == 2) {
            this.props.getComments({
                limit: this.state.commentsLimit,
                uid: this.state.user._id,
                orderBy: 'new',
            }).then(response => {
                if (response) {
                    this.setState({
                        commentsCount: response.list.length,
                        commentsHasMore: response.list.length < response.totalCount,
                    });
                }
            });
        }
    }

    loadMoreReviews() {
        this.props.getReviews({
            'limit': this.state.reviewsCount + this.state.reviewsLimit,
            'uid': this.state.user._id,
            'orderBy': 'new',
        }).then(response => {
            if (response) {
              this.setState({
                'reviewsHasMore': response.list.length < response.totalCount,
                'reviewsCount': response.list.length,
              });
            }
        });
    }

    tabContainer() {
        switch(this.state.tabIndex) {
            case 1:
                return (
                    <div>
                        {
                            <ReviewPanel
                                reviews={this.props.reviews}
                                totalCount={this.props.totalCount}
                                hasMore={this.state.reviewsHasMore}
                                loadMore={this.loadMoreReviews}
                                clearReviewsList={this.props.clearReviewsList}
                                isLoggedIn={this.props.isLoggedIn}
                                userId={_.isEmpty(this.props.user) ? '' : this.props.user._id}
                                voteReview={this.props.voteReview}
                                openLoginDialog={this.props.openLoginDialog}
                            />
                        }
                    </div>
                );

            case 2:
                return (
                    <div style={{ maxWidth: 720, margin: 'auto' }}>
                        <CommentPanel
                            hasMore={this.state.commentsHasMore}
                            loadMore={this.commentLoadMore}
                            commentsList={this.props.comments}
                            totalCount={this.props.totalCount}
                            isLoggedIn={this.props.isLoggedIn}
                            userId={_.isEmpty(this.props.user) ? '' : this.props.user._id}
                            openLoginDialog={this.props.openLoginDialog}
                            voteComment={this.props.voteComment}
                        />
                    </div>
                );
            default: 
                return (
                    <div>
                        <BusinessPanel 
                            businessList={this.props.businessList}
                            totalCount={this.props.totalCount}
                            isLoggedIn={this.props.isLoggedIn}
                            userId={_.isEmpty(this.props.user) ? '' : this.props.user._id}
                            favorOperation={this.props.favorOperation}
                            openLoginDialog={this.props.openLoginDialog}
                        />
                    </div>
                );
        }
    }

    render() {
        const { classes } = this.props;
        const { user } = this.state;

        return (
            <Container>
                <div>
                    {
                        user
                            ?  <div>
                                    <section className={classes.section}>
                                        <Grid container alignItems="center">
                                            <Grid item xs={6}>
                                                <Avatar type="BIG" user={user} />
                                            </Grid>

                                            <Grid item xs={6}>
                                                <Typography variant="display1" gutterBottom><ProperName user={user} /></Typography>
                                                <Typography variant="title" gutterBottom>{user.username}</Typography>
                                                <Typography variant="body2">Gender: {user.gender}</Typography>

                                            </Grid>
                                        </Grid>
                                    </section>

                                    <section className={classes.section}>
                                        <Tabs
                                            value={this.state.tabIndex}
                                            onChange={this.handleChange}
                                            indicatorColor="primary"
                                            textColor="primary"
                                            centered
                                        >
                                            <Tab label="Favors" />
                                            <Tab label="Reviews" />
                                            <Tab label="Comments" />
                                        </Tabs>
                                        <br />

                                        {this.tabContainer()}
                                    </section>
                                </div>
                            :   null
                    }
                </div>
            </Container>
        );
    }
}

ProfilePage.propTypes = {
    "classes": PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return {
        "user": state.userReducer.user,
        "isLoggedIn": state.userReducer.isLoggedIn,
        "businessList": state.businessReducer.businessList,
        "reviews": state.reviewReducer.reviews,
        "comments": state.commentReducer.comments,
    };
};

export default connect(mapStateToProps, { 
    getUserByUsername, 
    openLoginDialog,
    getBusinessList, 
    favorOperation,
    clearBusinessList,
    getReviews,
    voteReview,
    clearReviewsList,
    getComments,
    voteComment,
    deleteComment,
    clearCommentsList,
})(withStyles(styles)(ProfilePage));
