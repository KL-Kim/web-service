import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FormData from 'form-data';
import { withStyles } from 'material-ui/styles';
import Dropzone from 'react-dropzone';
import _ from 'lodash';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import AddPhoto from 'material-ui-icons/AddAPhoto';

const styles = (theme) => ({

});

class UploadFiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      image: null,
    };

    this.onDrop = this.onDrop.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  onDrop(acceptedFiles, rejectedFiles) {
    this.setState({
      image: acceptedFiles
    });
  }

  handleClear() {
    this.setState({
      image: null,
    });
  }

  render() {
    const { classes } = this.props;
    
    return (
      <Dropzone
        multiple={false}
        accept="image/*"
        onDrop={this.onDrop}
        className={classes.dropZone}
      >
        <AddPhoto style={{ width:50, height:50, marginTop:75, marginLeft: 70 }} />
      </Dropzone>
    )
  }
}

UploadFiles.propTypes = {
  "classes": PropTypes.object.isRequired,
}

export default withStyles(styles)(UploadFiles);
