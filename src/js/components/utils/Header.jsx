import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import _ from 'lodash';

// Material UI Components
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import { MenuList, MenuItem } from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import { FormControl } from 'material-ui/Form';
import Input, { InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';

// Material UI Icons
import AccountCircle from 'material-ui-icons/AccountCircle';
import ExitToApp from 'material-ui-icons/ExitToApp';
import Notifications from 'material-ui-icons/Notifications';
import Search from 'material-ui-icons/Search';
import FiberNew from 'material-ui-icons/FiberNew';

// Custom Components
import LinkContainer from './LinkContainer';
import Avatar from './Avatar';
import ProperName from './ProperName';
import MessageContent from './MessageContent';
import getElapsedTime from '../../helpers/ElapsedTime';

const styles = theme => ({
  "appBar": {
    zIndex: theme.zIndex.drawer + 1,
  },
  "flex": {
    "flex": 1,
  },
  "menuButton": {
    "marginLeft": -12,
    "marginRight": 20,
  },
  "drawerPaper": {
    "width": 300,
  },
  "account": {
    "margin": "0 auto",
    "marginTop": theme.spacing.unit * 3,
    "marginBottom": theme.spacing.unit * 3,
    "textAlign": "center",
  },
  "name": {
    "marginTop": theme.spacing.unit,
  },
  "bootstrapRoot": {
    padding: 0,
    backgroundColor: theme.palette.common.white,
    borderRadius: 4,
    border: '1px solid #ced4da',
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  "bootstrapInput": {
    fontSize: 16,
    padding: '10px 12px',
    width: 'calc(100% - 24px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
  },
  "popoverContainer": {
    width: 500,
    height: 400,
    padding: theme.spacing.unit,
  },
});

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "drawerOpen": false,
      "search": '',
      "popoverOpen": false,
      "notificationsList": [],
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
    this.handlePopoverClose = this.handlePopoverClose.bind(this);
    this.handleClickListItem = this.handleClickListItem.bind(this);
  }

  toggleDrawer() {
    this.setState({
      "drawerOpen": !this.state.drawerOpen
    });
  }

  handlePopoverOpen() {
    this.props.getNotification({
      uid: this.props.user._id,
      unRead: true,
      limit: 10,
    })
    .then(response => {
      if (response) {
        this.setState({
          popoverOpen: true,
          notificationsList: response.list.slice(),
        });
      }
    });
  }

  handlePopoverClose() {
    this.setState({
      popoverOpen: false,
    });
  }

  handleLogout() {
    this.props.logout();
    this.setState({
      drawerOpen: false,
    });
    this.props.history.push('/');
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleSearch(e) {
    e.preventDefault();

    this.props.history.push("/search?s=" + this.state.search);
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
        this.props.history.push('/post/s/' + item.subjectUrl, { commentId: item.commentId });
        break;

      default:
        return ;
    }
  }

  render() {
    const { classes, user, isLoggedIn, updatedAt, position, newNotificationCount } = this.props;

    return (
      <div>
        <AppBar position={position} className={classes.appBar}>
          <Toolbar>
            <Typography type="title" color="inherit" align="left" className={classes.flex}>
              <LinkContainer to="/"><Button color="inherit">iKoreaTown</Button></LinkContainer>
            </Typography>
            <div>
              <form onSubmit={this.handleSearch}>
                <FormControl fullWidth >
                  <Input
                    classes={{
                      root: classes.bootstrapRoot,
                      input: classes.bootstrapInput,
                    }}
                    id="search"
                    type="text"
                    name="search"
                    placeholder="Search"
                    disableUnderline
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Toggle password visibility"
                          onClick={this.handleSearch}
                        >
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </form>
            </div>
            <LinkContainer to="/business/category/restaurant">
              <Button color="inherit">Business</Button>
            </LinkContainer>
            <LinkContainer to="/blog">
              <Button color="inherit">Blog</Button>
            </LinkContainer>
            {
              isLoggedIn
                ? <IconButton color="inherit"
                    onClick={this.handlePopoverOpen}
                    buttonRef={node => {
                      this.anchorEl = node;
                    }}
                  >
                    <Notifications />
                  </IconButton>
                : ''
            }

            {
              /**
              <LinkContainer to="/verify/123"><Button color="inherit">Verify</Button></LinkContainer>
              <LinkContainer to="/change-password/123"><Button color="inherit">Change Password</Button></LinkContainer>
              **/
            }
            {
              isLoggedIn
                ? <Button color="inherit" onClick={this.toggleDrawer}>
                    <Avatar user={user} updatedAt={updatedAt} />
                  </Button>
                : <LinkContainer to="/signin"><Button color="inherit">Sign In</Button></LinkContainer>
            }
          </Toolbar>
          <Popover
            open={this.state.popoverOpen}
            anchorEl={this.anchorEl}
            onClose={this.handlePopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <div className={classes.popoverContainer}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography type="body1">{newNotificationCount} new notifications</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Link to="/setting/notification">
                    <Typography type="button" align="right">View all</Typography>
                  </Link>
                </Grid>
              </Grid>
              <Divider />
              <List>
                {
                  _.isEmpty(this.state.notificationsList)
                    ? <Typography type="body1" align="center">No more new notifications</Typography>
                    : this.state.notificationsList.map((item, index) => (
                      <ListItem key={index} divider button onClick={this.handleClickListItem(item)}>
                        <ListItemIcon>
                          <FiberNew color="secondary"/>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <MessageContent
                              sender={item.senderId}
                              type={item.type}
                              event={item.event}
                              subjectTitle={item.subjectTitle}
                              subjectContent={item.subjectContent}
                              subjectUrl={item.subjectUrl}
                              commentId={item.commentId}
                              commentContent={item.commentContent}
                              content={item.content}
                            />
                          }
                          secondary={getElapsedTime(item.createdAt)}
                        />
                      </ListItem>
                    ))
                }
                {
                  (newNotificationCount <= 10) ? ''
                    : <ListItem button>
                      <Link to="/setting/notification">
                        <ListItemText primary={"You have " + (newNotificationCount - 10)  + " more new notifications"} />
                      </Link>
                    </ListItem>
                }
              </List>
            </div>
          </Popover>
        </AppBar>
        {
          isLoggedIn
           ? (<Drawer
                anchor="right"
                open={this.state.drawerOpen}
                onClose={this.toggleDrawer}
                variant="temporary"
                classes={{paper: classes.drawerPaper}}
              >
                <div className={classes.account}>
                  <Avatar user={user} type="MEDIUM" updatedAt={updatedAt} />
                  <Typography type="body1" className={classes.name}><ProperName user={user} /></Typography>
                </div>

                <Divider />

                <MenuList>
                  <LinkContainer to="/setting/account">
                    <MenuItem>
                      <ListItemIcon>
                        <AccountCircle />
                      </ListItemIcon>
                      <ListItemText primary="account" />
                    </MenuItem>
                  </LinkContainer>
                  <MenuItem>
                    <ListItemIcon>
                      <ExitToApp />
                    </ListItemIcon>
                    <ListItemText primary="logout" onClick={this.handleLogout}/>
                  </MenuItem>
                </MenuList>
              </Drawer>)
            : ''
        }
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  position: PropTypes.string.isRequired,
  user: PropTypes.object,
  updatedAt: PropTypes.number,
  isLoggedIn: PropTypes.bool.isRequired,
  newNotificationCount: PropTypes.number.isRequired,
  logout: PropTypes.func.isRequired,
  getNotification: PropTypes.func.isRequired,
};

export default withRouter(withStyles(styles)(Header));
