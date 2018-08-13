import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
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
import ReviewCardAlt from './cards/ReviewCardAlt';

const styles = theme => ({
    "mansoryWrapper": {
      width: 'calc(100% + 16px)',
      position: 'relative',
      top: 0,
      left: - theme.spacing.unit,
    },
    "mansoryItem": {
      width: "33.33%",
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
      marginBottom: theme.spacing.unit * 2,

      [theme.breakpoints.down('sm')]: {
        width: "50%",
      },
      [theme.breakpoints.down('xs')]: {
        width: "100%",
      },
    },
    "newReview": {
      width: "33.33%",
      paddingLeft: theme.spacing.unit *2,
      paddingRight: theme.spacing.unit * 2,
      marginBottom: theme.spacing.unit * 2,

      [theme.breakpoints.down('sm')]: {
        width: "50%",
      },
      [theme.breakpoints.down('xs')]: {
        width: "100%",
      },
    }
});

class ReviewPanel extends Component {
    componentWillUnmount() {
        this.props.clearReviewsList();
    }

    handleFocus(e) {
        if (this.props.onFocusAddNew) {
            this.props.onFocusAddNew();
            e.target.blur();
        }
    }

    render() {
        const { classes, reviews } = this.props;

        return (
                <div>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={this.props.loadMore}
                        hasMore={this.props.hasMore}
                        loader={<div style={{ textAlign: 'center' }} key={0}>
                                    <CircularProgress size={30} />
                                </div>}
                    >
                        <div className={classes.mansoryWrapper}>
                            <Masonry elementType={'div'}>
                                {
                                    this.props.addNew 
                                        ?   <div className={classes.mansoryItem}>
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
                                        : null
                                }
                                {
                                    _.isEmpty(reviews) 
                                        ?   null 
                                        :   reviews.map(review => (
                                                <div key={review._id} className={classes.mansoryItem}>
                                                    <ReviewCardAlt
                                                        id={review._id}
                                                        owner={review.user}
                                                        business={review.business}
                                                        content={review.content}
                                                        rating={review.rating}
                                                        serviceGood={review.serviceGood}
                                                        envGood={review.envGood}
                                                        comeback={review.comeback}
                                                        upvoteCount={review.upvote.length}

                                                        showBusinessName={this.props.showBusinessName}
                                                        userId={this.props.userId}
                                                        isLoggedIn={this.props.isLoggedIn}
                                                        isOwn={review.userId === this.props.userId}

                                                        voteReview={this.props.voteReview}
                                                        deleteReview={this.props.deleteReview}
                                                        getNewReviews={this.props.getNewReviews}
                                                    />
                                                </div>
                                    ))
                                }
                            </Masonry>
                        </div>
                        
                    </InfiniteScroll>
                    {
                    this.props.hasMore
                        ? null
                        : <Typography variant="caption" align="center">
                            --- No more reviews---
                        </Typography>
                    }
                </div>
        )
    }
}

ReviewPanel.defaultProps = {
    "isLoggedIn": false,
    "userId": '',
    "hasMore": false,
    "loadMore": () => {},
    "reviews": [],
    "addNew": false,
};

ReviewPanel.propTypes = {
    "classes": PropTypes.object.isRequired,
    "reviews": PropTypes.array.isRequired,
    "isLoggedIn": PropTypes.bool.isRequired,
    "userId": PropTypes.string,
    "hasMore": PropTypes.bool.isRequired,
    "addNew": PropTypes.bool,

    "loadMore": PropTypes.func.isRequired,
    "voteReview": PropTypes.func,
    "deleteReview": PropTypes.func,
    "getNewReviews": PropTypes.func,
};

export default withStyles(styles)(ReviewPanel);