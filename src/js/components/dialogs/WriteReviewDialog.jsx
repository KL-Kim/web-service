import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Stars from 'react-stars';
import Dropzone from 'react-dropzone';
import Img from 'react-image';
import FormData from 'form-data';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

// Custom Components
import VerifyDialog from './VerifyDialog';

// Material UI Icons
import AddPhoto from '@material-ui/icons/AddAPhoto';
import Close from '@material-ui/icons/Close';

const styles = theme => ({
  "appBar": {
    position: 'relative',
  },
  "flex": {
    flex: 1,
  },
  "section": {
    marginBottom: theme.spacing.unit,
  },
  "image": {
    width: '100%',
  },
  "dropZone": {
    width: '100%',
    height: '100%',
    minHeight: 100,
    border: 2,
    borderStyle: 'dashed',
    display: 'inline-block',
    position: 'relative',
    cursor: 'pointer',
  },
});

class WriteReviewDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: props.rating || null,
      content: props.content || '',
      "serviceGood": props.serviceGood || false,
      "envGood": props.envGood || false,
      "comeback": props.comeback || false,
      images: [],
      errorMessage: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleStarChange = this.handleStarChange.bind(this);
    this.handleDropImages = this.handleDropImages.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.rating !== this.props.rating) || (prevProps.content !== this.props.content)) {
      this.setState({
        rating: this.props.rating || null,
        content: this.props.content || '',
        "serviceGood": this.props.serviceGood || false,
        "envGood": this.props.envGood || false,
        "comeback": this.props.comeback || false,
      });
    }
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleStarChange(rating) {
    this.setState({
      "rating": rating,
    });
  }

  handleClick = (name) => e => {
    this.setState({
      [name]: !this.state[name]
    });
  }

  handleDropImages(acceptedFiles, rejectedFiles) {
    if (acceptedFiles) {
      this.setState({
        images: this.state.images.concat(acceptedFiles),
      });
    } 
  }

  handleClose() {
    this.setState({
      rating: null,
      content: '',
      images: [],
      "serviceGood": false,
      "envGood": false,
      "comeback": false,
    });
    this.props.onClose();
  }

  handleSubmit() {
    if (this.props.addNewReview && !_.isEmpty(this.props.business) && this.props.isLoggedIn && this.props.userId && !this.props.readOnly) {      
      const formData = new FormData();

      formData.append("bid", this.props.business._id);
      formData.append("uid", this.props.userId);
      formData.append("rating", this.state.rating);
      formData.append("content", this.state.content);
      formData.append("serviceGood", this.state.serviceGood);
      formData.append("envGood", this.state.envGood);
      formData.append("comeback", this.state.comeback);

      if (!_.isEmpty(this.state.images)) {
        formData.append("images", this.state.images, this.props.userId);
      }

      this.props.addNewReview(formData)
        .then(() => {
          this.handleClose();
          this.props.getNewReviews();
        });
    }
  }

  render() {
    const { classes, business } = this.props;

    if (this.props.isLoggedIn && !this.props.isVerified) {
      return <VerifyDialog open={this.props.open} onClose={this.props.onClose} />; 
    } 
    else {
      return (
        <Dialog 
          fullWidth
          fullScreen={this.props.fullScreen}
          scroll="paper"
          open={this.props.open}
          onClose={this.handleClose}
          aria-labelledby="review-dialog-title"
          aria-describedby="review-dialog-description"
        >
          <Hidden smUp>
            <AppBar className={classes.appBar} color="inherit">
              <Toolbar>
                <div className={classes.flex}>
                  <IconButton color="inherit" onClick={this.handleClose} >
                    <Close />
                  </IconButton>
                </div>
                {
                  this.props.readOnly 
                    ? null
                    : <Button 
                        color="primary"
                        size="small"
                        disabled={!this.state.rating} 
                        onClick={this.handleSubmit}
                      >
                        Save
                      </Button>
                }
              </Toolbar>
            </AppBar>
          </Hidden>

          <DialogTitle id="review-dialog-title">
            <Link to={"/business/s/" + this.props.business.enName}>
              "{business.krName}"
            </Link>
            에 대한 리뷰
          </DialogTitle>

          <DialogContent>
            <div className={classes.section}>
              <Stars count={5} size={24} half={false} value={this.state.rating} onChange={this.handleStarChange} edit={!this.props.readOnly} />
            </div>
            
            <Grid container spacing={16} className={classes.section}>
              <Grid item xs="auto" sm={3}>
                <Tooltip id="tooltip-service" title="서비스가 좋은가요?" placement="bottom">
                  <Button 
                    fullWidth
                    size="small"
                    color="primary"
                    disabled={this.props.readOnly}
                    className={classes.button}
                    variant={this.state.serviceGood ? 'raised' : 'outlined'}
                    onClick={this.handleClick("serviceGood")}
                  >
                    서비스 {this.state.serviceGood ? '+1' : ''}
                  </Button>
                </Tooltip>
              </Grid>

              <Grid item xs="auto" sm={3}>
                <Tooltip id="tooltip-env" title="환경이 좋은가요?" placement="bottom">
                  <Button size="small"
                    fullWidth
                    disabled={this.props.readOnly}
                    color="primary"
                    className={classes.button}
                    variant={this.state.envGood ? 'raised' : 'outlined'}
                    onClick={this.handleClick("envGood")}
                  >
                    환경 {this.state.envGood ? '+1' : ''}
                  </Button>
                </Tooltip>
              </Grid>

              <Grid item xs="auto" sm={3}>
                <Tooltip id="tooltip-back" title="다시 오실 건가요?" placement="bottom">
                  <Button 
                    size="small"
                    fullWidth
                    disabled={this.props.readOnly}
                    color="primary"
                    className={classes.button}
                    variant={this.state.comeback ? 'raised' : 'outlined'}
                    onClick={this.handleClick("comeback")}
                  >
                    다시 오고 싶다 {this.state.comeback ? '+1' : ''}
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>

            <div className={classes.section}>
              <FormControl fullWidth>
                <Input
                  type="text"
                  id="content"
                  disabled={this.props.readOnly}
                  placeholder="Did you have a good time?"
                  multiline
                  rows={7}
                  name="content"
                  value={this.state.content}
                  onChange={this.handleChange}
                />
              </FormControl>
            </div>

            <br />
              
            <Grid container spacing={16}>
              {
                _.isEmpty(this.state.images) 
                  ? null
                  : this.state.images.map((image, index) =>
                      <Grid item xs={4} sm={3} key={index}>
                        <Img className={classes.image} src={image.preview} />
                      </Grid>
                  )
              }
              {
                this.props.readOnly 
                  ? null
                  : <Grid item xs={4} sm={3}>
                      <Dropzone
                        multiple
                        accept="image/*"
                        onDrop={this.handleDropImages}
                        className={classes.dropZone}
                        maxSize={1024 * 1024}
                      >
                        <AddPhoto style={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          width: 50,
                          height: 50,
                          transform: 'translate(-50%, -50%)',
                          opacity: 0.5,
                          }}
                        />
                      </Dropzone>
                    </Grid>
              }

            </Grid>
          </DialogContent>

          <Hidden xsDown>
            <DialogActions>
              <Button size="small" onClick={this.handleClose}>
                {this.props.readOnly ? 'Ok' : 'Cancel'}
              </Button>
              {
                this.props.readOnly 
                  ? null
                  : <Button 
                      color="primary" 
                      size="small"
                      disabled={!this.state.rating} 
                      onClick={this.handleSubmit}
                    >
                      Save
                    </Button>
              }
            </DialogActions>
          </Hidden>
        </Dialog>
      );
    }
  }
}

WriteReviewDialog.defaultProps = {
  "fullScreen": false,
  "open": false,
  "isLoggedIn": false,
  "userId": '',
  "isVerified": false,
  "readOnly": false,
};

WriteReviewDialog.propTypes = {
  "fullScreen": PropTypes.bool.isRequired,
  "classes": PropTypes.object.isRequired,
  "open": PropTypes.bool.isRequired,
  "onClose": PropTypes.func.isRequired,

  "isLoggedIn": PropTypes.bool.isRequired,
  "userId": PropTypes.string.isRequired,
  "isVerified": PropTypes.bool.isRequired,
  "business": PropTypes.object.isRequired,
  "serviceGood": PropTypes.bool,
  "envGood": PropTypes.bool,
  "comeback": PropTypes.bool,
  "getNewReviews": PropTypes.func.isRequired,
  "readOnly": PropTypes.bool,
};

export default withStyles(styles)(withMobileDialog()(WriteReviewDialog));
