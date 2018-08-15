import React, { Component } from 'react';
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

// Custom Components
import LoginDialog from './LoginDialog';
import VerifyDialog from './VerifyDialog';

// Material UI Icons
import AddPhoto from '@material-ui/icons/AddAPhoto';
import Close from '@material-ui/icons/Close';

const styles = theme => ({
  "appBar": {
    position: 'relative',
  },
  "flex": {
    flex: 1,
  },
  "section": {
    marginBottom: theme.spacing.unit,
  },
  "image": {
    width: '100%',
  },
  "dropZone": {
    width: '100%',
    height: '100%',
    minHeight: 100,
    border: 2,
    borderStyle: 'dashed',
    display: 'inline-block',
    position: 'relative',
    cursor: 'pointer',
  },
});

class WriteCommentDialog extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: '',
            parentId: '',
            replyToComment: '',
            replyToUser: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
    
        this.setState({
            [name]: value
        });
    }

    handleSubmit() {
        const { parentId, replyToUser } = this.props;

        if (this.props.addNewComment && this.props.isLoggedIn && this.props.userId && this.props.postId && this.state.content) {
            this.props.addNewComment({
                userId: this.props.userId,
                postId: this.props.postId,
                content: this.state.content,
                parentId,
                replyToUser,
            })
            .then(response => {
                if (response) {
                    if (this.props.getNewComments) {
                        this.props.getNewComments();
                    }
                }
            });

            this.handleClose();
        }
    }

    handleClose() {
        this.props.onClose();

        this.setState({
            content: '',
            parentId: '',
            replyToComment: '',
            replyToUser: '',
        });
    }

    render() {
        const { classes } = this.props;

        if (!this.props.isVerified) {
            return <VerifyDialog open={this.props.open} onClose={this.props.onClose} />; 
        }  
        else  {
            return (
                <Dialog 
                    fullWidth
                    fullScreen={this.props.fullScreen}
                    open={this.props.open}
                    onClose={this.handleClose}
                    aria-labelledby="comment-dialog-title"
                    aria-describedby="comment-dialog-description"
                >
                    <DialogTitle id="comment-dialog-title">
                        Write Comment
                    </DialogTitle>
    
                    <DialogContent id="comment-dialog-description">
                        <FormControl fullWidth required>
                            <Input
                                type="text"
                                id="content"
                                multiline
                                rows={7}
                                name="content"
                                placeholder="Any ideas?"
                                value={this.state.content}
                                onChange={this.handleChange}
                            />
                        </FormControl>
                    </DialogContent>
    
                    <DialogActions>
                        <Button size="small" onClick={this.handleClose}>
                            Cancel
                        </Button>
    
                        <Button color="primary" size="small" disabled={!this.state.content} onClick={this.handleSubmit}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }
    }
}

WriteCommentDialog.defaultProps = {
    "fullScreen": false,
    "open": false,
    "isLoggedIn": false,
    "userId": '',
    "postId": '',
    "isVerified": false,
    "readOnly": false,
};

WriteCommentDialog.propTypes = {
    "classes": PropTypes.object.isRequired,
    "readOnly": PropTypes.bool,
    "open": PropTypes.bool.isRequired,
    "onClose": PropTypes.func.isRequired,

    "isLoggedIn": PropTypes.bool.isRequired,
    "isVerified": PropTypes.bool.isRequired,
    "userId": PropTypes.string.isRequired,
    "postId": PropTypes.string.isRequired,
    "getNewComments": PropTypes.func.isRequired,
};

export default withStyles(styles)(withMobileDialog()(WriteCommentDialog));