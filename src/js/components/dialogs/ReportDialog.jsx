import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
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
import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

// Material UI Icons
import Close from '@material-ui/icons/Close';

const styles = theme => ({
  "appBar": {
    position: 'relative',
  },
  "flex": {
    flex: 1,
  },
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
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleClose() {
    this.setState({
      type: '',
      content: '',
      contact: '',
    });
    this.props.onClose();
  }

  handleSubmit() {
    this.props.onSubmit(this.state.type, this.state.content, this.state.contact);
  }

  render() {
    const { classes } = this.props;

    return (
      <Dialog 
        fullWidth
        fullScreen={this.props.fullScreen}
        scroll="paper"
        open={this.props.open}
        onClose={this.handleClose}
        aria-labelledby="report-dialog-title"
        aria-describedby="report-dialog-description"
      >
        <Hidden smUp>
          <AppBar className={classes.appBar} color="inherit">
            <Toolbar>
              <div className={classes.flex}>
                <IconButton color="inherit" onClick={this.handleClose} >
                  <Close />
                </IconButton>
              </div>
              <Button
                color="primary"
                size="small"
                disabled={!this.state.type}
                onClick={this.handleSubmit}
              >
                Send
              </Button>
            </Toolbar>
          </AppBar>
        </Hidden>

        <DialogTitle id="report-dialog-title">
          Report
        </DialogTitle>

        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <FormControl fullWidth required margin="normal">
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
              <FormControl fullWidth required margin="normal">
                <Input
                  type="text"
                  id="content"
                  multiline
                  rows={5}
                  name="content"
                  placeholder="What problem do you meet? (Required)*"
                  value={this.state.content}
                  onChange={this.handleChange}
                />
              </FormControl>
              <FormHelperText id="contact-helper-text">Please provide specific details as possible as you can</FormHelperText>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
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

        <Hidden xsDown>
          <DialogActions>
            <Button size="small" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              size="small"
              disabled={!this.state.type || !this.state.content}
              onClick={this.handleSubmit}
            >
              Send
            </Button>
          </DialogActions>
        </Hidden>
      </Dialog>
    );
  }
}

ReportDialog.propTypes = {
  "classes": PropTypes.object.isRequired,
  "open": PropTypes.bool.isRequired,
  "onSubmit": PropTypes.func.isRequired,
  "onClose": PropTypes.func.isRequired,
};

export default withMobileDialog()(withStyles(styles)(ReportDialog));
