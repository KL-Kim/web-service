import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Img from 'react-image';
import Stars from 'react-stars';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';
import { Map, Marker, Circle } from 'react-amap';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';


// Material UI Icons
import Whatshot from '@material-ui/icons/Whatshot';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import Favorite from '@material-ui/icons/Favorite';
import LocalPhone from '@material-ui/icons/LocalPhone';
import Place from '@material-ui/icons/Place';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

// Custom Components
import Container from './layout/Container'
import ReviewCard from './utils/ReviewCard';
import ReviewCardAlt from './utils/ReviewCardAlt';
import WriteReviewDialog from './utils/WriteReviewDialog';
import ReportDialog from './utils/ReportDialog';
import Thumbnail from './utils/Thumbnail';

// Actions
import { favorOperation } from '../actions/user.actions';
import { openLoginDialog } from '../actions/app.actions';
import { getSingleBusiness, reportBusiness } from '../actions/business.actions';
import {
  getReviews,
  addNewReview,
  voteReview,
  clearReviewsList,
  getSingleReview
} from '../actions/review.actions';

import config from '../config/config';
import { loadFromStorage } from '../helpers/webStorage';
import webStorageTypes from '../constants/webStorage.types';

// Mock image
import image from '../../css/ikt-icon.gif';

const styles = theme => ({
  "wrapper": {
    marginBottom: theme.spacing.unit * 2,
  },
  "paper": {
    padding: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 2,
  },
  "badgeContent": {
    paddingRight: theme.spacing.unit * 2,
  },
  "mapWrapper": {
    width: '100%',
    height: 400,
  },
  "chip": {
    marginRight: theme.spacing.unit,
  },
  "heading": {
   fontSize: theme.typography.pxToRem(15),
   fontWeight: theme.typography.fontWeightRegular,
 },
  "mansoryItem": {
    width: "33.33%",
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
  },
  "masonryWrapper": {
    width: 976,
    position: 'relative',
    top: 0,
    left: -theme.spacing.unit,
  },
});

class SingleBusinessPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      "business": null,
      "addNewDialogOpen": false,
      "limit": 20,
      'count': 0,
      "hasMore": false,
      "orderBy": 'recommended',
      "review": {},
      "reviewDialogOpen": false,
      "reportDialogOpen": false,
      "isMyFavor": false,
      "sortMenuPopoverOpen": false,
    };

    if (props.location.state && !_.isEmpty(props.location.state.reviewId)) {
      this.state.reviewId = props.location.state.reviewId;
    }

    this.state.myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

    this.handleAddNewReviewDialogOpen = this.handleAddNewReviewDialogOpen.bind(this);
    this.handleAddNewReviewDialogClose = this.handleAddNewReviewDialogClose.bind(this);
    this.hanldeReviewSortBy = this.hanldeReviewSortBy.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleReviewDialogClose = this.handleReviewDialogClose.bind(this);
    this.handleAddtoFavor = this.handleAddtoFavor.bind(this);
    this.handleReportDialogOpen = this.handleReportDialogOpen.bind(this);
    this.handleReportDialogClose = this.handleReportDialogClose.bind(this);
    this.handleSubmitReport = this.handleSubmitReport.bind(this);
    this.handleSortMenuPopoverOpen = this.handleSortMenuPopoverOpen.bind(this);
    this.handleSortMenuPopoverClose = this.handleSortMenuPopoverClose.bind(this);
  }

  componentDidMount() {
    this.props.getSingleBusiness(this.props.match.params.slug)
      .then(business => {
        if (_.isEmpty(business) || business.status !== 'PUBLISHED') {
          this.props.history.push('/404');
        } else {
          const index = this.state.myFavors.indexOf(business._id);
          this.setState({
            business: Object.assign({}, business),
            isMyFavor: (!_.isUndefined(index) && index > -1) ? true : false,
          });

          return this.props.getReviews({
            limit: this.state.limit,
            bid: business._id,
          });
        }

        return ;
      })
      .then(response => {
        if (response) {
          this.setState({
            hasMore: response.list.length < response.totalCount,
            count: response.list.length,
          });
        }

        if (this.state.reviewId) {
          this.props.getSingleReview(this.state.reviewId)
            .then(review => {
              if (review) {
                this.setState({
                  reviewDialogOpen: true,
                  review: Object.assign({}, review),
                });
              }
            });
        }

      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.slug !== this.props.match.params.slug) {
      this.props.getSingleBusiness(this.props.match.params.slug)
        .then(business => {
          if (_.isEmpty(business) || business.status !== 'PUBLISHED') {
            this.props.history.push('/404');

            return ;
          }

          const index = this.state.myFavors.indexOf(business._id);

          this.setState({
            business: Object.assign({}, business),
            isMyFavor: (!_.isUndefined(index) && index > -1) ? true : false,
          });

          return this.props.getReviews({
            limit: this.state.limit,
            bid: business._id,
          });
        })
        .then(response => {
          if (response) {
            this.setState({
              hasMore: response.list.length < response.totalCount,
              count: response.list.length,
            });
          }
        });
    }
  }

  componentWillUnmount() {
    this.props.clearReviewsList();
  }

  handleSortMenuPopoverOpen() {
    this.setState({
      "sortMenuPopoverOpen": true,
    });
  }

  handleSortMenuPopoverClose() {
    this.setState({
      "sortMenuPopoverOpen": false,
    });
  }

  handleAddNewReviewDialogOpen() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return;
    }

    this.setState({
      "addNewDialogOpen": true,
    });
  }

  handleAddNewReviewDialogClose() {
    this.setState({
      "addNewDialogOpen": false,
    });
  }

  handleReviewDialogClose() {
    this.setState({
      "reviewDialogOpen": false,
    });
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
    if (this.state.business) {
      this.props.reportBusiness(this.state.business._id, {
        type,
        content,
        contact,
      })
      .then(response => {
        if (response) {
          this.handleReportDialogClose();
        }
      });
    }
  }

  hanldeReviewSortBy = (item) => e => {
    this.props.getReviews({
      limit: this.state.limit,
      bid: this.state.business._id,
      orderBy: item,
    }).then((response => {
      if (response) {
        this.setState({
          'orderBy': item,
          hasMore: response.list.length < this.props.totalCount,
          count: response.list.length,
        });
      }
    }));

    this.setState({
      sortMenuPopoverOpen: false
    });
  }

  handleAddtoFavor() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return;
    }

    if (!_.isEmpty(this.props.user) && !_.isEmpty(this.state.business)) {
      this.props.favorOperation(this.props.user._id, this.state.business._id)
        .then(response => {
          if (response) {
            this.setState({
              isMyFavor: !this.state.isMyFavor
            });
          }
        });
    }
  }

  loadMore() {
    if (this.state.hasMore) {
      this.props.getReviews({
        limit: this.state.count + this.state.limit,
        'bid': this.state.business._id,
        'orderBy': this.state.orderBy,
      }).then((response => {
        this.setState({
          count: response.list.length,
          hasMore: response.list.length < this.props.totalCount
        });
      }));
    }
  }

  render() {
    const { classes, reviews } = this.props;
    const { business, review } = this.state;
    if (_.isEmpty(business)) {
      return (
        <Container>
          <div style={{ textAlign: 'center' }}>
            <CircularProgress size={30} />
          </div>
        </Container>
      )
    }
    const thumbnail = (_.isEmpty(business.thumbnailUri))
                        ? image
                        : config.API_GATEWAY_ROOT + '/' + business.thumbnailUri.hd;

    return (
      <Container>
        <div>
          <Grid container spacing={16} style={{ marginBottom: 80 }}>
            <Grid item xs={6}>
              <Grid container>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Grid container alignItems="center" justify="space-between">
                      <Grid item>
                        <Typography variant="display2" >{business.krName}</Typography>
                        <Typography variant="body2" >{business.cnName}</Typography>
                      </Grid>
                      <Grid item>
                        <div>
                          <Tooltip id="favor-icon" title="Add to Favor">
                            <IconButton
                              color={this.state.isMyFavor ? "secondary" : 'default'}
                              onClick={this.handleAddtoFavor}
                            >
                              {
                                this.state.isMyFavor ? <Favorite /> : <FavoriteBorder />
                              }
                            </IconButton>
                          </Tooltip>
                          <Tooltip id="report-icon" title="Report">
                            <IconButton onClick={this.handleReportDialogOpen}>
                              <ErrorOutline />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </Grid>
                    </Grid>

                    <Stars count={5} size={32} value={business.ratingAverage} edit={false} />

                    <br />

                    <Grid container justify="flex-end" alignItems="center">

                      <Grid item>
                        <Link to={"/business/category/" + business.category.enName}>
                          <Typography variant="body2" color="primary" gutterBottom>{business.category.krName}</Typography>
                        </Link>
                      </Grid>
                    </Grid>

                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <LocalPhone style={{ fontSize: 30 }} />
                      </Grid>
                      <Grid item>
                        <Typography variant="body2">
                          {business.tel}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid container justify="space-between" alignItems="center">
                      <Grid item>
                        <Place style={{ fontSize: 30 }} />
                      </Grid>
                      <Grid item>
                        <Typography variant="body2">
                          {business.address.area.name + ' ' + business.address.street}
                        </Typography>
                      </Grid>
                    </Grid>

                    <br />

                    <div>
                    {
                      _.isEmpty(business.tags)
                        ? null
                        : business.tags.map(item => (
                          <Chip
                            key={item._id}
                            className={classes.chip}
                            label={item.krName}
                            />
                        ))
                    }
                    </div>

                  </Paper>
                </Grid>

                {
                  business.event
                    ? <Grid item xs={12}>
                        <Paper className={classes.paper}>
                          <Typography variant="title" gutterBottom>행사 & 할인</Typography>
                          <div dangerouslySetInnerHTML={{ __html: business.event }} />
                        </Paper>
                      </Grid>
                    : null
                }

                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <div>
                      <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                          <Typography variant="body2" gutterBottom><strong>가격:</strong></Typography>
                        </Grid>

                        <Grid item>
                          <Typography variant="body1" gutterBottom>{business.priceRange}</Typography>
                        </Grid>
                      </Grid>

                      <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                          <Typography variant="body2" gutterBottom><strong>배달:</strong></Typography>
                        </Grid>

                        <Grid item>
                          <Typography variant="body1" gutterBottom>{business.delivery}</Typography>
                        </Grid>
                      </Grid>

                      <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                          <Typography variant="body2" gutterBottom><strong>언어:</strong></Typography>
                        </Grid>

                        <Grid item>
                          <Typography variant="body1" gutterBottom>{business.supportedLanguage.toString()}</Typography>
                        </Grid>
                      </Grid>

                      <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                          <Typography variant="body2" gutterBottom><strong>Payments:</strong></Typography>
                        </Grid>

                        <Grid item>
                          <Typography variant="body1" gutterBottom>{business.payment.toString()}</Typography>
                        </Grid>
                      </Grid>

                      <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                          <Typography variant="body2" gutterBottom><strong>휴식일:</strong></Typography>
                        </Grid>

                        <Grid item>
                          <Typography variant="body1" gutterBottom>{business.rest}</Typography>
                        </Grid>
                      </Grid>
                    </div>
                  </Paper>
                </Grid>

                <Grid item xs={12} key={business._id}>
                  <ExpansionPanel disabled={_.isEmpty(business.chains)}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography className={classes.heading}>체인점</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      {
                        _.isEmpty(business.chains)
                          ? null
                          : business.chains.map(item => (
                            <Link to={item.enName} key={item.enName}>
                              <Button color="primary" variant="outlined">{item.krName}</Button>
                            </Link>
                          ))
                      }
                    </ExpansionPanelDetails>
                  </ExpansionPanel>

                  <ExpansionPanel disabled={_.isEmpty(business.openningHoursSpec)}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography className={classes.heading}>영업시간</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div style={{
                          width: '100%'
                        }}
                      >
                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" gutterBottom><strong>월요일:</strong></Typography>
                          </Grid>

                          <Grid item>
                            <Typography variant="body1" gutterBottom>
                              {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.mon}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" gutterBottom>
                              <strong>화요일:</strong>
                            </Typography>
                          </Grid>

                          <Grid item>
                            <Typography variant="body1" gutterBottom>
                              {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.tue}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" gutterBottom>
                              <strong>수요일:</strong>
                            </Typography>
                          </Grid>

                          <Grid item>
                            <Typography variant="body1" gutterBottom>
                              {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.wed}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" gutterBottom>
                              <strong>목요일:</strong>
                            </Typography>
                          </Grid>

                          <Grid item>
                            <Typography variant="body1" gutterBottom>
                              {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.thu}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" gutterBottom>
                              <strong>금요일:</strong>
                            </Typography>
                          </Grid>

                          <Grid item>
                            <Typography variant="body1" gutterBottom>
                              {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.fri}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" gutterBottom>
                              <strong>토요일:</strong>
                            </Typography>
                          </Grid>

                          <Grid item>
                            <Typography variant="body1" gutterBottom>
                              {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.sat}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" gutterBottom>
                              <strong>일요일:</strong>
                            </Typography>
                          </Grid>

                          <Grid item>
                            <Typography variant="body1" gutterBottom>
                              {_.isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.sun}
                            </Typography>
                          </Grid>
                        </Grid>
                      </div>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>

                  <ExpansionPanel disabled={_.isEmpty(business.description)}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography className={classes.heading}>소개</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div dangerouslySetInnerHTML={{ __html: business.description }} />
                    </ExpansionPanelDetails>
                  </ExpansionPanel>

                  <ExpansionPanel disabled={_.isEmpty(business.menu)}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography className={classes.heading}>메뉴</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {
                            _.isEmpty(business.menu) ? (<TableRow></TableRow>)
                            : business.menu.map((item, index) => {
                                let name;

                                if (item.hot) {
                                  name = <Badge color="secondary" badgeContent={<Whatshot />}>
                                      <Typography variant="body1" className={classes.badgeContent}>{item.name}</Typography>
                                    </Badge>
                                } else if (item.new) {
                                  name = <Badge color="primary" badgeContent="New">
                                      <Typography variant="body1" className={classes.badgeContent}>{item.name}</Typography>
                                    </Badge>
                                } else {
                                  name = <Typography variant="body1" className={classes.badgeContent}>{item.name}</Typography>
                                }

                              return (<TableRow hover key={index}>
                                <TableCell>
                                  {name}
                                </TableCell>
                                <TableCell>{item.price}</TableCell>
                              </TableRow>
                            )})
                          }
                        </TableBody>
                      </Table>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              <div className={classes.wrapper}>
                <Thumbnail image={business.thumbnail} />
              </div>

              <div className={classes.mapWrapper}>
                <Map
                  amapkey={config.AMAP_KEY}
                  zoom={16}
                  center={{
                    longitude: business.geo.coordinates[0],
                    latitude: business.geo.coordinates[1],
                  }}
                  plugins={[
                    'ToolBar',
                  ]}
                >
                  <Marker position={{
                      longitude: business.geo.coordinates[0],
                      latitude: business.geo.coordinates[1],
                    }}
                  />
                </Map>
              </div>
            </Grid>
          </Grid>

          <Grid container>
            <Grid item xs={12}>
              <Typography variant="display2" align="center" id="reviews" gutterBottom>
                Reviews
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={16} justify="space-between" alignItems="center" style={{ marginBottom: 8 }}>
                <Grid item>
                  <Button
                    color="primary"
                    variant="outlined"
                    disableRipple
                    buttonRef={node => {
                      this.sortMenuAnchorEl = node;
                    }}
                    onClick={this.handleSortMenuPopoverOpen}
                  >
                    Sort By
                    {
                      this.state.sortMenuPopoverOpen
                        ? <ArrowDropUp />
                        : <ArrowDropDown />
                    }
                  </Button>
                </Grid>

                <Grid item>
                  <Button
                    variant="raised"
                    color="primary"
                    onClick={this.handleAddNewReviewDialogOpen}
                  >
                    new review
                  </Button>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
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
                        <div className={classes.masonryWrapper}>
                          <Masonry>
                            {
                              reviews.map(review => (
                                <div key={review._id} className={classes.mansoryItem}>
                                  <ReviewCardAlt
                                    showUser
                                    id={review._id}
                                    owner={review.user}
                                    user={this.props.user}
                                    isLoggedIn={this.props.isLoggedIn}
                                    isOwn={_.isEmpty(this.props.user) ? false : review.user._id === this.props.user._id}
                                    business={review.business}
                                    content={review.content}
                                    rating={review.rating}
                                    serviceGood={review.serviceGood}
                                    envGood={review.envGood}
                                    comeback={review.comeback}
                                    upvoteCount={review.upvote.length}
                                    handleVote={this.props.voteReview}
                                    openLoginDialog={this.props.openLoginDialog}
                                  />
                                </div>
                              ))
                            }
                          </Masonry>
                        </div>
                      </InfiniteScroll>
                      {
                        !this.state.hasMore
                          ? <Typography variant="caption" align="center">
                              --- No more reviews ---
                            </Typography>
                          : null
                      }
                    </div>
              }
            </Grid>


          </Grid>

          <div id="modal-container">
            <WriteReviewDialog
              user={this.props.user}
              business={business}
              open={this.state.addNewDialogOpen}
              addNewReview={this.props.addNewReview}
              handleClose={this.handleAddNewReviewDialogClose}
            />

            <WriteReviewDialog
              readOnly
              user={this.props.user}
              rating={review.rating}
              content={review.content}
              serviceGood={review.serviceGood}
              envGood={review.envGood}
              comeback={review.comeback}
              business={business}
              open={this.state.reviewDialogOpen}
              handleClose={this.handleReviewDialogClose}
            />

            <ReportDialog
              open={this.state.reportDialogOpen}
              handleSubmit={this.handleSubmitReport}
              handleClose={this.handleReportDialogClose}
            />

            <Popover
              open={this.state.sortMenuPopoverOpen}
              anchorEl={this.sortMenuAnchorEl}
              onClose={this.handleSortMenuPopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuList role="menu" style={{ width: 150 }}>
                <MenuItem selected={this.state.orderBy === 'recommended'} onClick={this.hanldeReviewSortBy('recommended')}>
                  <ListItemText primary="Recommend" />
                </MenuItem>
                <MenuItem selected={this.state.orderBy === 'useful'} onClick={this.hanldeReviewSortBy('useful')}>
                  <ListItemText primary="Useful" />
                </MenuItem>
                <MenuItem selected={this.state.orderBy === 'new'} onClick={this.hanldeReviewSortBy('new')}>
                  <ListItemText primary="New" />
                </MenuItem>
              </MenuList>
            </Popover>
          </div>
        </div>
      </Container>
    );
  }
}

SingleBusinessPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object,
  "isFetching": PropTypes.bool.isRequired,
  "reviews": PropTypes.array.isRequired,
  "totalCount": PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "reviews": state.reviewReducer.reviews,
    "totalCount": state.reviewReducer.totalCount,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, {
  getSingleBusiness,
  reportBusiness,
  addNewReview,
  getReviews,
  voteReview,
  clearReviewsList,
  getSingleReview,
  favorOperation,
  openLoginDialog,
})(withStyles(styles)(SingleBusinessPage));
