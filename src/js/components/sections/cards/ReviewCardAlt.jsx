import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
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
import ConfirmationDialog from 'js/components/dialogs/ConfirmationDialog';
import ProperName from 'js/components/utils/ProperName';
import Avatar from 'js/components/utils/Avatar';
import ThumbButton from 'js/components/utils/ThumbButton';
import LightBox from 'js/components/utils/LightBox';

const styles = theme => ({
  "chip": {
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  "imageInfoWrapper": {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  "imageInfo": {
    backgroundColor: '#fff',
    position: 'relative',
    opacity: 0.7,
    display: 'inline-block',
    padding: theme.spacing.unit / 2,
  }
});

class ReviewCardAlt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "isRemoved": false,
      "deleteDialogOpen": false,
      "isLightboxOpen": false,
      "currentImage": 0,
      "upvoteCount": props.upvoteCount,
      "images": [],
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleDeleteDialogOpen = this.handleDeleteDialogOpen.bind(this);
    this.handleDeleteDialogClose = this.handleDeleteDialogClose.bind(this);
    this.handleClickUpvoteIcon = this.handleClickUpvoteIcon.bind(this);
    this.handleLightboxOpen = this.handleLightboxOpen.bind(this);
    this.handleLightboxClose = this.handleLightboxClose.bind(this);
  }

  componentDidMount() {
    if (!_.isEmpty(this.props.images)) {
      const images = [];

      this.props.images.map(image => {
        images.push({
          src: image.url + '-business',
          alt: image.name
        });
      })

      this.setState({
        images: [...images],
      });
    }
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

  handleLightboxOpen() {
    this.setState({
      isLightboxOpen: true
    });
  }

  handleLightboxClose() {
    this.setState({
      isLightboxOpen: false
    });
  }

  handleClickUpvoteIcon() {
    if (!this.props.isLoggedIn) {
      this.props.openLoginDialog();

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
    if (this.props.deleteReview && this.props.isLoggedIn && this.props.id && this.props.isOwn) {
      this.props.deleteReview({
        _id: this.props.id,
        uid: this.props.owner._id,
      }).then(response => {
        if (response) {
          this.setState({
            isRemoved: true,
            deleteDialogOpen: false,
          });
        }
      });
    }
  }

  render() {
    const { classes } = this.props;

    return this.state.isRemoved ? null : (
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

          {
            _.isEmpty(this.props.images)
              ? null
              : <CardMedia
                  image={this.props.images[0].url}
                  style={{ 
                    height: 180,
                    cursor: 'zoom-in', 
                    objectFit: 'cover' 
                  }}
                  onClick={this.handleLightboxOpen}
                >
                  <div className={classes.imageInfoWrapper}>
                    <Typography className={classes.imageInfo}>1 / {this.props.images.length}</Typography>
                  </div>
                </CardMedia>
          }
           

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
                  this.props.showDeleteIcon
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
                  onSubmit={this.handleDelete}
                  onClose={this.handleDeleteDialogClose}
                />
              : null
          }
          {
            _.isEmpty(this.props.images)
              ? null
              : <LightBox
                  images={this.state.images}
                  open={this.state.isLightboxOpen}
                  onClose={this.handleLightboxClose}
                />
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
  "showBusinessName": false,
  "showDeleteIcon": false,
};

ReviewCardAlt.propTypes = {
  "classes": PropTypes.object.isRequired,
  
  "id": PropTypes.string.isRequired,
  "business": PropTypes.object.isRequired,
  "rating": PropTypes.number.isRequired,
  "content": PropTypes.string,
  "serviceGood": PropTypes.bool,
  "envGood": PropTypes.bool,
  "comeback": PropTypes.bool,
  "upvoteCount": PropTypes.number,
  "images": PropTypes.array,
  
  "owner": PropTypes.object.isRequired,

  "isLoggedIn": PropTypes.bool.isRequired,
  "userId": PropTypes.string,
  "isOwn": PropTypes.bool.isRequired,
  "showBusinessName": PropTypes.bool,
  "showDeleteIcon": PropTypes.bool,

  // Methods
  "openLoginDialog": PropTypes.func.isRequired,
  "voteReview": PropTypes.func.isRequired,
  "deleteReview": PropTypes.func.isRequired,
};

export default withStyles(styles)(ReviewCardAlt);
