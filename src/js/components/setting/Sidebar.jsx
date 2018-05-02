import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import { MenuList, MenuItem } from 'material-ui/Menu';
import { ListItemText, ListItemIcon } from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Book from 'material-ui-icons/Book';
import QuestionAnswer from 'material-ui-icons/QuestionAnswer';
import Favorite from 'material-ui-icons/Favorite';
import Notifications from 'material-ui-icons/Notifications';

import LinkContainer from '../utils/LinkContainer';
import AdminSidebarMenuList from '../utils/AdminSidebarMenuList';

const styles = theme => ({
  // drawerHeader: theme.mixins.toolbar,
  "drawerPaper": {
    width: 260,
    position: 'fixed',
    marginTop: theme.spacing.unit * 8,
  },
});

class Sidebar extends Component {
  render() {
    const { classes, user, match } = this.props;
    const role = _.isEmpty(user) ? '' : user.role;

    return (
      <div>
          <Drawer type="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}>
            <MenuList>
              <LinkContainer to="/setting/account">
                <MenuItem selected={match.path === "/setting/account"} >
                  <ListItemIcon>
                    <AccountCircle />
                  </ListItemIcon>
                  <ListItemText primary="Account" classes={match.path === "/setting/account" ? { primary: classes.selected } : {}} />
                </MenuItem>
              </LinkContainer>

              <LinkContainer to="/setting/review">
                <MenuItem selected={match.path === "/setting/review"}>
                  <ListItemIcon>
                    <QuestionAnswer />
                  </ListItemIcon>
                  <ListItemText primary="Reviews" classes={match.path === "/setting/review" ? { primary: classes.selected } : {}} />
                </MenuItem>
              </LinkContainer>
              <LinkContainer to="/setting/favor">
                <MenuItem selected={match.path === "/setting/favor"}>
                  <ListItemIcon>
                    <Favorite />
                  </ListItemIcon>
                  <ListItemText primary="Favor" classes={match.path === "/setting/favor" ? { primary: classes.selected } : {}} />
                </MenuItem>
              </LinkContainer>
              <LinkContainer to="/setting/notification">
                <MenuItem selected={match.path === "/setting/notification"}>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText primary="Notifications" classes={match.path === "/setting/notification" ? { primary: classes.selected } : {}} />
                </MenuItem>
              </LinkContainer>
              <LinkContainer to="/setting/story">
                <MenuItem selected={match.path === "/setting/story"}>
                  <ListItemIcon>
                    <Book />
                  </ListItemIcon>
                  <ListItemText primary="Story" classes={match.path === "/setting/story" ? { primary: classes.selected } : {}} />
                </MenuItem>
              </LinkContainer>
            </MenuList>
            {_.isUndefined(role) ? '' : (<AdminSidebarMenuList admin={user} match={match} />)}
          </Drawer>
      </div>
    );
  }
}

Sidebar.propTypes = {
  "match": PropTypes.object.isRequired,
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object,
}

export default withStyles(styles)(Sidebar);
