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

class ContactDialog extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    if (this.state.contact && this.state.content) {
        this.props.handleSubmit(this.state.content, this.state.contact);
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Dialog fullWidth
        open={this.props.open}
        onClose={this.handleClose}
        aria-labelledby="contact-dialog-title"
        aria-describedby="contact-dialog-description"
      >
        <DialogTitle id="contact-dialog-title">
          Contact us
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="contact">Contact (required)</InputLabel>
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

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel htmlFor="content">Content (required)</InputLabel>
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
              <FormHelperText id="contact-helper-text">
                What's the problem are you facing?
              </FormHelperText>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="raised"
            color="primary"
            disabled={!(this.state.contact && this.state.content)}
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

ContactDialog.propTypes = {
  "classes": PropTypes.object.isRequired,
  "open": PropTypes.bool.isRequired,
  "handleSubmit": PropTypes.func.isRequired,
  "handleClose": PropTypes.func.isRequired,
};

export default withStyles(styles)(ContactDialog);
