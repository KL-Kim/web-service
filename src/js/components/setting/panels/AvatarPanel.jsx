import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormData from 'form-data';
import _ from 'lodash';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

// Material UI Icons
import AddPhoto from '@material-ui/icons/AddAPhoto';
import RotateLeft from '@material-ui/icons/RotateLeft';
import RotateRight from '@material-ui/icons/RotateRight';

// Custom Components
import Avatar from 'js/components/utils/Avatar';

const styles = (theme) => ({
  "container": {
    "marginBottom": theme.spacing.unit * 6
  },
  "paper": {
    "padding": theme.spacing.unit * 5,
  },
  "bigDivider": {
    "marginTop": theme.spacing.unit * 2,
    "marginBottom": theme.spacing.unit * 2
  },
  "avatar": {
    "marginBottom": 18,
  },
  "section": {
    "marginBottom": theme.spacing.unit * 2,
  },
});

class AvatarPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      slider: 10,
      rotate: 0,
    };

    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleRotate = this.handleRotate.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleSliderChange = (value) => {
    this.setState({
      "slider": value,
    });
  }

  handleRotate = degree => e => {
    this.setState({
      rotate: (this.state.rotate + degree) % 360
    });
  }

  handleDrop(acceptedFiles, rejectedFiles) {
    this.setState({
      image: acceptedFiles[0]
    });
  }

  setEditorRef = (editor) => (this.editor = editor)

  handleUpload = () => {
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      // const canvas = this.editor.getImage();

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      const canvasScaled = this.editor.getImageScaledToCanvas();

      canvasScaled.toBlob(blob => {
        const id = this.props.user._id;
        const formData = new FormData();

        formData.append("avatar", blob, id);

        this.props.uploadProfilePhoto(id, formData)
          .then(response => {
            if (response) {
              this.setState({
                image: null
              });
            }
          });
      }, 'image/jpeg', 1);
    }
  }

  handleClear() {
    this.setState({
      image: null,
    });
  }

  render() {
    const { classes, user, isFetching } = this.props;

    return (
      <Paper className={classes.paper}>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={6} className={classes.section}>
            <Grid container justify="center">
              <Grid item>
                {
                  _.isEmpty(this.state.image)
                    ? <div style={{ marginBottom: 18 }}>
                        <Avatar user={user} type="BIG" updatedAt={this.props.updatedAt} />
                      </div>
                    : <div>
                        <AvatarEditor
                          ref={this.setEditorRef}
                          image={this.state.image}
                          width={150}
                          height={150}
                          border={50}
                          borderRadius={100}
                          color={[0, 0, 0, 0.5]} // RGBA
                          scale={this.state.slider / 10}
                          rotate={this.state.rotate}
                        />
                        <Slider min={5} max={30} value={this.state.slider} onChange={this.handleSliderChange} />

                        <Grid container spacing={8} justify="space-around" alignItems="center">
                          <Grid item>
                            <IconButton onClick={this.handleRotate(-90)}>
                              <RotateLeft />
                            </IconButton>
                          </Grid>

                          <Grid item>
                            <IconButton onClick={this.handleRotate(90)}>
                              <RotateRight />
                            </IconButton>
                          </Grid>
                        
                        </Grid>
                        
                      </div>
                  }
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Grid container justify="center">
              <Grid item>
                <Dropzone
                  multiple={false}
                  accept="image/*"
                  onDrop={this.handleDrop}
                  className={classes.dropZone}
                >
                  <AddPhoto style={{ width: 50, height: 50, marginTop: 75, marginLeft: 70 }} />
                </Dropzone>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider className={classes.bigDivider} />
            <Grid container spacing={8} justify="center">
              <Grid item>
                <Button
                  variant="raised"
                  color="primary"
                  size="small"
                  onClick={this.handleUpload}
                  disabled={_.isEmpty(this.state.image) || isFetching}
                >
                  {
                    isFetching ? (<CircularProgress size={20} />) : 'Upload'
                  }
                </Button>
              </Grid>

              <Grid item>
                <Button
                  size="small"
                  onClick={this.handleClear}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  };
}

AvatarPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "updatedAt": PropTypes.number,
  "error": PropTypes.bool,
  "isFetching": PropTypes.bool,
  "uploadProfilePhoto": PropTypes.func.isRequired,
};

export default withStyles(styles)(AvatarPanel);
