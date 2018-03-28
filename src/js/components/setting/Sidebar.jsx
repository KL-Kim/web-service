import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
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
import Group from 'material-ui-icons/Group';
import Business from 'material-ui-icons/Business';

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
    const { classes, user } = this.props;
    let sidebar;

    const role = (_.isEmpty(user) ? '' : user.role);

    switch (role) {
      case "manager":
        sidebar = (
          <div>
            <Divider />
            <LinkContainer to="/admin/setting/business">
              <MenuItem>
                <ListItemIcon>
                  <Business />
                </ListItemIcon>
                <ListItemText primary="Business List"/>
              </MenuItem>
            </LinkContainer>
            <LinkContainer to="/admin/setting/reviews">
              <MenuItem>
                <ListItemIcon>
                  <QuestionAnswer />
                </ListItemIcon>
                <ListItemText primary="Reviews List"/>
              </MenuItem>
            </LinkContainer>
            <LinkContainer to="/admin/setting/stories">
              <MenuItem>
                <ListItemIcon>
                  <Book />
                </ListItemIcon>
                <ListItemText primary="Stories List"/>
              </MenuItem>
            </LinkContainer>
          </div>
        );
        break;

      case "admin":
        sidebar = (
          <div>
            <Divider />
            <LinkContainer to={{
                pathname: "/admin/setting/users",
                state: {
                  admin: user
                },
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <Group />
                </ListItemIcon>
                <ListItemText primary="Users List"/>
              </MenuItem>
            </LinkContainer>
            <LinkContainer to="/admin/setting/business">
              <MenuItem>
                <ListItemIcon>
                  <Business />
                </ListItemIcon>
                <ListItemText primary="Business List"/>
              </MenuItem>
            </LinkContainer>
            <LinkContainer to="/admin/setting/reviews">
              <MenuItem>
                <ListItemIcon>
                  <QuestionAnswer />
                </ListItemIcon>
                <ListItemText primary="Reviews List"/>
              </MenuItem>
            </LinkContainer>
            <LinkContainer to="/admin/setting/stories">
              <MenuItem>
                <ListItemIcon>
                  <Book />
                </ListItemIcon>
                <ListItemText primary="Stories List"/>
              </MenuItem>
            </LinkContainer>
          </div>
        );
      break;

      default:
        sidebar = '';
    }

    return (
      <div>
          <Drawer type="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}>
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
              {sidebar}
            </MenuList>
          </Drawer>

      </div>
    );
  }
}

Sidebar.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object,
}

export default withStyles(styles)(Sidebar);
