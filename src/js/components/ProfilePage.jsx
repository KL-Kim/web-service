import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
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
import { getUserByUsername } from 'js/actions/user.actions';
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions';
import { getReviews , clearReviewsList } from 'js/actions/review.actions';
import { getComments, clearCommentsList } from 'js/actions/comment.actions';

// Common Style
import { root } from 'assets/jss/common.style';

const styles = theme => ({
    "root": root(theme),
    "section": {
        marginBottom: theme.spacing.unit * 4,
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
                if (!isEmpty(user.favors)) {
                    this.props.getBusinessList({
                        ids: user.favors,
                    });
                }
            });
    }

    componentWillUnmount() {
        this.props.clearBusinessList();
        this.props.clearReviewsList();
        this.props.clearCommentsList();
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
        } else if (value === 2) {
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
                    <ReviewPanel
                        hasMore={this.state.reviewsHasMore}
                        loadMore={this.loadMoreReviews}
                        showBusinessName
                    />
                );

            case 2:
                return (
                    <div style={{ maxWidth: 720, margin: 'auto' }}>
                        <CommentPanel
                            hasMore={this.state.commentsHasMore}
                            loadMore={this.commentLoadMore}
                        />
                    </div>
                );
            default: 
                return (
                    <BusinessPanel />
                );
        }
    }

    render() {
        const { classes } = this.props;
        const { user } = this.state;

        return (
            <Container>
                <div className={classes.root}>
                    {
                        !isEmpty(user)
                            ?  <div>
                                    <section className={classes.section}>
                                        <Grid container spacing={40} justify="center" alignItems="center">
                                            <Grid item xs={12} sm="auto">
                                                <Avatar type="BIG" user={user} updatedAt={Date.now()}/>
                                            </Grid>

                                            <Grid item xs={12} sm="auto">
                                                <Typography variant="display1" align="center" gutterBottom><ProperName user={user} /></Typography>
                                                <Typography variant="title" align="center" gutterBottom>@{user.username}</Typography>
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
    return {};
};

export default connect(mapStateToProps, { 
    // User Actions
    getUserByUsername,

    // Business Actions
    getBusinessList, 
    clearBusinessList,

    // Review Actions
    getReviews,
    clearReviewsList,

    // Comment Actions
    getComments,
    clearCommentsList,
})(withStyles(styles)(ProfilePage));
