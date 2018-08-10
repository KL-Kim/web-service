import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';

// Material UI Icons
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircle from '@material-ui/icons/CheckCircle';

// Actions
import { alertClear } from 'js/actions/alert.actions'

const styles = theme => ({
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    verticalAlign: 'middle',
    marginRight: 15,
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

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

  componentDidUpdate(prevProps) {
    if (this.props.message && prevProps.id !== this.props.id) {
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
    let style, messageContent;

    if (error) {
      style = classes.error;
      messageContent =  <div id={"message-" + this.props.id}>
                          <ErrorIcon className={classes.icon} />
                          <span>{message}</span>
                        </div>;
    } else {
      messageContent =  <div id={"message-" + this.props.id}>
                          <CheckCircle className={classes.icon} />
                          <span>{message}</span>
                        </div>;
    }

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={this.state.open}
        autoHideDuration={3000}
        onClose={this.handleClose}
      >
        <SnackbarContent
          className={style}
          aria-describedby='message-id'
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
      </Snackbar>
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
