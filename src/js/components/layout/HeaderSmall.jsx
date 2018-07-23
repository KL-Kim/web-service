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

import Menu from '@material-ui/icons/Menu';

// Custom Components
import LinkContainer from 'js/components/utils/LinkContainer';
import Avatar from 'js/components/utils/Avatar';
import LoginDialog from 'js/components/utils/LoginDialog';
import MessageContent from 'js/components/utils/MessageContent';
import ProperName from 'js/components/utils/ProperName';
import getElapsedTime from 'js/helpers/ElapsedTime';
import CustomButton from 'js/components/utils/Button';
import SearchBar from 'js/components/utils/SearchBar';

// Actions
import { logout } from 'js/actions/user.actions';
import { openLoginDialog } from 'js/actions/app.actions';
import { getNotification } from 'js/actions/notification.actions';

const styles = theme => ({
  "root": {
    flexGrow: 1
  },
  "appBar": {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.primary.main,
  },
  "transparentAppBar": {
    backgroundColor: 'transparent',
    boxShadow: 'unset',
  },
  "flex": {
    flex: 1,
  },
  "logo": {
    marginRight: theme.spacing.unit * 3,
    //"width": 230,
    //"height": '100%',
    color: 'white',
  },
  "button": {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  "account": {
    "margin": "auto",
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
  "menuItemContent": {
    width: 80,
    marginLeft: theme.spacing.unit * 3,
  },
});

class HeaderSmall extends Component {
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
  }

  handleDrawerToggle() {
    this.setState({
      "drawerOpen": !this.state.drawerOpen
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
          <Toolbar>
            <div className={classes.flex}>
              <Typography variant="title" color="inherit">iKoreaTown</Typography>
            </div>

            <div>
              <IconButton color="inherit">
                <Search />
              </IconButton>
              <IconButton color="inherit" onClick={this.handleDrawerToggle}>
                <Menu />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        <div>
          <Drawer
              anchor="right"
              open={this.state.drawerOpen}
              onClose={this.handleDrawerToggle}
              variant="temporary"
            >
              <div style={{ width: 200 }}>
                <div className={classes.account}>
                  <Avatar type="MEDIUM"  user={user} updatedAt={updatedAt} />
                  <Typography variant="body1" className={classes.avatarName}>
                    <ProperName user={user} />
                  </Typography>
                </div>

                <Divider />

                <MenuList>
                  <Link to="/setting/account">
                    <MenuItem>
                      <ListItemIcon>
                        <AccountCircle />
                      </ListItemIcon>
                      <ListItemText primary="Account" />
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
        </div>
      </div>
    )
  }
}

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
})(withStyles(styles)(HeaderSmall)));
