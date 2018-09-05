import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

// Material UI Icons
import Close from '@material-ui/icons/Close';

const styles = (theme) => ({
  "appBar": {
    position: 'relative',
  },
  "flex": {
    flex: 1,
  },
});

class ConfirmationDialog extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.props.onSubmit();
  }

  render() {
    const { classes } = this.props;

    return (
      <Dialog 
        fullWidth
        fullScreen={this.props.fullScreen}
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
         <Hidden smUp>
          <AppBar className={classes.appBar} color="inherit">
            <Toolbar>
                <div className={classes.flex}>
                  <IconButton color="inherit" onClick={this.props.onClose} >
                    <Close />
                  </IconButton>
                </div>
                <Button 
                  color="primary"
                  size="small"
                  onClick={this.handleSubmit}
                >
                  Delete
                </Button>
            </Toolbar>
          </AppBar>
        </Hidden>

        <DialogTitle id="alert-dialog-title">
          {this.props.title}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description" >
            {this.props.content}
          </DialogContentText>
        </DialogContent>

        <Hidden xsDown>
          <DialogActions>
            <Button size="small" onClick={this.props.onClose}>
              Cancel
            </Button>
            <Button color="primary" size="small" onClick={this.handleSubmit}>
              Ok
            </Button>
          </DialogActions>
        </Hidden>
      </Dialog>
    );
  }
}

ConfirmationDialog.propTypes = {
  "fullScreen": PropTypes.bool.isRequired,
  "classes": PropTypes.object.isRequired,
  "open": PropTypes.bool.isRequired,
  "title": PropTypes.string.isRequired,
  "content": PropTypes.string.isRequired,
  "onSubmit": PropTypes.func.isRequired,
  "onClose": PropTypes.func.isRequired,
}

export default withRouter(withStyles(styles)(withMobileDialog()(ConfirmationDialog)));
