import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import Fade from 'material-ui/transitions/Fade';

import { connect } from 'react-redux';
import { alertClear } from '../actions/alert.actions'

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'right',
}

const SnackbarContentProps = {
  'aria-describedby': 'message-id',
};

const hideDuration = 2000;

class Alert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      open: true,
    });
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({
      open: false,
    });
  };

  render() {
    const { classes } = this.props;
    return (
        <Snackbar
          anchorOrigin={anchorOrigin}
          open={this.state.open}
          transition={Fade}
          autoHideDuration={hideDuration}
          onClose={this.handleClose}
          SnackbarContentProps={SnackbarContentProps}
          message={<span id="message-id">{this.props.message}</span>}
          action={
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          }
        />
    );
  }
}

Alert.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: state.alertReducer.id,
    message: state.alertReducer.message,
  };
};

export default withStyles(styles)(connect(mapStateToProps, { alertClear })(Alert));
