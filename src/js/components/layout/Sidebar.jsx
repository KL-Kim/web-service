import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

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

const styles = theme => ({
  "drawerPaper": {
    width: 260,
    marginTop: theme.spacing.unit * 8,
  },
  'selected': {
    color: theme.palette.primary.main,
  }
});

class Sidebar extends Component {
  render() {
    const { classes, match } = this.props;

    return (
      <aside>
        <Drawer variant="persistent"
          open
          classes={{
            paper: classes.drawerPaper
          }}>
          <MenuList>
            <Link to="/setting/account">
              <MenuItem selected={match.path === "/setting/account"} >
                <ListItemIcon color={match.path === "/setting/account" ? "primary" : 'inherit'}>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText primary="Account" classes={match.path === "/setting/account" ? { primary: classes.selected } : {}} />
              </MenuItem>
            </Link>

            <Link to="/setting/notification">
              <MenuItem selected={match.path === "/setting/notification"}>
                <ListItemIcon color={match.path === "/setting/notification" ? "primary" : 'inherit'}>
                  <Notifications />
                </ListItemIcon>
                <ListItemText primary="Notifications" classes={match.path === "/setting/notification" ? { primary: classes.selected } : {}} />
              </MenuItem>
            </Link>

            <Link to="/setting/favor">
              <MenuItem selected={match.path === "/setting/favor"}>
                <ListItemIcon color={match.path === "/setting/favor" ? "primary" : 'inherit'}>
                  <Favorite />
                </ListItemIcon>
                <ListItemText primary="Favor" classes={match.path === "/setting/favor" ? { primary: classes.selected } : {}} />
              </MenuItem>
            </Link>

            <Link to="/setting/review">
              <MenuItem selected={match.path === "/setting/review"}>
                <ListItemIcon color={match.path === "/setting/review" ? "primary" : 'inherit'}>
                  <RateReview />
                </ListItemIcon>
                <ListItemText primary="Reviews" classes={match.path === "/setting/review" ? { primary: classes.selected } : {}} />
              </MenuItem>
            </Link>

            <Link to="/setting/comment">
              <MenuItem selected={match.path === "/setting/comment"}>
                <ListItemIcon color={match.path === "/setting/comment" ? "primary" : 'inherit'}>
                  <QuestionAnswer />
                </ListItemIcon>
                <ListItemText primary="Comments" classes={match.path === "/setting/comment" ? { primary: classes.selected } : {}} />
              </MenuItem>
            </Link>

            {
              this.props.role === 'writer'
                ? (<Link to="/setting/post">
                    <MenuItem selected={match.path === "/setting/post"}>
                      <ListItemIcon color={match.path === "/setting/post" ? "primary" : 'inherit'}>
                        <Book />
                      </ListItemIcon>
                      <ListItemText primary="Posts" classes={match.path === "/setting/post" ? { primary: classes.selected } : {}} />
                    </MenuItem>
                  </Link>)
                : null
            }
          </MenuList>
        </Drawer>
      </aside>
    );
  }
}

Sidebar.propTypes = {
  "match": PropTypes.object.isRequired,
  "classes": PropTypes.object.isRequired,
  "role": PropTypes.string,
}

export default withStyles(styles)(Sidebar);
