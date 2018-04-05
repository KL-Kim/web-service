import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import { MenuList, MenuItem } from 'material-ui/Menu';
import { ListItemText, ListItemIcon } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Group from 'material-ui-icons/Group';
import Business from 'material-ui-icons/Business';
import Restaurant from 'material-ui-icons/Restaurant';
import Loyalty from 'material-ui-icons/Loyalty';
import QuestionAnswer from 'material-ui-icons/QuestionAnswer';
import Book from 'material-ui-icons/Book';

import LinkContainer from './LinkContainer';

const styles = theme => ({
  'selected': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  }
});

class AdminSidebarMenuList extends Component {
  render() {
    const { classes, admin, match } = this.props;
    const role = _.isEmpty(admin) ? '' : admin.role;

    return (
      <MenuList>
        <Divider />
        {
          (role === 'admin' || role === 'god')
            ? (
                <LinkContainer to={{
                    pathname: "/admin/setting/users",
                    state: {
                      admin: admin
                    },
                  }}
                >
                  <MenuItem selected={match.path === "/admin/setting/users"}>
                    <ListItemIcon>
                      <Group />
                    </ListItemIcon>
                    <ListItemText primary="Users" classes={match.path === "/admin/setting/users" ? { primary: classes.selected } : {}} />
                  </MenuItem>
                </LinkContainer>
              )
            : ''
        }
        <LinkContainer to={{
            pathname: "/admin/setting/business",
            state: {
              admin: admin
            },
          }}
        >
          <MenuItem selected={match.path === "/admin/setting/business"}>
            <ListItemIcon>
              <Business />
            </ListItemIcon>
            <ListItemText primary="Business" classes={match.path === "/admin/setting/business" ? { primary: classes.selected } : {}} />
          </MenuItem>
        </LinkContainer>

        <LinkContainer to={{
            pathname: "/admin/setting/category",
            state: {
              admin: admin
            },
          }}
        >
          <MenuItem selected={match.path === "/admin/setting/category"}>
            <ListItemIcon>
              <Restaurant />
            </ListItemIcon>
            <ListItemText primary="Category" classes={match.path === "/admin/setting/category" ? { primary: classes.selected } : {}} />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to={{
            pathname: "/admin/setting/tag",
            state: {
              admin: admin
            },
          }}
        >
          <MenuItem selected={match.path === "/admin/setting/tag"}>
            <ListItemIcon>
              <Loyalty />
            </ListItemIcon>
            <ListItemText primary="Tag" classes={match.path === "/admin/setting/tag" ? { primary: classes.selected } : {}} />
          </MenuItem>
        </LinkContainer>

        <LinkContainer to="/admin/setting/reviews">
          <MenuItem selected={match.path === "/admin/setting/reviews"}>
            <ListItemIcon>
              <QuestionAnswer />
            </ListItemIcon>
            <ListItemText primary="Reviews" classes={match.path === "/admin/setting/reviews" ? { primary: classes.selected } : {}} />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to="/admin/setting/stories">
          <MenuItem selected={match.path === "/admin/setting/stories"}>
            <ListItemIcon>
              <Book />
            </ListItemIcon>
            <ListItemText primary="Stories" classes={match.path === "/admin/setting/stories" ? { primary: classes.selected } : {}} />
          </MenuItem>
        </LinkContainer>
      </MenuList>
    );
  }
}

AdminSidebarMenuList.propTypes = {
  classes: PropTypes.object.isRequired,
  admin: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

export default withStyles(styles)(AdminSidebarMenuList);
