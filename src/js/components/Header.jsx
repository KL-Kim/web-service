import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Avatar from 'material-ui/Avatar';
import deepPurple from 'material-ui/colors/deepPurple';

import Drawer from 'material-ui/Drawer';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';

import { MenuList, MenuItem } from 'material-ui/Menu';
import Book from 'material-ui-icons/Book';
import QuestionAnswer from 'material-ui-icons/QuestionAnswer';
import Favorite from 'material-ui-icons/Favorite';
import Notifications from 'material-ui-icons/Notifications';

import Fingerprint from 'material-ui-icons/Fingerprint';
import PersonAdd from 'material-ui-icons/PersonAdd';

import LinkContainer from './utils/LinkContainer';

const styles = theme => ({
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  avatar: {
    margin: 0,
    backgroundColor: deepPurple[500],
  },
  drawerPaper: {
    width: 260,
  },
});

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  toggleDrawer() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    const { classes, user, isLoggedIn } = this.props;
    let menuList;

    // const menu = isLoggedIn ?
    //   (<Button color="inherit" onClick={this.toggleDrawer(true)}><Avatar className={classes.avatar}>{user.username[0]}</Avatar></Button>) :
    //   (<Button color="inherit" onClick={this.toggleDrawer(true)}><AccountCircle /></Button>);

    const button = (<Button color="inherit" onClick={this.toggleDrawer}><AccountCircle /></Button>);

    if (isLoggedIn) {
      menuList = (
        <MenuList>
          <LinkContainer to="/setting/account">
            <MenuItem>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="account" />
            </MenuItem>
          </LinkContainer>
          <LinkContainer to="/logout">
            <MenuItem>
              <ListItemIcon>
                <Book />
              </ListItemIcon>
              <ListItemText primary="logout" />
            </MenuItem>
          </LinkContainer>
        </MenuList>
      );
    } else {
      menuList = (
        <MenuList>
          <LinkContainer to="/signin">
            <MenuItem>
              <ListItemIcon>
                <Fingerprint />
              </ListItemIcon>
              <ListItemText primary="Log in" />
            </MenuItem>
          </LinkContainer>
          <LinkContainer to="/signup">
            <MenuItem>
              <ListItemIcon>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary="Sign up" />
            </MenuItem>
          </LinkContainer>
        </MenuList>
      );
    }

    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography type="title" color="inherit" align="left" className={classes.flex}>
              <LinkContainer to="/"><Button color="inherit">iKoreaTown</Button></LinkContainer>
            </Typography>
            <LinkContainer to="/business"><Button color="inherit">Business</Button></LinkContainer>
            <LinkContainer to="/story"><Button color="inherit">Story</Button></LinkContainer>
            <LinkContainer to="/setting/account"><Button color="inherit">profile</Button></LinkContainer>

            {/**
            <LinkContainer to="/verify/123"><Button color="inherit">Verify</Button></LinkContainer>
            <LinkContainer to="/change-password/123"><Button color="inherit">Change Password</Button></LinkContainer>
            **/}

            {button}
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="right"
          open={this.state.open}
          onClose={this.toggleDrawer}
          variant="temporary"
          classes={{paper: classes.drawerPaper}}
        >
          {menuList}
        </Drawer>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  isLoggedIn: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Header);
