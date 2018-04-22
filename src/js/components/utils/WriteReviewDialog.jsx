import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Quill from 'react-quill';
import _ from 'lodash';
import Stars from 'react-stars';
import Dropzone from 'react-dropzone';
import Img from 'react-image';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import Tooltip from 'material-ui/Tooltip';
import AddPhoto from 'material-ui-icons/AddAPhoto';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote', 'code', ],
    [{'color': []}, {'background': []}],
    [{ 'align': [] }, {'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['clean']
  ]
};

const format = ['header',
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code',
  'color', 'background',
  'list', 'bullet', 'indent',
];

const styles = theme => ({
  "button": {
    marginRight: theme.spacing.unit,
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
      images: [],
      "serviceGood": props.serviceGood || false,
      "envGood": props.envGood || false,
      "comeback": props.comeback || false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleStarChange = this.handleStarChange.bind(this);
    this.onDropImages = this.onDropImages.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState({
        rating: nextProps.rating || null,
        content: nextProps.content || '',
        "serviceGood": nextProps.serviceGood || false,
        "envGood": nextProps.envGood || false,
        "comeback": nextProps.comeback || false,
      });
    }
  }

  handleChange = (content) => this.setState({ content: content });

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

  onDropImages(acceptedFiles) {
    this.setState({
      images:  this.state.images.concat(acceptedFiles)
    });
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
    this.props.handleClose();
  }

  handleSubmit() {
    const data = {
      uid: this.props.user._id,
      rating: this.state.rating,
      content: this.state.content,
      serviceGood: this.state.serviceGood,
      envGood: this.state.envGood,
      comeback: this.state.comeback,
    }

    if (this.props.id) {
      data._id = this.props.id;
    } else {
      data.bid = this.props.business._id;
    }

    this.props.handleSubmit(data).then(response => {
      this.handleClose();
    });
  }

  render() {
    const { classes, business } = this.props;

    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.handleClose}
          aria-labelledby="review-dialog-title"
          aria-describedby="review-dialog-description"
        >
          <DialogTitle id="review-dialog-title">
            "{business.krName}"에 대한 리뷰
          </DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={12}>
                <Stars count={5} size={24} half={false} value={this.state.rating} onChange={this.handleStarChange}/>
              </Grid>
              <Grid item xs={12}>
                <Tooltip id="tooltip-service" title="서비스가 좋은가요?" placement="bottom">
                  <Button size="small"
                    color="primary"
                    className={classes.button}
                    raised={this.state.serviceGood}
                    onClick={this.handleClick("serviceGood")}

                  >
                    서비스 {this.state.serviceGood ? '+1' : ''}
                  </Button>
                </Tooltip>
                <Tooltip id="tooltip-env" title="환경이 좋은가요?" placement="bottom">
                  <Button size="small"
                    color="primary"
                    className={classes.button}
                    raised={this.state.envGood}
                    onClick={this.handleClick("envGood")}
                  >
                    환경 {this.state.envGood ? '+1' : ''}
                  </Button>
                </Tooltip>
                <Tooltip id="tooltip-back" title="다시 오실 건가요?" placement="bottom">
                  <Button size="small"
                    color="primary"
                    className={classes.button}
                    raised={this.state.comeback}
                    onClick={this.handleClick("comeback")}
                  >
                    다시 오고 싶다 {this.state.comeback ? '+1' : ''}
                  </Button>
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <Quill value={this.state.content}
                  modules={modules}
                  format={format}
                  onChange={this.handleChange}
                />
              </Grid>
            </Grid>

            <Grid container space={16}>
              {
                _.isEmpty(this.state.images) ? ''
                : this.state.images.map((image, index) =>
                    <Grid item xs={3}>
                      <Img className={classes.image} src={image.preview} />
                    </Grid>
                  )
              }
              <Grid item xs={3}>
                <Dropzone
                  multiple={true}
                  accept="image/*"
                  onDrop={this.onDropImages}
                  className={classes.dropZone}
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
            </Grid>
            <div>

            </div>
          </DialogContent>

          <DialogActions>
            <Button raised autoFocus color="primary" disabled={!this.state.rating} onClick={this.handleSubmit}>
              Save
            </Button>
            <Button color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

      </div>
    )
  }
}

WriteReviewDialog.propTypes = {
  "classes": PropTypes.object.isRequired,
  "open": PropTypes.bool.isRequired,
  "business": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "serviceGood": PropTypes.bool,
  "envGood": PropTypes.bool,
  "comeback": PropTypes.bool,
  "handleClose": PropTypes.func.isRequired,
  "handleSubmit": PropTypes.func.isRequired,
}

export default withStyles(styles)(WriteReviewDialog);
