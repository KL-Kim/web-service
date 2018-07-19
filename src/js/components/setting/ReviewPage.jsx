import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

// Material UI Icons
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

// Custom Components
import SettingContainer from '../layout/SettingContainer';
import ReviewCard from '../utils/ReviewCard';
import ReviewCardAlt from '../utils/ReviewCardAlt';

// Webstorage
import { loadFromStorage } from '../../helpers/webStorage';
import webStorageTypes from '../../constants/webStorage.types';

// Actions
import { getReviews, deleteReview } from '../../actions/review.actions';

const styles = theme => ({
  "mansoryWrapper": {
    width: 976,
    position: 'relative',
    top: 0,
    left: - theme.spacing.unit,
  },
  "mansoryItem": {
    width: "33.33%",
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
});

class ReviewPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "limit": 9,
      "count": 0,
      'orderBy': 'new',
      'hasMore': false,
      'sortPopoverOpen': false,
    };

    this.state.userId = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);

    this.handleOrderBy = this.handleOrderBy.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.getNewReviews = this.getNewReviews.bind(this);
    this.handleOpenSortPopover = this.handleOpenSortPopover.bind(this);
    this.handleCloseSortPopover = this.handleCloseSortPopover.bind(this);
  }

  componentDidMount() {
    if (this.state.userId) {
      this.props.getReviews({
        limit: this.state.count,
        'uid': this.state.userId,
        'orderBy': this.state.orderBy,
      }).then(response => {
        if (response) {
          this.setState({
            hasMore: response.list.length < this.props.totalCount,
            count: response.list.length,
          });
        }
      });
    }
  }

  handleOpenSortPopover() {
    this.setState({
      'sortPopoverOpen': true,
    });
  }

  handleCloseSortPopover() {
    this.setState({
      'sortPopoverOpen': false,
    });
  }

  handleOrderBy = (item) => e => {
    if (this.state.userId) {
      this.props.getReviews({
        limit: this.state.limit,
        'uid': this.state.userId,
        'orderBy': item,
      }).then(response => {
        if (response) {
          this.setState({
            'orderBy': item,
            hasMore: response.list.length < this.props.totalCount,
            count: this.state.limit,
          });
        }
      });
    }
  }

  loadMore() {
    if (this.state.hasMore) {
      this.props.getReviews({
        limit: this.state.count + this.state.limit,
        'uid': this.state.userId,
        'orderBy': this.state.orderBy,
      }).then(response => {
        this.setState({
          count: response.list.length,
          hasMore: response.list.length < this.props.totalCount
        });
      });
    }
  }

  getNewReviews() {
    if (this.state.userId) {
      this.props.getReviews({
        limit: this.state.count,
        'uid': this.state.userId,
        'orderBy': this.state.orderBy,
      });
    }
  }

  render() {
    const { classes, reviews } = this.props;

    return (
      <SettingContainer>
        <div>
          <Grid container justify="space-between" alignItems="flex-end">
            <Grid item>
              <Typography variant="display1">
                My Reviews
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.handleOpenSortPopover}
                buttonRef={node => {
                  this.sortAnchorEl = node;
                }}
              >
                Sort
                {
                  this.state.sortPopoverOpen
                    ? <ArrowDropUp />
                    : <ArrowDropDown />
                }
              </Button>
            </Grid>
          </Grid>

          <br />

          <div>
            {
              _.isEmpty(reviews)
                ? <Typography align="center">None</Typography>
                : <div>
                    <InfiniteScroll
                      pageStart={0}
                      loadMore={this.loadMore}
                      hasMore={this.state.hasMore}
                      loader={<div style={{ textAlign: 'center' }} key={0}>
                                <CircularProgress size={30} />
                              </div>}
                    >
                      <div className={classes.mansoryWrapper}>
                        <Masonry elementType={'div'}>
                          {
                            reviews.map(review => (
                              <div key={review._id} className={classes.mansoryItem}>
                                <ReviewCardAlt
                                  id={review._id}
                                  owner={review.user}
                                  business={review.business}
                                  showBusinessName={true}
                                  user={this.props.user}
                                  isOwn={review.userId === this.props.user._id}
                                  isLoggedIn={this.props.isLoggedIn}
                                  content={review.content}
                                  rating={review.rating}
                                  upvoteCount={review.upvote.length}
                                  serviceGood={review.serviceGood}
                                  envGood={review.envGood}
                                  comeback={review.comeback}
                                  handleDelete={this.props.deleteReview}
                                  getNewReviews={this.getNewReviews}
                                />
                              </div>
                            ))
                          }
                        </Masonry>
                      </div>
                  </InfiniteScroll>
                  {
                    this.state.hasMore
                      ? null
                      : <Typography variant="caption" align="center">
                          --- No more reviews, You have total {this.props.totalCount} reviews ---
                        </Typography>
                  }
                </div>
            }
          </div>

          <div id="modal-container">
            <Popover
              open={this.state.sortPopoverOpen}
              anchorEl={this.sortAnchorEl}
              onClose={this.handleCloseSortPopover}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuList role="menu" style={{ width: 100 }}>
                <MenuItem selected={this.state.orderBy === 'new'} onClick={this.handleOrderBy('new')}>
                  <ListItemText primary="New" />
                </MenuItem>
                <MenuItem selected={this.state.orderBy === 'useful'} onClick={this.handleOrderBy('useful')}>
                  <ListItemText primary="Hot" />
                </MenuItem>
              </MenuList>
            </Popover>
          </div>
        </div>
      </SettingContainer>
    );
  }
}

ReviewPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "updatedAt": state.userReducer.updatedAt,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "reviews": state.reviewReducer.reviews,
    "totalCount": state.reviewReducer.totalCount,
    "error": state.reviewReducer.error,
  };
};

export default connect(mapStateToProps, { getReviews, deleteReview })(withStyles(styles)(ReviewPage));
