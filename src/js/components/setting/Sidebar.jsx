import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { MenuList, MenuItem } from 'material-ui/Menu';
import { ListItemText, ListItemIcon } from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';

import AccountCircle from 'material-ui-icons/AccountCircle';
import Book from 'material-ui-icons/Book';
import QuestionAnswer from 'material-ui-icons/QuestionAnswer';
import Favorite from 'material-ui-icons/Favorite';
import Notifications from 'material-ui-icons/Notifications';

import LinkContainer from '../utils/LinkContainer';

const styles = theme => ({
  // drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: 260,
    position: 'fixed',
    marginTop: theme.spacing.unit * 8,
  },
});

class Sidebar extends Component {

  render() {
    const { classes } = this.props;

    const drawer = (
      <MenuList>
        <LinkContainer to="/setting/account">
          <MenuItem>
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="Account" />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to="/setting/story">
          <MenuItem>
            <ListItemIcon>
              <Book />
            </ListItemIcon>
            <ListItemText primary="Story" />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to="/setting/review">
          <MenuItem>
            <ListItemIcon>
              <QuestionAnswer />
            </ListItemIcon>
            <ListItemText primary="Reviews" />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to="/setting/favor">
          <MenuItem>
            <ListItemIcon>
              <Favorite />
            </ListItemIcon>
            <ListItemText primary="Favor" />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to="/setting/notification">
          <MenuItem>
            <ListItemIcon>
              <Notifications />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
          </MenuItem>
        </LinkContainer>
        <Divider />
          <LinkContainer to="/admin/setting/users">
            <MenuItem>
              <ListItemText primary="Users"/>
            </MenuItem>
          </LinkContainer>
          <LinkContainer to="/admin/setting/stories">
            <MenuItem>
              <ListItemText primary="Story"/>
            </MenuItem>
          </LinkContainer>
          <LinkContainer to="/admin/setting/reviews">
            <MenuItem>
              <ListItemText primary="Review"/>
            </MenuItem>
          </LinkContainer>
      </MenuList>
    );

    return (
      <div>
          <Drawer type="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}>
              {drawer}
          </Drawer>

      </div>
    );
  }
}

export default withStyles(styles)(Sidebar);
