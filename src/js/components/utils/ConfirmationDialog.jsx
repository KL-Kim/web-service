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

    this.state = {
      open: props.open
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.open) {
      this.setState({
        open: nextProps.open
      });
    }
  }

  handleSubmit() {
    this.props.operation(this.props.params);

    if (this.props.goBack) {
      this.props.history.goBack();
    }
  }

  handleClose() {
    this.setState({
      open: false
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <Dialog fullWidth
        open={this.state.open}
        onClose={this.handleClose}
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
          <Button color="primary" raised onClick={this.handleSubmit}>
            Ok
          </Button>
          <Button color="primary" onClick={this.handleClose}>
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
  "params": PropTypes.any,
  "title": PropTypes.string.isRequired,
  "content": PropTypes.string.isRequired,
  "goBack": PropTypes.bool.isRequired,
  "operation": PropTypes.func.isRequired,
}

export default withRouter(withStyles(styles)(ConfirmationDialog));
