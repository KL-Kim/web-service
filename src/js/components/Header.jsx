import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import Drawer from 'material-ui/Drawer';
import { ListItemIcon, ListItemText } from 'material-ui/List';
import { MenuList, MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider';

import AccountCircle from 'material-ui-icons/AccountCircle';
import ExitToApp from 'material-ui-icons/ExitToApp';

import LinkContainer from './utils/LinkContainer';

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
  "avatar": {
    "margin": 0,
  },
  "bigAvatar": {
    "margin": "0 auto",
    "marginBottom": theme.spacing.unit,
    "width": 150,
    "height": 150,
    "fontSize": "2.5em",
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
});

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "open": false,
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  getAvatar(classes, user, type = "default") {
    let avatar;

    if (type === "big") {
      avatar = _.isEmpty(user.profilePhotoUri)
        ? (<Avatar className={classes.bigAvatar}>{ _.isEmpty(user.username) ? '' : _.upperCase(user.username[0])}</Avatar>)
        : (<Avatar className={classes.bigAvatar} alt={user.username[0]} src={user.profilePhotoUri} />);
    } else {
      avatar = _.isEmpty(user.profilePhotoUri)
        ? (<Avatar className={classes.avatar}>{_.isEmpty(user.username) ? '' : _.upperCase(user.username[0])}</Avatar>)
        : (<Avatar className={classes.avatar} alt={user.username[0]} src={user.profilePhotoUri} />);
    }

    return avatar;
  }

  toggleDrawer() {
    this.setState({
      "open": !this.state.open
    });
  }

  handleLogout() {
    this.props.logout();
    this.setState({
      open: false,
    });
  }

  render() {
    const { classes, user, isLoggedIn, position } = this.props;
    let button, avatar;

    if (isLoggedIn) {
      avatar = this.getAvatar(classes, user);

      button = (<Button color="inherit" onClick={this.toggleDrawer}>
          {avatar}
        </Button>);
    } else {
      button = (<LinkContainer to="/signin"><Button color="inherit">Sign In</Button></LinkContainer>)
    }

    const name = _.isEmpty(user) ? '' :((_.isEmpty(user.firstName) && _.isEmpty(user.lastName))
      ? user.username
      : ((_.isEmpty(user.firstName) ? '' : user.firstName) + ' ' + (_.isEmpty(user.lastName) ? '' : user.lastName)));

    const drawer = isLoggedIn
     ? (<Drawer
        anchor="right"
        open={this.state.open}
        onClose={this.toggleDrawer}
        variant="temporary"
        classes={{paper: classes.drawerPaper}}
       >
        <div className={classes.account}>
          {this.getAvatar(classes, user, "big")}
          <Typography type="body1">{name}</Typography>
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
      : null;

    return (
      <div>
        <AppBar position={position} className={classes.appBar}>
          <Toolbar>
            <Typography type="title" color="inherit" align="left" className={classes.flex}>
              <LinkContainer to="/"><Button color="inherit">iKoreaTown</Button></LinkContainer>
            </Typography>
            <LinkContainer to="/business"><Button color="inherit">Business</Button></LinkContainer>
            <LinkContainer to="/story"><Button color="inherit">Story</Button></LinkContainer>

            {/**
            <LinkContainer to="/verify/123"><Button color="inherit">Verify</Button></LinkContainer>
            <LinkContainer to="/change-password/123"><Button color="inherit">Change Password</Button></LinkContainer>
            **/}

            {button}
          </Toolbar>
        </AppBar>
        {drawer}
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  position: PropTypes.string.isRequired,
  user: PropTypes.object,
  isLoggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

export default withStyles(styles)(Header);
