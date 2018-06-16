import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

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
          <Button raised
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
