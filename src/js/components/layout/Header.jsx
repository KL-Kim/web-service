import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Img from 'react-image';
import qs from 'querystring';
import classNames from 'classnames';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Hidden from '@material-ui/core/Hidden';

// Material UI Icons
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Notifications from '@material-ui/icons/Notifications';
import Search from '@material-ui/icons/Search';
import Favorite from '@material-ui/icons/Favorite';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';
import RateReview from '@material-ui/icons/RateReview';
import Explore from '@material-ui/icons/Explore';
import SettingsApplications from '@material-ui/icons/SettingsApplications';

// Custom Components
import LinkContainer from 'js/components/utils/LinkContainer';
import LoginDialog from 'js/components/dialogs/LoginDialog';
import Avatar from 'js/components/utils/Avatar';
import ProperName from 'js/components/utils/ProperName';


// Actions
import { openLoginDialog } from 'js/actions/app.actions';
import { logout } from 'js/actions/user.actions';
import { getUnreadCount } from 'js/actions/notification.actions';

import Logo from 'img/logo.png';

const styles = theme => ({
  "root": {
    flexGrow: 1,
  },
  "appBar": {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.primary.main,
  },
  "transparentAppBar": {
    backgroundColor: 'transparent',
    boxShadow: 'unset',
  },
  "toolbarWrapper": {
    width: '100%',
    maxWidth: 976,
    margin: 'auto',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit, 
  },
  "logo": {
    display: 'inline-block',
    margin: 0,
    height: '100%',
    color: 'white',
  },
  "button": {
    marginLeft: theme.spacing.unit * 2,
  },
  "account": {
    "margin": "auto",
    "marginTop": theme.spacing.unit * 3,
    "marginBottom": theme.spacing.unit * 3,
    "textAlign": "center",
  },
  "avatarName": {
    "marginTop": theme.spacing.unit,
  },
  'selected': {
    color: theme.palette.primary.main,
  }
});

class Header extends Component {
  constructor(props) {
    super(props);


    this.state = {
      "drawerOpen": false,
      "loginDialogOpen": false,
    };

    this.handleLogout = this.handleLogout.bind(this);
    this.handleLoginDialogOpen = this.handleLoginDialogOpen.bind(this);
    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleClickListItem = this.handleClickListItem.bind(this);
  }

  handleDrawerToggle() {
    this.setState({
      "drawerOpen": !this.state.drawerOpen
    });
  }

  handleLoginDialogOpen() {
    this.props.openLoginDialog();
  }

  handleLogout() {
    this.props.logout()
      .then(()=> {
        this.setState({
          drawerOpen: false,
        });
        this.props.history.push('/');
      });
  }

  handleClickListItem = item => e => {
    switch (item.type) {
      case "BUSINESS":
        this.props.history.push('/business/s/' + item.subjectUrl);
        break;

      case "REVIEW":
        this.props.history.push('/business/s/' + item.subjectUrl, { reviewId: item.commentId });
        break;

      case "COMMENT":
        this.props.history.push('/post/s/' + item.subjectUrl, { commentId: item.commentId });
        break;

      default:
        return ;
    }
  }

  render() {
    const { classes, user, isLoggedIn, updatedAt, newNotificationCount, categories, match } = this.props;

    return (
      <div className={classes.root}>
        <AppBar
          position={this.props.position}
          className={this.props.position === 'fixed' ? classes.appBar : classNames(classes.appBar, classes.transparentAppBar)}
        >
          <div className={classes.toolbarWrapper}>
            <Toolbar disableGutters>
              <div style={{ flex: 1 }}>
                <Link to="/">
                  {/* <Img src={Logo} className={classes.logo} />*/}
                  <Typography variant="title" color="inherit" className={classes.logo}>iKoreaTown | Nanjing</Typography>
                </Link>
              </div>

              <Hidden smDown>
                <LinkContainer to="/search">
                  <IconButton color="inherit" className={classes.button}>
                    <Search />
                  </IconButton>
                </LinkContainer>

                <LinkContainer to="/explore">
                  <IconButton color="inherit" className={classes.button}>
                    <Explore />
                  </IconButton>
                </LinkContainer>
              </Hidden>

              {
                isLoggedIn
                  ? <Button
                      className={classes.button}
                      onClick={this.handleDrawerToggle}
                    >
                      <Avatar user={user} updatedAt={updatedAt} />
                    </Button>
                    
                  : <IconButton 
                      color="inherit" 
                      className={classes.button} 
                      onClick={this.handleLoginDialogOpen}
                    >
                      <AccountCircle />
                    </IconButton>
              }
            </Toolbar>
          </div>
        </AppBar>

        <div>
          {
            isLoggedIn
              ? <Drawer
                  anchor="right"
                  open={this.state.drawerOpen}
                  onClose={this.handleDrawerToggle}
                  variant="temporary"
                >
                  <div style={{ width: 230 }}>
                    <div className={classes.account}>
                      <Avatar user={user} type="MEDIUM" updatedAt={updatedAt} />
                      <Typography variant="body1" className={classes.avatarName}>
                        <ProperName user={user} />
                      </Typography>
                    </div>

                    <Divider />

                    <MenuList>
                      <Link to="/setting/notification">
                        <MenuItem selected={match.path === "/setting/notification"}>
                          <ListItemIcon color={match.path === "/setting/notification" ? "primary" : 'inherit'}>
                            <Notifications />
                          </ListItemIcon>
                          <ListItemText classes={match.path === "/setting/notification" ? { primary: classes.selected } : {}}>
                            {
                              this.props.newNotificationCount > 0
                                ? this.props.newNotificationCount + " New"
                                : "Notifications"
                            }
                          </ListItemText>
                        </MenuItem>
                      </Link>
                    </MenuList>

                    <Divider />

                    <MenuList>
                       <Link to={"/profile/" + user.username}>
                        <MenuItem>
                          <ListItemIcon>
                            <AccountCircle />
                          </ListItemIcon>
                          <ListItemText primary="Profile" />
                        </MenuItem>
                      </Link>

                      <Link to="/setting/account">
                        <MenuItem selected={match.path === "/setting/account"} >
                          <ListItemIcon color={match.path === "/setting/account" ? "primary" : 'inherit'}>
                            <SettingsApplications />
                          </ListItemIcon>
                          <ListItemText primary="Account" classes={match.path === "/setting/account" ? { primary: classes.selected } : {}} />
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

                     
                     
                    </MenuList>

                    <Divider />

                    <MenuList>
                      <MenuItem onClick={this.handleLogout}>
                        <ListItemIcon>
                          <ExitToApp />
                        </ListItemIcon>
                        <ListItemText primary="Sign Out" />
                      </MenuItem>
                    </MenuList>
                  </div>
                </Drawer>
              : <LoginDialog />
          }
          
        </div>
      </div>
    );
  }
}

Header.defaultProps = {
  position: "fixed"
};

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  position: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  updatedAt: PropTypes.number,
  isLoggedIn: PropTypes.bool.isRequired,
  newNotificationCount: PropTypes.number.isRequired,
  logout: PropTypes.func.isRequired,
  openLoginDialog: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "isFetching": state.userReducer.isFetching,
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "updatedAt": state.userReducer.updatedAt,
    "newNotificationCount": state.notificationReducer.unreadCount,
    "categories": state.categoryReducer.categoriesList,
  };
};

export default withRouter(connect(mapStateToProps, {
  openLoginDialog,
  logout,
  getUnreadCount,
})(withStyles(styles)(Header)));
