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
import ThumbUp from '@material-ui/icons/ThumbUp';

import ConfirmationDialog from './ConfirmationDialog';
import ProperName from './ProperName';

import image from '../../../css/ikt-icon.gif';

const styles = theme => ({
  "media": {
    height: 200,
  },
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
      "upvoteNum": props.upvoteNum,
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteDialogOpen = this.handleDeleteDialogOpen.bind(this);
    this.handleDeleteDialogClose = this.handleDeleteDialogClose.bind(this);
    this.hanldeUpvote = this.hanldeUpvote.bind(this);
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
    if (!this.props.isLoggedIn) {
      this.props.history.push('/signin');
    }

    if (this.props.handleDelete && this.props.id) {
      this.props.handleDelete({
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

  hanldeUpvote() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

      return;
    }

    if (!_.isUndefined(this.props.handleVote) && !_.isEmpty(this.props.user) && this.props.owner._id !== this.props.user._id) {
      this.props.handleVote(this.props.id, {
        uid: this.props.user._id,
        businessName: this.props.business.krName + '/' + this.props.business.cnName,
        businessSlug: this.props.business.enName,
        vote: 'upvote',
      }).then(response => {
        if (response) {
          this.setState({
            "upvoteNum": response.review.upvote.length,
          });
        }
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardMedia className={classes.media}
            image={image}
          />
          <CardContent>
            {
              this.props.showBusinessName
                ? <Link to={"/business/s/" + this.props.business.enName}>
                    <Typography variant="title" gutterBottom>
                      {this.props.business.krName}
                    </Typography>
                  </Link>
                : ''
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
                : ''
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

            <div>
              <IconButton onClick={this.hanldeUpvote} disabled={this.props.isOwn}>
                <ThumbUp color={this.props.isOwn ? "inherit" : "primary"} />
              </IconButton>
              {this.state.upvoteNum}
            </div>

            {
              (this.props.isOwn && !this.props.showUser)
                ? <Button color="secondary" onClick={this.handleDeleteDialogOpen}>Delete</Button>
                : ''
            }
          </CardActions>
        </Card>
        {
          this.props.isOwn
            ? (<div>
                <ConfirmationDialog
                  open={this.state.deleteDialogOpen}
                  title="Warning"
                  content="Are you sure to delete the review?"
                  operation={this.handleDelete}
                  handleClose={this.handleDeleteDialogClose}
                />
              </div>)
            : ''
        }
      </div>
    );
  }
}

ReviewCard.propTypes = {
  "classes": PropTypes.object.isRequired,
  "id": PropTypes.string.isRequired,
  "isOwn": PropTypes.bool.isRequired,
  "owner": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "isLoggedIn": PropTypes.bool.isRequired,
  "showUser": PropTypes.bool,
  "business": PropTypes.object.isRequired,
  "showBusinessName": PropTypes.bool,
  "rating": PropTypes.number.isRequired,
  "content": PropTypes.string,
  "serviceGood": PropTypes.bool,
  "envGood": PropTypes.bool,
  "comeback": PropTypes.bool,
  "upvoteNum": PropTypes.number,
  "handleDelete": PropTypes.func,
  "getNewReviews": PropTypes.func,
};

export default withStyles(styles)(ReviewCard);
