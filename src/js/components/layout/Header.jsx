import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Img from 'react-image';
import qs from 'querystring';
import classNames from 'classnames';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

// Material UI Icons
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Notifications from '@material-ui/icons/Notifications';
import Search from '@material-ui/icons/Search';
import FiberNew from '@material-ui/icons/FiberNew';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Restaurant from '@material-ui/icons/Restaurant';
import LocalBar from '@material-ui/icons/LocalBar';
import LocalPlay from '@material-ui/icons/LocalPlay';
import LocalHospital from '@material-ui/icons/LocalHospital';
import Spa from '@material-ui/icons/Spa';
import LocalMall from '@material-ui/icons/LocalMall';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

// Custom Components
import LinkContainer from 'js/components/utils/LinkContainer';
import Avatar from 'js/components/utils/Avatar';
import LoginDialog from 'js/components/utils/LoginDialog';
import MessageContent from 'js/components/utils/MessageContent';
import ProperName from 'js/components/utils/ProperName';
import getElapsedTime from 'js/helpers/ElapsedTime';
import CustomButton from 'js/components/utils/Button';
import SearchBar from 'js/components/utils/SearchBar';
import Explore from '@material-ui/icons/Explore';
import Settings from '@material-ui/icons/Settings';

// Actions
import { logout } from 'js/actions/user.actions';
import { openLoginDialog } from 'js/actions/app.actions';
import { getNotification } from 'js/actions/notification.actions';

import Logo from 'img/logo.png';

const styles = theme => ({
  "root": {
    flexGrow: 1,

  },
  "appBar": {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.primary.main,
  },
  "transparentAppBar": {
    backgroundColor: 'transparent',
    boxShadow: 'unset',
  },
  "buttonWrapper": {
    width: 960,
    margin: 'auto'
  },
  "logo": {
    width: 200,
    margin: 0,
    height: '100%',
    color: 'white',
  },
  "button": {
    marginLeft: theme.spacing.unit * 2,
  },
  "account": {
    "margin": "0 auto",
    "marginTop": theme.spacing.unit * 3,
    "marginBottom": theme.spacing.unit * 3,
    "textAlign": "center",
  },
  "avatarName": {
    "marginTop": theme.spacing.unit,
  },
  "popoverContainer": {
    width: 500,
    height: 400,
    padding: theme.spacing.unit * 3,
  },
});

