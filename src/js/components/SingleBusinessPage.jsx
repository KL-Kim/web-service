import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Img from 'react-image';
import Stars from 'react-stars';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Table, { TableBody, TableCell, TableHead, TableRow, } from 'material-ui/Table';
import Badge from 'material-ui/Badge';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import Whatshot from 'material-ui-icons/Whatshot';

import Container from './utils/Container'
import ReviewCard from './utils/ReviewCard';
import StoryCard from './utils/StoryCard';
import WriteReviewDialog from './utils/WriteReviewDialog';
import { getSingleBusiness } from '../actions/business.actions';
import { getReviews, addNewReview } from '../actions/review.actions';

import config from '../config/config';
import image from '../../css/ikt-icon.gif';

const story = {
  id: '1',
  userId: '5a4ef8f5537cd042155581a3',
  businessId: '5a4ef8f5537cd042155581a3',
  businessName: 'SteakHouse',
  title: 'Tasting SteakHouse',
  content: 'Bla bla bla',
  commentCount: 10,
  upVote: 10,
  downVote: 2
};

const styles = theme => ({
  "thumbnail": {
    width: '100%',
  },
  "paper": {
    padding: theme.spacing.unit * 5,
    color: theme.palette.text.secondary
  },
  "button": {
    margin: theme.spacing.unit,
  },
  "badgeContent": {
    paddingRight: theme.spacing.unit * 2,
  },
});

class BusinessPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      "business": null,
      "AddNewDialogOpen": false,
      "rowsPerPage": 20,
      "page": 0,
    };

    this.handleReviewDialogOpen = this.handleReviewDialogOpen.bind(this);
    this.handleReviewDialogClose = this.handleReviewDialogClose.bind(this);
  }

  componentDidMount() {
    this.props.getSingleBusiness("enName", this.props.match.params.slug).then(business => {
      this.setState({
        business: business,
      });
      this.props.getReviews(0, this.state.rowsPerPage, { 'bid': business._id });
    });
  }

  componenWillUpdate() {
    console.log("Will update");
  }

  componentWillReceiveProps() {
    console.log("Will receive props");
  }

  handleReviewDialogOpen() {
    this.setState({
      "AddNewDialogOpen": true,
    });
  }

  handleReviewDialogClose() {
    this.setState({
      "AddNewDialogOpen": false,
    });
  }

  render() {
    const { classes, reviews } = this.props;
    const { business } = this.state;
    const thumbnail = _.isEmpty(business) || _.isEmpty(business.thumbnailUri) ? image : config.API_GATEWAY_ROOT + '/' + business.thumbnailUri.hd;

    return (
      <Container>
        {
          _.isEmpty(business) ? <div></div> :
          <div>
            <Grid container spacing={16}>
              <Grid item xs={4}>
                <Img src={thumbnail} className={classes.thumbnail} />
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="display1" color="primary">{business.krName}</Typography>
                  <Typography type="body1" gutterBottom>{business.cnName}</Typography>
                  <Stars count={5} size={24} value={business.ratingAverage} edit={false} />
                    <Typography type="body2">{business.category.krName}</Typography>
                  <Typography type="body1">Tel: {business.tel}</Typography>
                  <Typography type="body1">{business.address.area.name + ' ' + business.address.street}</Typography>
                </Paper>
              </Grid>

              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>지도</Typography>

                </Paper>
              </Grid>

              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="display1" gutterBottom>More</Typography>
                  <Typography type="body1" gutterBottom>가격: {business.priceRange}</Typography>
                  <Typography type="body1" gutterBottom>배달: {business.delivery}</Typography>
                  <Typography type="body1" gutterBottom>언어: {business.supportedLanguage}</Typography>
                  <Typography type="body1" gutterBottom>Payments: {business.payment}</Typography>
                  <Typography type="body1" gutterBottom>휴식일: {business.rest}</Typography>
                </Paper>
              </Grid>

              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>분점</Typography>
                  {business.chains.map(item =>
                    (<Link to={item.enName} key={item.enName}>
                      <Typography type="body1">{item.krName}</Typography>
                    </Link>)
                  )}
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>More</Typography>
                  <Typography type="body1" gutterBottom>가격: {business.priceRange}</Typography>
                  <Typography type="body1" gutterBottom>배달: {business.delivery}</Typography>
                  <Typography type="body1" gutterBottom>언어: {business.supportedLanguage}</Typography>
                  <Typography type="body1" gutterBottom>Payments: {business.payment}</Typography>
                  <Typography type="body1" gutterBottom>휴식일: {business.rest}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>영업시간</Typography>
                  <Typography type="body1" gutterBottom>월요일: {business.openningHoursSpec.mon}</Typography>
                  <Typography type="body1" gutterBottom>화요일: {business.openningHoursSpec.tue}</Typography>
                  <Typography type="body1" gutterBottom>수요일: {business.openningHoursSpec.wed}</Typography>
                  <Typography type="body1" gutterBottom>목요일: {business.openningHoursSpec.thu}</Typography>
                  <Typography type="body1" gutterBottom>금요일: {business.openningHoursSpec.fri}</Typography>
                  <Typography type="body1" gutterBottom>토요일: {business.openningHoursSpec.sat}</Typography>
                  <Typography type="body1" gutterBottom>일요일: {business.openningHoursSpec.sun}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>Description</Typography>
                  <Typography type="body1" gutterBottom>{business.description}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>Event</Typography>
                  <Typography type="body1" gutterBottom>{business.event}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>Menu</Typography>
                  {
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
                                    <Typography type="body1" className={classes.badgeContent}>{item.name}</Typography>
                                  </Badge>
                              } else if (item.new) {
                                name = <Badge color="primary" badgeContent="New">
                                    <Typography type="body1" className={classes.badgeContent}>{item.name}</Typography>
                                  </Badge>
                              } else {
                                name = <Typography type="body1" className={classes.badgeContent}>{item.name}</Typography>
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
                  }
                </Paper>
              </Grid>
            </Grid>

            <Grid container spacing={16} justify="space-between" alignItems="flex-start">
              <Grid item xs={12}>
                <Typography type="display3" align="center">
                  Reviews
                </Typography>
              </Grid>
              <Grid item xs={4}>
                  <Button color="primary">Rating</Button>
                  <Button color="primary">Newest</Button>
                  <Button color="primary">Most Useful</Button>
              </Grid>
              <Grid item xs={4}>
                <Button raised color="primary" onClick={this.handleReviewDialogOpen}>Write a review</Button>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  {
                    _.isEmpty(reviews) ? ''
                      : reviews.map((review, index) => (
                        <Grid item xs={3} key={index}>
                          <ReviewCard
                            id={review._id}
                            user={review.user}
                            content={review.content}
                            rating={review.rating}
                            upVote={review.upVote}
                            downVote={review.downVote}
                          />
                        </Grid>
                    ))
                  }
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={16} justify="center" alignItems="center">
              <Grid item xs={12}>
                <Typography type="display3" align="center">
                  Stories
                </Typography>
              </Grid>
              <Grid item xs={12}>
                  <Button color="primary">Newest</Button>
                  <Button color="primary">Most Useful</Button>
              </Grid>
              <Grid item xs={4}>
                <StoryCard businessName={story.businessName}
                  title={story.title}
                  content={story.content}
                  commentCount={story.commentCount}
                  upVote={story.upVote}
                  downVote={story.downVote}
                />
              </Grid>
              <Grid item xs={4}>
                <StoryCard businessName={story.businessName}
                  title={story.title}
                  content={story.content}
                  commentCount={story.commentCount}
                  upVote={story.upVote}
                  downVote={story.downVote}
                />
              </Grid>
              <Grid item xs={4}>
                <StoryCard businessName={story.businessName}
                  title={story.title}
                  content={story.content}
                  commentCount={story.commentCount}
                  upVote={story.upVote}
                  downVote={story.downVote}
                />
              </Grid>
            </Grid>

            <WriteReviewDialog
              user={this.props.user}
              business={this.state.business}
              open={this.state.AddNewDialogOpen}
              handleSubmit={this.props.addNewReview}
              handleClose={this.handleReviewDialogClose}
            />
          </div>
        }
      </Container>
    );
  }
}

BusinessPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object,
  "isFetching": PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "reviews": state.reviewReducer.reviews,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getSingleBusiness, addNewReview, getReviews })(withStyles(styles)(BusinessPage));
