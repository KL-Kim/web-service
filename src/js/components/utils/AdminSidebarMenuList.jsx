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

    if (_.isEmpty(role) || role === 'regular') {
      return '';
    }

    return (
      <MenuList>
        <Divider />
        {
          (role === 'admin' || role === 'god')
            ? (
                <LinkContainer to={{
                    pathname: "/admin/users",
                    state: {
                      admin: admin
                    },
                  }}
                >
                  <MenuItem selected={match.path === "/admin/users"}>
                    <ListItemIcon>
                      <Group />
                    </ListItemIcon>
                    <ListItemText primary="Users" classes={match.path === "/admin/users" ? { primary: classes.selected } : {}} />
                  </MenuItem>
                </LinkContainer>
              )
            : ''
        }
        <LinkContainer to={{
            pathname: "/admin/business",
            state: {
              admin: admin
            },
          }}
        >
          <MenuItem selected={match.path === "/admin/business"}>
            <ListItemIcon>
              <Business />
            </ListItemIcon>
            <ListItemText primary="Business" classes={match.path === "/admin/business" ? { primary: classes.selected } : {}} />
          </MenuItem>
        </LinkContainer>

        <LinkContainer to={{
            pathname: "/admin/category",
            state: {
              admin: admin
            },
          }}
        >
          <MenuItem selected={match.path === "/admin/category"}>
            <ListItemIcon>
              <Restaurant />
            </ListItemIcon>
            <ListItemText primary="Category" classes={match.path === "/admin/category" ? { primary: classes.selected } : {}} />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to={{
            pathname: "/admin/tag",
            state: {
              admin: admin
            },
          }}
        >
          <MenuItem selected={match.path === "/admin/tag"}>
            <ListItemIcon>
              <Loyalty />
            </ListItemIcon>
            <ListItemText primary="Tag" classes={match.path === "/admin/tag" ? { primary: classes.selected } : {}} />
          </MenuItem>
        </LinkContainer>

        <LinkContainer to={{
            pathname: "/admin/reviews",
            state: {
              admin: admin
            },
          }}>
          <MenuItem selected={match.path === "/admin/reviews"}>
            <ListItemIcon>
              <QuestionAnswer />
            </ListItemIcon>
            <ListItemText primary="Reviews" classes={match.path === "/admin/reviews" ? { primary: classes.selected } : {}} />
          </MenuItem>
        </LinkContainer>
        <LinkContainer to={{
            pathname: "/admin/blog",
            state: {
              admin: admin
            },
          }}>
          <MenuItem selected={match.path === "/admin/blog"}>
            <ListItemIcon>
              <Book />
            </ListItemIcon>
            <ListItemText primary="Blog" classes={match.path === "/admin/blog" ? { primary: classes.selected } : {}} />
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
