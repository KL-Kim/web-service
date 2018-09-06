import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

// Custom Components
import SlideInTransition from 'js/components/utils/SlideInTransition';
import VerifyDialog from './VerifyDialog';

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
                    TransitionComponent={SlideInTransition}
                    open={this.props.open}
                    onClose={this.handleClose}
                    aria-labelledby="comment-dialog-title"
                    aria-describedby="comment-dialog-description"
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
                                disabled={!this.state.content} 
                                onClick={this.handleSubmit}
                            >
                                Submit
                            </Button>
                            
                        </Toolbar>
                        </AppBar>
                    </Hidden>

                    <DialogTitle id="comment-dialog-title">
                        Write Comment
                    </DialogTitle>
    
                    <DialogContent id="comment-dialog-description">
                        <FormControl fullWidth required>
                            <Input
                                type="text"
                                id="content"
                                multiline
                                rows={10}
                                name="content"
                                placeholder="Any ideas?"
                                value={this.state.content}
                                onChange={this.handleChange}
                            />
                        </FormControl>
                    </DialogContent>
    
                    <Hidden xsDown>
                        <DialogActions>
                            <Button size="small" onClick={this.handleClose}>
                                Cancel
                            </Button>
        
                            <Button color="primary" size="small" disabled={!this.state.content} onClick={this.handleSubmit}>
                                Submit
                            </Button>
                        </DialogActions>
                    </Hidden>
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