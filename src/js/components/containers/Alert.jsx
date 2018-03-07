import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import Fade from 'material-ui/transitions/Fade';
import CloseIcon from 'material-ui-icons/Close';
import ErrorIcon from 'material-ui-icons/Error';
import CheckCircle from 'material-ui-icons/CheckCircle';

import { connect } from 'react-redux';
import { alertClear } from '../../actions/alert.actions'

const styles = theme => ({
  icon: {
    verticalAlign: 'middle',
    marginRight: 15,
    // color: theme.palette.error.main
  },
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

    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.props.alertClear();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message || nextProps.error) {
      this.setState({
        open: true,
      });
    }
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
    const { classes, message, error } = this.props;

    const messageContent = error ?
      (<div id="message-id"><ErrorIcon className={classes.icon} color="error" /><span>{message}</span></div>)
      : (<div id="message-id"><CheckCircle className={classes.icon} />{message}</div>)

    return (
        <Snackbar
          anchorOrigin={anchorOrigin}
          open={this.state.open}
          transition={Fade}
          autoHideDuration={hideDuration}
          onClose={this.handleClose}
          SnackbarContentProps={SnackbarContentProps}
          message={messageContent}
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
  id: PropTypes.string,
  message: PropTypes.string,
  alertClear: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
  return {
    id: state.alertReducer.id,
    message: state.alertReducer.message,
    error: state.alertReducer.error
  };
};

export default connect(mapStateToProps, { alertClear })(withStyles(styles)(Alert));