class Header extends Component {
  constructor(props) {
    super(props);

    const parsed = qs.parse(props.location.search.slice(1));

    this.state = {
      "drawerOpen": false,
      "search": parsed.s || '',
      "notificationPopoverOpen": false,
      "notificationsList": [],
      "categoriesPopoverOpen": false,
    };

    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleNotificationPopoverOpen = this.handleNotificationPopoverOpen.bind(this);
    this.handleNotificationPopoverClose = this.handleNotificationPopoverClose.bind(this);
    this.handleClickListItem = this.handleClickListItem.bind(this);
    this.handleCategoriesMenuOpen = this.handleCategoriesMenuOpen.bind(this);
    this.handleCategoriesMenuClose = this.handleCategoriesMenuClose.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleDrawerToggle() {
    this.setState({
      "drawerOpen": !this.state.drawerOpen
    });
  }

  handleNotificationPopoverOpen() {
    if (this.props.user._id) {
      this.props.getNotification({
        uid: this.props.user._id,
        unRead: true,
        limit: 10,
      })
      .then(response => {
        if (response) {
          this.setState({
            notificationPopoverOpen: true,
            notificationsList: response.list.slice(),
          });
        }
      });
    }
  }

  handleNotificationPopoverClose() {
    this.setState({
      notificationPopoverOpen: false,
    });
  }

  handleLogout() {
    this.props.logout()
      .then(response => {
        if (response) {
          this.setState({
            drawerOpen: false,
          });
        }

        this.props.history.push('/');
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

  handleCategoriesMenuOpen() {
    this.setState({
      "categoriesPopoverOpen": true
    });
  }

  handleCategoriesMenuClose() {
    this.setState({
      "categoriesPopoverOpen": false
    });
  }

  render() {
    const { classes, user, isLoggedIn, updatedAt, newNotificationCount, categories } = this.props;

    return (
      <div className={classes.root}>
        <AppBar
          position={this.props.position}
          className={this.props.position === 'fixed' ? classes.appBar : classNames(classes.appBar, classes.transparentAppBar)}
        >
          <div className={classes.buttonWrapper}>
          <Toolbar disableGutters>
            <div style={{ flex: 1 }}>
              <Link to="/">
                {/* <Img src={Logo} className={classes.logo} />*/}
                <Typography variant="title" color="inherit" className={classes.logo}>iKoreaTown</Typography>
              </Link>
            </div>

            <LinkContainer to="/search">
              <IconButton color="inherit" className={classes.button}>
                <Search />
              </IconButton>
            </LinkContainer>

            <LinkContainer to="/explore">
              <IconButton color="inherit" className={classes.button}>
                <Explore />
              </IconButton>
            </LinkContainer>

            {
              isLoggedIn
                ? <div>
                    <IconButton
                      color="inherit"
                      className={classes.button}
                      onClick={this.handleNotificationPopoverOpen}
                      buttonRef={node => {
                        this.notificationAnchorEl = node;
                      }}
                    >
                      <Notifications />
                    </IconButton>
                    <Button
                      className={classes.button}
                      onClick={this.handleDrawerToggle}
                    >
                      <Avatar user={user} updatedAt={updatedAt} />
                    </Button>
                  </div>
                : <IconButton color="inherit" className={classes.button} onClick={this.props.openLoginDialog}>
                    <AccountCircle />
                  </IconButton>
            }
          </Toolbar>
          </div>
        </AppBar>

        <div>
          {
            isLoggedIn
              ? <Drawer
                  anchor="right"
                  open={this.state.drawerOpen}
                  onClose={this.handleDrawerToggle}
                  variant="temporary"
                >
                  <div style={{ width: 230 }}>
                    <div className={classes.account}>
                      <Avatar user={user} type="MEDIUM" updatedAt={updatedAt} />
                      <Typography variant="body1" className={classes.avatarName}>
                        <ProperName user={user} />
                      </Typography>
                    </div>

                    <Divider />

                    <MenuList>
                      <Link to="/setting/account">
                        <MenuItem>
                          <ListItemIcon>
                            <Settings />
                          </ListItemIcon>
                          <ListItemText primary="Settings" />
                        </MenuItem>
                      </Link>
                      <MenuItem onClick={this.handleLogout}>
                        <ListItemIcon>
                          <ExitToApp />
                        </ListItemIcon>
                        <ListItemText primary="Sign Out" />
                      </MenuItem>
                    </MenuList>
                  </div>
                </Drawer>
              : <LoginDialog />
          }

          <Popover
            open={this.state.notificationPopoverOpen}
            anchorEl={this.notificationAnchorEl}
            onClose={this.handleNotificationPopoverClose}
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
                  <Typography variant="body1">{newNotificationCount} new notifications</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Link to="/setting/notification">
                    <Typography variant="button" align="right">View all</Typography>
                  </Link>
                </Grid>
              </Grid>
              <Divider />
              <List>
                {
                  _.isEmpty(this.state.notificationsList)
                    ? <Typography variant="body1" align="center">No more new notifications</Typography>
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
        </div>
      </div>
    );
  }
}

Header.defaultProps = {
  position: "fixed"
};

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  position: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  updatedAt: PropTypes.number,
  isLoggedIn: PropTypes.bool.isRequired,
  newNotificationCount: PropTypes.number.isRequired,
  logout: PropTypes.func.isRequired,
  getNotification: PropTypes.func.isRequired,
  openLoginDialog: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "isFetching": state.userReducer.isFetching,
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "updatedAt": state.userReducer.updatedAt,
    "newNotificationCount": state.notificationReducer.unreadCount,
    "categories": state.categoryReducer.categoriesList,
  };
};

export default withRouter(connect(mapStateToProps, {
  logout,
  getNotification,
  openLoginDialog
})(withStyles(styles)(Header)));
