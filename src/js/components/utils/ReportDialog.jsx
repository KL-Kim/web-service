import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

const styles = theme => ({
  "button": {
    marginRight: theme.spacing.unit,
  }
});

class ReportDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: '',
      content: '',
      contact: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.hanldeSubmit = this.hanldeSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleClose() {
    this.setState({
      content: '',
      contact: '',
    });
    this.props.handleClose();
  }

  hanldeSubmit() {
    this.props.handleSubmit(this.state.content, this.state.contact);
  }

  render() {
    const { classes } = this.props;

    return (
      <Dialog fullWidth
        open={this.props.open}
        onClose={this.handleClose}
        aria-labelledby="report-dialog-title"
        aria-describedby="report-dialog-description"
      >
        <DialogTitle id="report-dialog-title">
          Report
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="contact">Problem (required)</InputLabel>
                <Select
                  value={this.state.type}
                  onChange={this.handleChange}
                  inputProps={{
                    name: 'type',
                    id: 'type'
                  }}
                >
                  <MenuItem value="SPAM">Spam</MenuItem>
                  <MenuItem value="FALSE_INFORMATION">False information</MenuItem>
                  <MenuItem value="SEXUALITY">Sexuality Explicit</MenuItem>
                  <MenuItem value="VIOLENT">Violent</MenuItem>
                  <MenuItem value="HARASSMENT">Harassment</MenuItem>
                  <MenuItem value="OTHER">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="content">Detail</InputLabel>
                <Input
                  type="text"
                  id="content"
                  multiline
                  rows={5}
                  name="content"
                  value={this.state.content}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormHelperText id="contact-helper-text">Please provide specific details as possible as you can</FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth >
                <InputLabel htmlFor="contact">Contact</InputLabel>
                <Input
                  type="text"
                  id="contact"
                  name="contact"
                  value={this.state.contact}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormHelperText id="contact-helper-text">Please givs us your contact information, so we can contact you</FormHelperText>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="raised"
            color="primary"
            disabled={!this.state.type}
            onClick={this.hanldeSubmit}>
            Send
          </Button>
          <Button color="primary" onClick={this.handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ReportDialog.propTypes = {
  "classes": PropTypes.object.isRequired,
  "open": PropTypes.bool.isRequired,
  "handleSubmit": PropTypes.func.isRequired,
  "handleClose": PropTypes.func.isRequired,
};

export default withStyles(styles)(ReportDialog);
