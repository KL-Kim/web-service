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

import ConfirmationDialog from './ConfirmationDialog';
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
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleDialogOpen = this.handleDialogOpen.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  handleDialogOpen() {
    this.setState({
      deleteDialogOpen: true,
    });
  }

  handleDialogClose() {
    this.setState({
      deleteDialogOpen: false,
    });
  }


  handleDelete() {
    if (this.props.handleDelete && this.props.id) {
      this.props.handleDelete({
        _id: this.props.id,
        uid: this.props.uid,
      }).then(response => {
        this.setState({
          deleteDialogOpen: false,
        });
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
              _.isEmpty(this.props.business) ? ''
                : <Typography type="title" gutterBottom>
                    {this.props.business.krName}
                  </Typography>
            }
            <Stars count={5} size={20} value={this.props.rating} edit={false} />
            {
              _.isEmpty(this.props.user) ? ''
                : <Typography type="body1" gutterBottom>
                    <ProperName user={this.props.user} />
                  </Typography>
            }
            <Typography type="body1" gutterBottom>{this.props.content}</Typography>
            <div>
              <ThumbUp color="primary" /> {_.isEmpty(this.props.upVote) ? 0 : this.props.upVote.length}
              <ThumbDown /> {_.isEmpty(this.props.downVote) ? 0 :this.props.downVote.length}
            </div>
          </CardContent>
          {
            this.props.isOwn ? (
              <CardActions>
                <Button color="secondary" onClick={this.handleDialogOpen}>Delete</Button>
              </CardActions>
            ) : ''
          }
        </Card>
        <ConfirmationDialog
          open={this.state.deleteDialogOpen}
          title="Warning"
          content="Are you sure to delete the review?"
          operation={this.handleDelete}
          handleClose={this.handleDialogClose}
        />
      </div>
    );
  }
}

ReviewCard.propTypes = {
  "classes": PropTypes.object.isRequired,
  "id": PropTypes.string.isRequired,
  "isOwn": PropTypes.bool,
  "user": PropTypes.object,
  "business": PropTypes.object,
  "rating": PropTypes.number.isRequired,
  "content": PropTypes.string,
  "upVote": PropTypes.number,
  "downVote": PropTypes.number,
  "handleDelete": PropTypes.func,
};

export default withStyles(styles)(ReviewCard);
