import React, { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Stars from 'react-stars';
import Dropzone from 'react-dropzone';
import Img from 'react-image';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
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

class VerifyDialog extends PureComponent {
    render() {
        const { classes } = this.props;

        return (
            <Dialog 
                fullWidth
                fullScreen={this.props.fullScreen}
                scroll="paper"
                open={this.props.open}
                onClose={this.props.onClose}
                aria-labelledby="verify-dialog-title"
                aria-describedby="verify-dialog-description"
            >
                <Hidden smUp>
                    <AppBar className={classes.appBar} color="inherit">
                    <Toolbar>
                        <div className={classes.flex}>
                        <IconButton color="inherit" onClick={this.props.onClose} >
                            <Close />
                        </IconButton>
                        </div>
                    </Toolbar>
                    </AppBar>
                </Hidden>

                <DialogTitle id="verify-dialog-title">
                    Oops
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Sorry, your account is not verified. Please verify your account first!
                    </DialogContentText>
                    <br />

                    <Grid container justify="center">
                        <Grid item>
                            <Link to="/setting/account">
                                <Button
                                    variant="raised"
                                    color="primary"
                                >
                                    Verify
                                </Button>
                            </Link>
                        </Grid>
                    </Grid>
                </DialogContent>

                <Hidden xsDown>
                    <DialogActions>
                        <Button size="small" color="primary" onClick={this.props.onClose}>
                            Ok
                        </Button>
                    </DialogActions>
                </Hidden>
            </Dialog>
        );
    }
}

VerifyDialog.propTypes = {
    "fullScreen": PropTypes.bool.isRequired,
    "classes": PropTypes.object.isRequired,
    "open": PropTypes.bool.isRequired,
    "onClose": PropTypes.func.isRequired,
};

export default withStyles(styles)(withMobileDialog()(VerifyDialog));