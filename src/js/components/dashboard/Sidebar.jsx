import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { MenuList, MenuItem } from 'material-ui/Menu';
import { ListItemText } from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import Divider from 'material-ui/Divider';

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
          <LinkContainer to="/dashboard/account">
            <MenuItem>
              <ListItemText primary="Account" />
            </MenuItem>
          </LinkContainer>
          <LinkContainer to="/dashboard/story">
            <MenuItem>
              <ListItemText primary="Story" />
            </MenuItem>
          </LinkContainer>
          <LinkContainer to="/dashboard/favor">
            <MenuItem>
              <ListItemText primary="Favor" />
            </MenuItem>
          </LinkContainer>
          <LinkContainer to="/dashboard/review">
            <MenuItem>
              <ListItemText primary="Reviews" />
            </MenuItem>
          </LinkContainer>
          <LinkContainer to="/dashboard/password">
            <MenuItem>
              <ListItemText primary="Change password" />
            </MenuItem>
          </LinkContainer>
          <LinkContainer to="/dashboard/photo">
            <MenuItem>
              <ListItemText primary="Photo" />
            </MenuItem>
          </LinkContainer>
          <Divider />
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
