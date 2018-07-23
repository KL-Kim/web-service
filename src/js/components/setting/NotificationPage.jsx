import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import CircularProgress from '@material-ui/core/CircularProgress';

// Material UI Icons
import DeleteIcon from '@material-ui/icons/Delete';
import FiberNew from '@material-ui/icons/FiberNew';
import ClearAll from '@material-ui/icons/ClearAll';

// Custom Components
import SettingContainer from '../layout/SettingContainer';
import MessageContent from '../utils/MessageContent';
import ConfirmationDialog from '../utils/ConfirmationDialog';
import getElapsedTime from 'js/helpers/ElapsedTime';

// Webstorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

// Actions
import {
  getNotification,
  deleteNotification,
  clearReadNotifications
} from 'js/actions/notification.actions';


const styles = (theme) => ({
  "root": {
    maxWidth: 720,
    margin: 'auto'
  },
  "itemWrapper": {
    marginBottom: theme.spacing.unit * 2,
  },
  "button": {
    margin: theme.spacing.unit,
  },
  "rightIcon": {
    marginLeft: theme.spacing.unit,
  },
});

class NotificationPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      dialogOpen: false,
      limit: 20,
      count: 0,
      id: '',
      hasMore: false,
    };

    this.state.userId = props.user._id || loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);

    this.handleDelete = this.handleDelete.bind(this);
    this.handleConfirmationDialogOpen = this.handleConfirmationDialogOpen.bind(this);
    this.handleConfirmationDialogClose = this.handleConfirmationDialogClose.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleClearNotifications = this.handleClearNotifications.bind(this);
    this.handleClickListItem = this.handleClickListItem.bind(this);
  }

  componentDidMount() {
    if (this.state.userId) {
      this.props.getNotification({ uid: this.state.userId, limit: this.state.limit })
        .then(response => {
          if (response) {
            this.setState({
              list: response.list.slice(),
              count: response.list.length,
              hasMore: response.list.length < response.totalCount
            });
          }
        });
    }
  }

  handleDelete = (id, index) => e =>  {
    this.props.deleteNotification(id)
      .then(response => {
        if (response) {
          const list = this.state.list.slice();
          list.splice(index, 1);

          this.setState({
            list: list,
          });
        }
      });
  }

  handleConfirmationDialogOpen() {
    this.setState({
      dialogOpen: true,
    });
  }

  handleConfirmationDialogClose() {
    this.setState({
      dialogOpen: false
    });
  }

  handleClearNotifications() {
    this.props.clearReadNotifications(this.state.userId)
      .then(response => {
        if (response) {
          this.setState({
            dialogOpen: false,
            list: [],
          });
        }
      });
  }

  handleClickListItem = item => e => {
    switch (item.type) {
      case "BUSINESS":
        this.props.history.push('/business/s/' + item.subjectUrl);
        break;

      case "REVIEW":
        this.props.history.push('/business/s/' + item.subjectUrl, { reviewId: item.commentId });
        break;

      case "COMMENT":
        this.props.history.push('/post/s/' + item.subjectUrl, {});
        break;

      default:
        return;
    }
  }

  loadMore() {
    if (this.state.hasMore) {
      this.props.getNotification({
        uid: this.state.userId,
        limit: this.state.limit,
        skip: this.state.count
      })
      .then(response => {
        if (response) {
          this.setState({
            count: this.state.count + response.list.length,
            hasMore: (this.state.count + response.list.length) < response.totalCount,
            list: this.state.list.concat(response.list),
          });
        }

      });
    }
  }

  render() {
    const { classes } = this.props;

    return _.isEmpty(this.props.user) ? null : (
      <SettingContainer>
        <div className={classes.root}>
          <Grid container className={classes.root} justify="space-between" alignItems="flex-end">
            <Grid item>
              <Typography variant="display1">Notifications</Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.handleConfirmationDialogOpen}
              >
                Clear
                <ClearAll className={classes.rightIcon} />
              </Button>
            </Grid>
          </Grid>

          <br />

          {
            _.isEmpty(this.state.list)
              ? <Typography align="center">None</Typography>
              : <div>
                  <List>
                    <InfiniteScroll
                      pageStart={0}
                      loadMore={this.loadMore}
                      hasMore={this.state.hasMore}
                      loader={<div style={{ textAlign: 'center' }} key={0}>
                                <CircularProgress size={30} />
                              </div>}
                    >
                      {
                        this.state.list.map((item, index) =>
                          <Paper className={classes.itemWrapper} key={item._id}>
                            <ListItem className={classes.listItem} button onClick={this.handleClickListItem(item)}>
                              {
                                item.isRead
                                  ? null
                                  : <ListItemIcon>
                                      <FiberNew color="secondary"/>
                                    </ListItemIcon>
                              }
                              <ListItemText
                                primary={
                                  <MessageContent
                                    key={item._id}
                                    sender={item.senderId}
                                    type={item.type}
                                    event={item.event}
                                    subjectTitle={item.subjectTitle}
                                    subjectContent={item.subjectContent}
                                    commentContent={item.commentContent}
                                    subjectUrl={item.subjectUrl}
                                    commentId={item.commentId}
                                    content={item.content}
                                  />
                                }
                                secondary={getElapsedTime(item.createdAt)}
                              />
                              <ListItemSecondaryAction>
                                <IconButton aria-label="delete" onClick={this.handleDelete(item._id, index)}>
                                  <DeleteIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                          </Paper>
                        )
                      }
                    </InfiniteScroll>
                  </List>
                  {
                    this.state.hasMore
                      ? null
                      : <Typography variant="caption" align="center">
                          --- No More Notifications ---
                        </Typography>
                  }
                </div>

          }

          <div id="modal-container">
            <ConfirmationDialog
              open={this.state.dialogOpen}
              title="Warning"
              content="Are you sure to clear all?"
              operation={this.handleClearNotifications}
              handleClose={this.handleConfirmationDialogClose}
            />
          </div>
        </div>
      </SettingContainer>
    );
  }
}

NotificationPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "notificationList": state.notificationReducer.list,
    "totalCount": state.notificationReducer.totalCount,
  };
};

export default connect(mapStateToProps, { getNotification, deleteNotification, clearReadNotifications })(withStyles(styles)(NotificationPage));
