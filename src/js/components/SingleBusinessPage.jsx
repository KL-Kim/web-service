import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Stars from 'react-stars';
import { Map, Marker, Circle } from 'react-amap';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

// Material UI Icons
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Favorite from '@material-ui/icons/Favorite';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import LocalPhone from '@material-ui/icons/LocalPhone';
import Place from '@material-ui/icons/Place';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

// Custom Components
import Container from './layout/Container'
import WriteReviewDialog from 'js/components/dialogs/WriteReviewDialog';
import ReportDialog from 'js/components/dialogs/ReportDialog';
import Thumbnail from './utils/Thumbnail';
import Gallery from './utils/Gallery';
import ReviewPanel from './sections/ReviewPanel';
import Badge from 'js/components/utils/Badge';

// Actions
import { openLoginDialog } from 'js/actions/app.actions'; 
import { favorOperation } from 'js/actions/user.actions';
import { getSingleBusiness, reportBusiness } from 'js/actions/business.actions';
import {
  getReviews,
  addNewReview,
  voteReview,
  clearReviewsList,
  getSingleReview
} from 'js/actions/review.actions';

import config from 'js/config/config';
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';
import { ListItem } from '@material-ui/core';

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

  
});

class SingleBusinessPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      "business": null,
      "addNewDialogOpen": false,
      "limit": 12,
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
    this.handleSortReviewsList = this.handleSortReviewsList.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleReviewDialogClose = this.handleReviewDialogClose.bind(this);
    this.handleAddToFavor = this.handleAddToFavor.bind(this);
    this.handleReportDialogOpen = this.handleReportDialogOpen.bind(this);
    this.handleReportDialogClose = this.handleReportDialogClose.bind(this);
    this.handleSubmitReport = this.handleSubmitReport.bind(this);
    this.handleSortMenuPopoverOpen = this.handleSortMenuPopoverOpen.bind(this);
    this.handleSortMenuPopoverClose = this.handleSortMenuPopoverClose.bind(this);
    this.getNewReviews = this.getNewReviews.bind(this);
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
            'limit': this.state.limit,
            'bid': business._id,
          });
        })
        .then(response => {
          if (response) {
            this.setState({
              'hasMore': response.list.length < response.totalCount,
              'count': response.list.length,
            });
          }
        });
    }
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

  handleAddToFavor() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return ;
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

  // Review Related Methods
  handleAddNewReviewDialogOpen() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return ;
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

  handleReviewDialogClose() {
    this.setState({
      "reviewDialogOpen": false,
    });
  }
  
  handleSortReviewsList = (item) => e => {
    this.props.getReviews({
      'limit': this.state.limit,
      'bid': this.state.business._id,
      'orderBy': item,
    }).then((response => {
      if (response) {
        this.setState({
          'orderBy': item,
          hasMore: response.list.length < response.totalCount,
          count: response.list.length,
        });
      }
    }));

    this.setState({
      sortMenuPopoverOpen: false
    });
  }

  loadMore() {
    if (this.state.hasMore) {
      this.props.getReviews({
        'limit': this.state.count + this.state.limit,
        'bid': this.state.business._id,
        'orderBy': this.state.orderBy,
      }).then(response => {
        if (response) {
          this.setState({
            count: response.list.length,
            hasMore: response.list.length < response.totalCount
          });
        }
      });
    }
  }

  getNewReviews() {
    this.props.getReviews({
      'limit': this.state.limit,
      'bid': this.state.business._id,
      'orderBy': 'new',
    }).then((response => {
      if (response) {
        this.setState({
          'orderBy': 'new',
          'hasMore': response.list.length < response.totalCount,
          'count': response.list.length,
        });
      }
    }));
  }

  render() {
    const { classes } = this.props;
    const { business, review } = this.state;

    return _.isEmpty(business) ? null : (
      <Container>
        <div>
          <Grid container spacing={16} style={{ marginBottom: 80 }}>
            <Grid item xs={12} sm={6}>
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
                          <Tooltip id="favor-icon" title="AddCircleOutlined to Favor">
                            <IconButton
                              color={this.state.isMyFavor ? "secondary" : 'default'}
                              onClick={this.handleAddToFavor}
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
                              label={'#' + item.krName}
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
                          <Typography variant="body2" gutterBottom><strong>평균소비:</strong></Typography>
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
                      <List style={{ width: '100%' }}>
                        {
                          _.isEmpty(business.chains)
                            ? null
                            : business.chains.map(item => (
                              <Link to={item.enName} key={item.enName}>
                                <ListItem button>
                                  <ListItemText primary={item.krName} secondary={item.cnName} />
                                </ListItem>
                              </Link>
                            ))
                        }
                      </List>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>

                  <ExpansionPanel disabled={_.isEmpty(business.openningHoursSpec)}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography className={classes.heading}>영업시간</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div style={{ width: '100%'}}>
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

                  <ExpansionPanel disabled={_.isEmpty(business.description)}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography className={classes.heading}>지도</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
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
                            _.isEmpty(business.menu) 
                              ? (<TableRow></TableRow>)
                              : business.menu.map((item, index) => 
                                  <TableRow hover key={index}>
                                    <TableCell>
                                      <Grid container spacing={8} alignItems="center">
                                        <Grid item>
                                          <Typography>{item.name}</Typography>
                                        </Grid>

                                        <Grid item>
                                          <div>
                                            {item.hot ? <Badge color="danger">Hot</Badge>: null}
                                            {item.new ? <Badge color="info">New</Badge>: null}
                                          </div>
                                        </Grid>
                                      </Grid>
                                     
                                    </TableCell>
                                    <TableCell>
                                      <Typography>{item.price}</Typography>
                                    </TableCell>
                                  </TableRow>
                              )
                          }
                        </TableBody>
                      </Table>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className={classes.wrapper}>
                <Thumbnail src={_.isEmpty(business) || _.isEmpty(business.mainImage) ? null : business.mainImage.url} />
              </div>

              <div className={classes.wrapper}>
                {
                  _.isEmpty(business) || _.isEmpty(business.gallery) 
                    ? null
                    : <Gallery gallery={business.gallery} />
                }
              </div>
            </Grid>
          </Grid>

          <Grid container spacing={16} justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="title" align="center" id="reviews">
                Reviews
              </Typography>
            </Grid>

            <Grid item>
              <Button
                color="primary"
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
          </Grid>

          <div>
            <ReviewPanel
              hasMore={this.state.hasMore}
              loadMore={this.loadMore}
              addNew
              onFocusAddNew={this.handleAddNewReviewDialogOpen}
            />
          </div>

          <div id="modal-container">
            <WriteReviewDialog
              open={this.state.addNewDialogOpen}
              onClose={this.handleAddNewReviewDialogClose}
              isLoggedIn={this.props.isLoggedIn}
              userId={_.isEmpty(this.props.user) ? '' : this.props.user._id}
              isVerified={this.props.isVerified}
              business={business}
              addNewReview={this.props.addNewReview}
              getNewReviews={this.getNewReviews}
            />

            <ReportDialog
              open={this.state.reportDialogOpen}
              onSubmit={this.handleSubmitReport}
              onClose={this.handleReportDialogClose}
            />

            <Popover
              open={this.state.sortMenuPopoverOpen}
              anchorEl={this.sortMenuAnchorEl}
              onClose={this.handleSortMenuPopoverClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuList role="menu" style={{ width: 150 }}>
                <MenuItem selected={this.state.orderBy === 'recommended'} onClick={this.handleSortReviewsList('recommended')}>
                  <ListItemText primary="Recommend" />
                </MenuItem>
                <MenuItem selected={this.state.orderBy === 'useful'} onClick={this.handleSortReviewsList('useful')}>
                  <ListItemText primary="Useful" />
                </MenuItem>
                <MenuItem selected={this.state.orderBy === 'new'} onClick={this.handleSortReviewsList('new')}>
                  <ListItemText primary="New" />
                </MenuItem>
              </MenuList>
            </Popover>

            {
              _.isEmpty(review)
                ? null
                : <WriteReviewDialog
                    open={this.state.reviewDialogOpen}
                    onClose={this.handleReviewDialogClose}
                    readOnly
                    isLoggedIn={this.props.isLoggedIn}
                    userId={_.isEmpty(this.props.user) ? '' : this.props.user._id}
                    isVerified={this.props.isVerified}
                    rating={review.rating}
                    content={review.content}
                    serviceGood={review.serviceGood}
                    envGood={review.envGood}
                    comeback={review.comeback}
                    business={business}
                  />
            }
          </div>
        </div>
      </Container>
    );
  }
}

SingleBusinessPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "isLoggedIn": PropTypes.bool.isRequired,
  "isVerified": PropTypes.bool.isRequired,
  "user": PropTypes.object,
  "isFetching": PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "isVerified": state.userReducer.isUserVerified,
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
  openLoginDialog,
  favorOperation,
})(withStyles(styles)(SingleBusinessPage));
