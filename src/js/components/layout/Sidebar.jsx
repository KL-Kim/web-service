import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Drawer from '@material-ui/core/Drawer';

// Material UI Icons
import AccountCircle from '@material-ui/icons/AccountCircle';
import RateReview from '@material-ui/icons/RateReview';
import Book from '@material-ui/icons/Book';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';
import Favorite from '@material-ui/icons/Favorite';
import Notifications from '@material-ui/icons/Notifications';

import LinkContainer from '../utils/LinkContainer';

const styles = theme => ({
  // drawerHeader: theme.mixins.toolbar,
  "drawerPaper": {
    width: 260,
    position: 'fixed',
    marginTop: theme.spacing.unit * 8,
  },
  'selected': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  }
});

class Sidebar extends Component {
  render() {
    const { classes, user, match } = this.props;
    const role = _.isEmpty(user) ? '' : user.role;

    return (
      <div>
          <Drawer variant="permanent"
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
                    <RateReview />
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

              <LinkContainer to="/setting/comment">
                <MenuItem selected={match.path === "/setting/comment"}>
                  <ListItemIcon>
                    <QuestionAnswer />
                  </ListItemIcon>
                  <ListItemText primary="Comments" classes={match.path === "/setting/comment" ? { primary: classes.selected } : {}} />
                </MenuItem>
              </LinkContainer>

              {
                (role === 'writer')
                  ? (<LinkContainer to="/setting/post">
                      <MenuItem selected={match.path === "/setting/post"}>
                        <ListItemIcon>
                          <Book />
                        </ListItemIcon>
                        <ListItemText primary="Posts" classes={match.path === "/setting/post" ? { primary: classes.selected } : {}} />
                      </MenuItem>
                    </LinkContainer>)
                  : ''
              }
            </MenuList>
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
