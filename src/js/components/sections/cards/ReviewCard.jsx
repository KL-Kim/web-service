import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import Stars from 'react-stars';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Chip from '@material-ui/core/Chip';

// Material UI Icons
import Delete from '@material-ui/icons/Delete';

// Custom Components
import ConfirmationDialog from './ConfirmationDialog';
import ProperName from './ProperName';
import ThumbButton from './ThumbButton';

// Mock Image
import image from 'css/ikt-icon.gif';

const styles = theme => ({
  "chip":{
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class ReviewCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "deleteDialogOpen": false,
      "upvoteCount": props.upvoteCount,
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteDialogOpen = this.handleDeleteDialogOpen.bind(this);
    this.handleDeleteDialogClose = this.handleDeleteDialogClose.bind(this);
    this.handleUpvote = this.handleUpvote.bind(this);
  }

  handleDeleteDialogOpen() {
    this.setState({
      deleteDialogOpen: true,
    });
  }

  handleDeleteDialogClose() {
    this.setState({
      deleteDialogOpen: false,
    });
  }

  handleDelete() {
    if (!this.props.userId) {
      this.props.openLoginDialog();
    }

    if (this.props.deleteReview && this.props.id && this.props.isOwn) {
      this.props.deleteReview({
        _id: this.props.id,
        uid: this.props.owner._id,
      })
      .then(response => {
        if (response) {
          return this.props.getNewReviews();
        }
      })
      .then(() => {
        this.setState({
          deleteDialogOpen: false,
        });
      });
    }
  }

  handleUpvote() {
    if (!this.props.userId) {
      this.props.openLoginDialog();

      return;
    }

    if (!_.isUndefined(this.props.handleVote) && this.props.userId && !this.props.isOwn) {
      this.props.handleVote(this.props.id, {
        uid: this.props.userId,
        businessName: this.props.business.krName + '/' + this.props.business.cnName,
        businessSlug: this.props.business.enName,
        vote: 'upvote',
      }).then(response => {
        if (response) {
          this.setState({
            "upvoteCount": response.review.upvote.length,
          });
        }
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Card>
          <CardMedia
            image={image}
            style={{ height: 180 }}
          />
          <CardContent>
            {
              this.props.showBusinessName
                ? <Link to={"/business/s/" + this.props.business.enName}>
                    <Typography variant="title" gutterBottom>
                      {this.props.business.krName}
                    </Typography>
                  </Link>
                : null
            }
            <Stars count={5} size={20} value={this.props.rating} edit={false} />

            <br />
            {
              this.props.showUser
                ? <Typography variant="body2" gutterBottom>
                    <strong>
                      <ProperName user={this.props.owner} />
                    </strong>
                  </Typography>
                : null
            }
            <Typography variant="body1" gutterBottom>{this.props.content}</Typography>

            <br />
            <div>
              {
                this.props.serviceGood ? <Chip className={classes.chip} label="서비스 + 1" /> : ''
              }
              {
                this.props.envGood ? <Chip className={classes.chip} label="환경 + 1" /> : ''
              }
              {
                this.props.comeback ? <Chip className={classes.chip} label="다시 오고 싶다 + 1" /> : ''
              }
            </div>
          </CardContent>

          <CardActions>
            {
              (this.props.isOwn && !this.props.showUser)
                ? <IconButton color="secondary" onClick={this.handleDeleteDialogOpen}>
                    <Delete />
                  </IconButton>
                : null
            }

            <ThumbButton
              type="up"
              disabled={this.props.isOwn}
              count={this.state.upvoteCount}
              handleSubmit={this.handleUpvote}
            />
          </CardActions>
        </Card>

        <div >
          {
            this.props.isOwn
              ? <ConfirmationDialog
                    open={this.state.deleteDialogOpen}
                    title="Warning"
                    content="Are you sure to delete the review?"
                    operation={this.handleDelete}
                    handleClose={this.handleDeleteDialogClose}
                  />
              : null
          }
        </div>
      </div>
    );
  }
}

ReviewCard.propTypes = {
  "classes": PropTypes.object.isRequired,
  "id": PropTypes.string.isRequired,
  "isOwn": PropTypes.bool.isRequired,
  "owner": PropTypes.object.isRequired,
  "userId": PropTypes.string.isRequired,
  "showUser": PropTypes.bool,
  "business": PropTypes.object.isRequired,
  "showBusinessName": PropTypes.bool,
  "rating": PropTypes.number.isRequired,
  "content": PropTypes.string,
  "serviceGood": PropTypes.bool,
  "envGood": PropTypes.bool,
  "comeback": PropTypes.bool,
  "upvoteCount": PropTypes.number,
  "deleteReview": PropTypes.func,
  "getNewReviews": PropTypes.func,
};

export default withStyles(styles)(ReviewCard);
