import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Stars from 'react-stars';
import { withStyles } from 'material-ui/styles';
import Card, {CardContent, CardActions, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import ThumbUp from 'material-ui-icons/ThumbUp';
import ThumbDown from 'material-ui-icons/ThumbDown';
import IconButton from 'material-ui/IconButton';

import ConfirmationDialog from './ConfirmationDialog';
import WriteReviewDialog from './WriteReviewDialog';
import ProperName from './ProperName';

import image from '../../../css/ikt-icon.gif';

const styles = {
  media: {
    height: 200,
  },
};

class ReviewCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "deleteDialogOpen": false,
      "editDialogOpen": false,
      "business": {},
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteDialogOpen = this.handleDeleteDialogOpen.bind(this);
    this.handleDeleteDialogClose = this.handleDeleteDialogClose.bind(this);
    this.handleEditDialogOpen = this.handleEditDialogOpen.bind(this);
    this.handleEditDialogClose = this.handleEditDialogClose.bind(this);
    this.handleClickUpVote = this.handleClickUpVote.bind(this);
    this.handleClickDownVote = this.handleClickDownVote.bind(this);
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

  handleEditDialogOpen() {
    this.setState({
      "editDialogOpen": true,
    });
  }

  handleEditDialogClose() {
    this.setState({
      "editDialogOpen": false,
    });
  }

  handleDelete() {
    if (this.props.handleDelete && this.props.id) {
      this.props.handleDelete({
        _id: this.props.id,
        uid: this.props.owner._id,
      }).then(response => {
        this.setState({
          deleteDialogOpen: false,
        });
      });
    }
  }

  handleClickUpVote() {
    if (!_.isUndefined(this.props.handleVote) && this.props.owner._id !== this.props.user._id) {
      this.props.handleVote(this.props.id, {
        uid: this.props.user._id,
        vote: 'upVote',
      });
    }
  }

  handleClickDownVote() {
    if (!_.isUndefined(this.props.handleVote) && this.props.owner._id !== this.props.user._id) {
      this.props.handleVote(this.props.id, {
        uid: this.props.user._id,
        vote: 'downVote',
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Card className={classes.card}>
          <CardMedia className={classes.media}
            image={image}
          />
          <CardContent>
            {
              this.props.showBusinessName
                ? <Typography type="title" gutterBottom>
                    {this.props.business.krName}
                  </Typography>
                : ''
            }
            <Stars count={5} size={20} value={this.props.rating} edit={false} />
            {
              this.props.showUser
                ? <Typography type="body1" gutterBottom>
                    <ProperName user={this.props.owner} />
                  </Typography>
                : ''
            }
            <Typography type="body1" gutterBottom>{this.props.content}</Typography>
            <div>
              <span>
                <IconButton onClick={this.handleClickUpVote}>
                  <ThumbUp color="primary" />
                </IconButton>
                {this.props.upVoteNum}
              </span>
              <span>
                <IconButton onClick={this.handleClickDownVote}>
                  <ThumbDown />
                </IconButton>
                {this.props.downVoteNum}
              </span>
            </div>
          </CardContent>
          {
            this.props.isOwn ? (
              <CardActions>
                <Button color="primary" onClick={this.handleEditDialogOpen}>Edit</Button>
                <Button color="secondary" onClick={this.handleDeleteDialogOpen}>Delete</Button>
              </CardActions>
            ) : ''
          }
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

                <WriteReviewDialog
                  id={this.props.id}
                  user={this.props.owner}
                  rating={this.props.rating}
                  content={this.props.content}
                  serviceGood={this.props.serviceGood}
                  envGood={this.props.envGood}
                  comeback={this.props.comeback}
                  business={this.props.business}
                  open={this.state.editDialogOpen}
                  handleSubmit={this.props.handleUpdate}
                  handleClose={this.handleEditDialogClose}
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
  "isOwn": PropTypes.bool,
  "owner": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "showUser": PropTypes.bool,
  "business": PropTypes.object.isRequired,
  "showBusinessName": PropTypes.bool,
  "rating": PropTypes.number.isRequired,
  "content": PropTypes.string,
  "serviceGood": PropTypes.bool,
  "envGood": PropTypes.bool,
  "comeback": PropTypes.bool,
  "upVoteNum": PropTypes.number,
  "downVoteNum": PropTypes.number,
  "handleUpdate": PropTypes.func,
  "handleDelete": PropTypes.func,
};

export default withStyles(styles)(ReviewCard);
