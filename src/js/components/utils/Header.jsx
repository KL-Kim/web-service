import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import { ListItemIcon, ListItemText } from 'material-ui/List';
import { MenuList, MenuItem } from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import AccountCircle from 'material-ui-icons/AccountCircle';
import ExitToApp from 'material-ui-icons/ExitToApp';

import LinkContainer from './LinkContainer';
import Avatar from './Avatar';
import ProperName from './ProperName';
import AdminSidebarMenuList from './AdminSidebarMenuList';

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
    this.props.history.push('/');
  }

  render() {
    const { classes, user, isLoggedIn, updatedAt, position, match } = this.props;
    let button;

    if (isLoggedIn) {
      button = (
        <Button color="inherit" onClick={this.toggleDrawer}>
          <Avatar user={user} updatedAt={updatedAt} />
        </Button>
      );
    } else {
      button = (<LinkContainer to="/signin"><Button color="inherit">Sign In</Button></LinkContainer>)
    }
    
    const role = _.isEmpty(user) ? '' : user.role;

    const drawer = isLoggedIn
     ? (<Drawer
          anchor="right"
          open={this.state.open}
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
          {_.isUndefined(role) ? '' : (<AdminSidebarMenuList admin={user} match={match} />)}
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
  updatedAt: PropTypes.number,
  isLoggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

export default withRouter(withStyles(styles)(Header));
