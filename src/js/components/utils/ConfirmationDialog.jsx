import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';

const styles = (theme) => ({
  "button": {
    "margin": theme.spacing.unit,
    "width": 100,
  },
});

class ConfirmationDialog extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.props.operation();
  }

  render() {
    const { classes } = this.props;

    return (
      <Dialog fullWidth
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {this.props.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" >
            {this.props.content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" raised onClick={this.handleSubmit} className={classes.button}>
            Ok
          </Button>
          <Button color="primary" onClick={this.props.handleClose} className={classes.button}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ConfirmationDialog.propTypes = {
  "classes": PropTypes.object.isRequired,
  "open": PropTypes.bool.isRequired,
  "title": PropTypes.string.isRequired,
  "content": PropTypes.string.isRequired,
  "handleClose": PropTypes.func.isRequired,
  "operation": PropTypes.func.isRequired,
}

export default withRouter(withStyles(styles)(ConfirmationDialog));
