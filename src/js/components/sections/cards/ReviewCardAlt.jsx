import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import Stars from 'react-stars';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';

// Material UI Icons
import Delete from '@material-ui/icons/Delete';

// Custom Components
import ConfirmationDialog from 'js/components/utils/ConfirmationDialog';
import ProperName from 'js/components/utils/ProperName';
import Avatar from 'js/components/utils/Avatar';
import ThumbButton from 'js/components/utils/ThumbButton';

// Mock Image
import image from 'css/ikt-icon.gif';

const styles = theme => ({
  "chip":{
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class ReviewCardAlt extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      "deleteDialogOpen": false,
      "upvoteCount": props.upvoteCount,
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteDialogOpen = this.handleDeleteDialogOpen.bind(this);
    this.handleDeleteDialogClose = this.handleDeleteDialogClose.bind(this);
    this.handleClickUpvoteIcon = this.handleClickUpvoteIcon.bind(this);
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

  handleClickUpvoteIcon() {
    if (!this.props.isLoggedIn) {
      this.props.history.push("/signin", {
        from: this.props.location.pathname,
      });

      return ;
    }

    if (this.props.voteReview && this.props.userId && !this.props.isOwn) {
      this.props.voteReview(this.props.id, {
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

  handleDelete() {
    if (this.props.deleteReview && this.props.id && this.props.isOwn) {
      this.props.deleteReview({
        _id: this.props.id,
        uid: this.props.owner._id,
      })
      .then(response => {
        if (response) {
          this.props.getNewReviews();
          this.setState({
            deleteDialogOpen: false,
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
          <CardHeader
            avatar={<Link to={"/profile/" + this.props.owner.username}>
                      <Avatar user={this.props.owner} />
                    </Link>}
            title={<Link to={"/profile/" + this.props.owner.username}>
                    <ProperName user={this.props.owner} />
                  </Link>}
          />

          <Link to={"/business/s/" + this.props.business.enName}>
            <CardMedia
              image={image}
              style={{ height: 180 }}
            />
          </Link>

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
            <div>
              {
                this.props.serviceGood ? <Chip className={classes.chip} label="서비스 + 1" /> : null
              }
              {
                this.props.envGood ? <Chip className={classes.chip} label="환경 + 1" /> : null
              }
              {
                this.props.comeback ? <Chip className={classes.chip} label="다시 오고 싶다 + 1" /> : null
              }
            </div>
            <br />

            <Typography variant="body1" gutterBottom>{this.props.content}</Typography>
          </CardContent>

          <CardActions>
            <Grid container justify="space-between">
              <Grid item>
                <ThumbButton
                  type="up"
                  disabled={this.props.isOwn}
                  count={this.state.upvoteCount}
                  handleSubmit={this.handleClickUpvoteIcon}
                />
              </Grid>

              <Grid item>
                {
                  this.props.deleteReview
                    ? <IconButton color="secondary" onClick={this.handleDeleteDialogOpen}>
                        <Delete />
                      </IconButton>
                    : null
                }
              </Grid>
            </Grid>
            
            
          </CardActions>
        </Card>

        <div>
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

ReviewCardAlt.defaultProps = {
  "isLoggedIn": false,
  "userId": '',
  "isOwn": false,
  
};

ReviewCardAlt.propTypes = {
  "classes": PropTypes.object.isRequired,
  "id": PropTypes.string.isRequired,
  "isOwn": PropTypes.bool.isRequired,
  "owner": PropTypes.object.isRequired,
  "userId": PropTypes.string,
  "isLoggedIn": PropTypes.bool.isRequired,
  "business": PropTypes.object.isRequired,
  "showBusinessName": PropTypes.bool,
  "rating": PropTypes.number.isRequired,
  "content": PropTypes.string,
  "serviceGood": PropTypes.bool,
  "envGood": PropTypes.bool,
  "comeback": PropTypes.bool,
  "upvoteCount": PropTypes.number,

  // Fuctions
  "voteReview": PropTypes.func,
  "deleteReview": PropTypes.func,
  "getNewReviews": PropTypes.func,
};

export default withRouter(withStyles(styles)(ReviewCardAlt));
