import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormData from 'form-data';
import { withStyles } from 'material-ui/styles';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import _ from 'lodash';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import { CircularProgress } from 'material-ui/Progress';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import AddPhoto from 'material-ui-icons/AddAPhoto';

import Avatar from '../../utils/Avatar';

const styles = (theme) => ({
  "container": {
    "marginBottom": theme.spacing.unit * 6
  },
  "paper": {
    "padding": theme.spacing.unit * 5,
    "color": theme.palette.text.secondary
  },
  "button": {
    "margin": theme.spacing.unit,
  },
  "bigDivider": {
    "marginTop": theme.spacing.unit * 2,
    "marginBottom": theme.spacing.unit * 2
  },
  "avatar": {
    "marginBottom": 18,
  },
});

class ChangeAvatarModule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
      slider: 10,
    };

    this.onSliderChange = this.onSliderChange.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({
        image: null
      });
    }
  }

  onSliderChange = (value) => {
    this.setState({
      "slider": value,
    });
  }

  onDrop(acceptedFiles, rejectedFiles) {
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

        this.props.uploadProfilePhoto(id, formData);
      }, 'image/jpeg', 1);
    }
  }

  handleClear() {
    this.setState({
      image: null,
    });
  }

  render() {
    const { classes, user, updatedAt, isFetching } = this.props;

    return (
      <Paper className={classes.paper}>
        <Grid container spacing={0} justify="center" alignItems="center">
          <Grid item xs={6}>
            <Grid container justify="center">
              <Grid item>
                {_.isEmpty(this.state.image)
                  ? (<div style={{ marginBottom: 18 }}>
                      <Avatar user={user} type="BIG" updatedAt={updatedAt}/>
                    </div>)
                  : (<div>
                      <AvatarEditor
                        ref={this.setEditorRef}
                        image={this.state.image}
                        width={150}
                        height={150}
                        border={50}
                        borderRadius={100}
                        color={[0, 0, 0, 0.5]} // RGBA
                        scale={this.state.slider / 10}
                        rotate={0}
                        />
                      <Slider min={5} max={30} value={this.state.slider} onChange={this.onSliderChange} />
                    </div>)
                }
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container justify="center">
              <Grid item>
                <Dropzone
                  multiple={false}
                  accept="image/*"
                  onDrop={this.onDrop}
                  className={classes.dropZone}
                >
                  <AddPhoto style={{ width:50, height:50, marginTop:75, marginLeft: 70 }} />
                </Dropzone>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Divider className={classes.bigDivider}/>
            <Grid container justify="center">
              <Grid item>
                <Button raised color="primary" className={classes.button}
                  onClick={this.handleUpload}
                  disabled={_.isEmpty(this.state.image) || isFetching}
                >
                  {isFetching ? (<CircularProgress size={20} />) : 'Upload'}
                </Button>
              </Grid>
              <Grid item>
                <Button color="primary" className={classes.button} onClick={this.handleClear}>Cancel</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  };
}

ChangeAvatarModule.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "updatedAt": PropTypes.number,
  "error": PropTypes.bool,
  "isFetching": PropTypes.bool,
  "uploadProfilePhoto": PropTypes.func.isRequired,
};

export default withStyles(styles)(ChangeAvatarModule);
