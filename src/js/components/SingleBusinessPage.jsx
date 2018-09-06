import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

import Stars from 'react-stars';
import { Map, Marker } from 'react-amap';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
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
import Hidden from '@material-ui/core/Hidden';
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
import Phone from '@material-ui/icons/Phone';

// Custom Components
import Container from './layout/Container'
import WriteReviewDialog from 'js/components/dialogs/WriteReviewDialog';
import ReportDialog from 'js/components/dialogs/ReportDialog';
import Thumbnail from './utils/Thumbnail';
import ReviewPanel from './sections/ReviewPanel';
import Badge from 'js/components/utils/Badge';
import LightBox from 'js/components/utils/LightBox';

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
  "root": {
    maxWidth: 976,
    margin: 'auto',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    marginTop: theme.spacing.unit * 8,
    marginBottom: theme.spacing.unit * 8,
    paddingTop: theme.spacing.unit * 4,
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing.unit * 7,
      marginBottom: theme.spacing.unit * 7,
      padding: 0,
    }
  },
  "main": {
    maxWidth: 976,
    margin: 'auto',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit,
    }
  },
  "section": {
    marginBottom: theme.spacing.unit * 4,
  },
  "thumbnailWrapper": {
    marginBottom: theme.spacing.unit * 2,
    cursor: 'pointer',
  },
  "paper": {
    padding: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 2,
  },
  "chip": {
    marginRight: theme.spacing.unit / 2,
  },
  "heading": {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  "fabButton": {
    position: 'fixed',
    right: 32,
    bottom: 16,
  }
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
      "images": [],
      "reviewDialogOpen": false,
      "reportDialogOpen": false,
      "isMyFavor": false,
      "sortMenuPopoverOpen": false,
      "isLightboxOpen": false,
    };

    if (props.location.state && !isEmpty(props.location.state.reviewId)) {
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
    this.handleLightboxOpen = this.handleLightboxOpen.bind(this);
    this.handleLightboxClose = this.handleLightboxClose.bind(this);
  }

  componentDidMount() {
    this.props.getSingleBusiness(this.props.match.params.slug)
      .then(business => {
        if (isEmpty(business) || business.status !== 'PUBLISHED') {
          this.props.history.push('/404');

          return ;
        } 
        else {
          const index = this.state.myFavors.indexOf(business._id);
          const images = [];

          if (!isEmpty(business.mainImage)) {
            images.push({
              src: business.mainImage.url + '-business',
              alt: business.mainImage.name
            })
          }

          if (!isEmpty(business.gallery)) {
            business.gallery.map(image => {
              images.push({
                src: image.url + '-business',
                alt: image.name
              });

              return '';
            });
          }

          this.setState({
            business: Object.assign({}, business),
            images: [...images],
            isMyFavor: (!isEmpty(index) && index > -1) ? true : false,
          });


          return this.props.getReviews({
            limit: this.state.limit,
            bid: business._id,
          });
        }
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
          if (isEmpty(business) || business.status !== 'PUBLISHED') {
            this.props.history.push('/404');

            return ;
          }

          const index = this.state.myFavors.indexOf(business._id);
          const images = [];

          if (!isEmpty(business.mainImage)) {
            images.push(business.mainImage.url);
          }

          if (!isEmpty(business.gallery)) {
            business.gallery.map(image => {
              images.push(image.url);

              return null;
            });
          }

          this.setState({
            business: Object.assign({}, business),
            images: [...images],
            isMyFavor: (!isEmpty(index) && index > -1) ? true : false,
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

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.state.business !== nextState.business) {
  //     return false;
  //   }
  // }

  componentWillUnmount() {
    this.props.clearReviewsList();
  }

  handleLightboxOpen() {
    this.setState({
      isLightboxOpen: true
    })
  }

  handleLightboxClose() {
    this.setState({
        isLightboxOpen: false
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

  handleAddToFavor() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return ;
    }

    if (!isEmpty(this.props.user) && !isEmpty(this.state.business)) {
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

    return isEmpty(business) ? null : (
      <Container>
        <div className={classes.root}>
          <div className={classes.thumbnailWrapper} onClick={this.handleLightboxOpen}>
            <Thumbnail src={isEmpty(business) || isEmpty(business.mainImage) ? null : business.mainImage.url} />
          </div>

          <div className={classes.main}>
            <Grid container spacing={16} style={{ marginBottom: 40 }}>
              <Grid item xs={12} sm={6}>
                <Grid container>
                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <div className={classes.section}>
                        <Grid container alignItems="flex-start" justify="space-between">
                          <Grid item>
                            <Typography variant="display1" >{business.krName}</Typography>
                            <Typography variant="body2" >{business.cnName}</Typography>
                          </Grid>
                          
                          <Grid item>
                            <div style={{
                                position: 'relative',
                                top: -8,
                                right: -16,
                              }}
                            >
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

                        <Stars count={5} size={20} value={business.ratingAverage} edit={false} />
                      </div>

                      <div className={classes.section}>
                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <Typography variant="body2">
                              <strong>카테고리</strong>
                            </Typography>
                          </Grid>

                          <Grid item>
                            <Typography variant="body2">{business.category.krName}</Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <LocalPhone style={{ fontSize: 24 }} />
                          </Grid>

                          <Grid item>
                            <Typography variant="body2">
                              <a href={"tel:" + business.tel}>{business.tel}</a>
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <Place style={{ fontSize: 24 }} />
                          </Grid>
                          <Grid item>
                            <Typography variant="body2">
                              {business.address.area.name + ' ' + business.address.street}
                            </Typography>
                          </Grid>
                        </Grid>
                      </div>

                      <div>
                        {
                          isEmpty(business.tags)
                            ? null
                            : business.tags.map(item => (
                                <Link to={"/business/tag/" + item.enName} key={item._id} className={classes.chip}>
                                  <Badge color="info"  >#{item.krName}</Badge>
                                </Link>
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
                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" gutterBottom><strong>평균소비</strong></Typography>
                          </Grid>

                          <Grid item>
                            <Typography variant="caption" gutterBottom>{business.priceRange}</Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" gutterBottom><strong>배달</strong></Typography>
                          </Grid>

                          <Grid item>
                            <Typography variant="caption" gutterBottom>{business.delivery}</Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" gutterBottom><strong>휴식일</strong></Typography>
                          </Grid>

                          <Grid item>
                            <Typography variant="caption" gutterBottom>{business.rest}</Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" gutterBottom><strong>언어</strong></Typography>
                          </Grid>

                          <Grid item>
                            <Typography variant="caption" gutterBottom>{business.supportedLanguage.toString()}</Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="space-between" alignItems="center">
                          <Grid item>
                            <Typography variant="body2" gutterBottom><strong>Payments</strong></Typography>
                          </Grid>

                          <Grid item>
                            <Typography variant="caption" gutterBottom>{business.payment.toString()}</Typography>
                          </Grid>
                        </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <ExpansionPanel defaultExpanded={!this.props.fullScreen}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>지도</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails style={{ padding: 0 }}>
                    <div style={{ width: '100%', height: 300 }}>
                      <Map
                        amapkey={config.AMAP_JS_API_KEY}
                        zoom={16}
                        lang="zh_cn"
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
                  
                <ExpansionPanel disabled={isEmpty(business.chains)}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>체인점</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <List style={{ width: '100%' }}>
                      <Divider />
                      {
                        isEmpty(business.chains)
                          ? null
                          : business.chains.map(item => (
                            <Link to={item.enName} key={item.enName}>
                              <ListItem button>
                                <ListItemText primary={item.krName} secondary={item.cnName} />
                              </ListItem>
                              <Divider />
                            </Link>
                          ))
                      }
                    </List>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel disabled={isEmpty(business.openningHoursSpec)}>
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
                            {isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.mon}
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
                            {isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.tue}
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
                            {isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.wed}
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
                            {isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.thu}
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
                            {isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.fri}
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
                            {isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.sat}
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
                            {isEmpty(business.openningHoursSpec) ? '' : business.openningHoursSpec.sun}
                          </Typography>
                        </Grid>
                      </Grid>
                    </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel disabled={isEmpty(business.description)}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>소개</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <div dangerouslySetInnerHTML={{ __html: business.description }} />
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel disabled={isEmpty(business.menu)}>
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
                          isEmpty(business.menu)
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
          </div>

          <div id="modal-container">
            <Hidden smUp>
              <a href={"tel:" + business.tel} style={{ color: '#fff' }} className={classes.fabButton}>
                <Button 
                  variant="fab" 
                  color="primary" 
                  aria-label="Call" 
                >
                  <Phone />
                </Button>
              </a>
            </Hidden>

            <WriteReviewDialog
              open={this.state.addNewDialogOpen}
              onClose={this.handleAddNewReviewDialogClose}
              isLoggedIn={this.props.isLoggedIn}
              userId={isEmpty(this.props.user) ? '' : this.props.user._id}
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

            <LightBox
              open={this.state.isLightboxOpen}
              images={this.state.images}
              onClose={this.handleLightboxClose}
            />

            {
              isEmpty(review)
                ? null
                : <WriteReviewDialog
                    open={this.state.reviewDialogOpen}
                    onClose={this.handleReviewDialogClose}
                    readOnly
                    isLoggedIn={this.props.isLoggedIn}
                    userId={isEmpty(this.props.user) ? '' : this.props.user._id}
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
})(withStyles(styles)(withMobileDialog()(SingleBusinessPage)));
