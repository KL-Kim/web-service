import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

// Material UI Icons
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Notifications from '@material-ui/icons/Notifications';
import Search from '@material-ui/icons/Search';
import Favorite from '@material-ui/icons/Favorite';
import QuestionAnswer from '@material-ui/icons/QuestionAnswer';
import RateReview from '@material-ui/icons/RateReview';
import Explore from '@material-ui/icons/Explore';
import Settings from '@material-ui/icons/Settings';

// Custom Components
import LinkContainer from 'js/components/utils/LinkContainer';
import LoginDialog from 'js/components/dialogs/LoginDialog';
import Avatar from 'js/components/utils/Avatar';
import ProperName from 'js/components/utils/ProperName';

// Actions
import { openLoginDialog } from 'js/actions/app.actions';
import { logout } from 'js/actions/user.actions';
import { getUnreadCount } from 'js/actions/notification.actions';

const styles = theme => ({
  "root": {
    flexGrow: 1,
  },
  "appBar": {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: theme.palette.background.paper,
  },
  "toolbarWrapper": {
    width: '100%',
    maxWidth: 976,
    margin: 'auto',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit, 
    [theme.breakpoints.down('xs')]: {
      paddingLeft: theme.spacing.unit,
      paddingRight: theme.spacing.unit, 
    }
  },
  "logo": {
    display: 'inline-block',
    margin: 0,
    height: '100%',
    cursor: 'pointer',
    fontFamily: 'Arial',
    fontWeight: 800,
  },
  "button": {
    marginLeft: theme.spacing.unit * 2,
    [theme.breakpoints.down('xs')]: {
      marginLeft: theme.spacing.unit,
    }
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

  render() {
    const { classes, user, isLoggedIn, updatedAt, match } = this.props;

    return (
      <div className={classes.root}>
        <AppBar
          position='fixed'
          className={classes.appBar}
        >
          <div className={classes.toolbarWrapper}>
            <Toolbar disableGutters>
              <div style={{ flex: 1 }}>
                <LinkContainer to="/">
                  <Typography variant="title"  color="default" className={classes.logo}>
                    <span style={{ color: '#ff0000' }}>i</span>KoreaTown
                  </Typography>
                </LinkContainer>
              </div>

              <LinkContainer to="/search">
                <IconButton className={classes.button} color="default">
                  <Search />
                </IconButton>
              </LinkContainer>

              <LinkContainer to="/explore">
                <IconButton className={classes.button} color="default">
                  <Explore />
                </IconButton>
              </LinkContainer>

              { 
                this.props.isFetching
                  ? <IconButton
                      className={classes.button}
                    >
                      <CircularProgress size={24} />
                    </IconButton>
                  : this.props.isLoggedIn
                      ? <IconButton
                          className={classes.button}
                          onClick={this.handleDrawerToggle}
                        >
                          <Avatar user={user} updatedAt={updatedAt} />
                        </IconButton>
                      : <IconButton 
                          color='default'
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
                  variant="temporary"
                  open={this.state.drawerOpen}
                  onClose={this.handleDrawerToggle}
                >
                  <div style={{ width: 240, overflow: 'hidden' }}>
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
                          <ListItemIcon>
                            <Notifications color="secondary" />
                          </ListItemIcon>
                          <ListItemText classes={this.props.newNotificationCount > 0 ? { primary: classes.selected } : {}}>
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

                      <Link to="/setting/favor">
                        <MenuItem selected={match.path === "/setting/favor"}>
                          <ListItemIcon>
                            <Favorite />
                          </ListItemIcon>
                          <ListItemText primary="Favor" classes={match.path === "/setting/favor" ? { primary: classes.selected } : {}} />
                        </MenuItem>
                      </Link>

                      <Link to="/setting/review">
                        <MenuItem selected={match.path === "/setting/review"}>
                          <ListItemIcon>
                            <RateReview />
                          </ListItemIcon>
                          <ListItemText primary="Reviews" classes={match.path === "/setting/review" ? { primary: classes.selected } : {}} />
                        </MenuItem>
                      </Link>

                      <Link to="/setting/comment">
                        <MenuItem selected={match.path === "/setting/comment"}>
                          <ListItemIcon>
                            <QuestionAnswer />
                          </ListItemIcon>
                          <ListItemText primary="Comments" classes={match.path === "/setting/comment" ? { primary: classes.selected } : {}} />
                        </MenuItem>
                      </Link>

                      <Link to="/setting/account">
                        <MenuItem selected={match.path === "/setting/account"} >
                          <ListItemIcon>
                            <Settings />
                          </ListItemIcon>
                          <ListItemText primary="Setting" classes={match.path === "/setting/account" ? { primary: classes.selected } : {}} />
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

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  updatedAt: PropTypes.number,
  isLoggedIn: PropTypes.bool.isRequired,
  newNotificationCount: PropTypes.number.isRequired,
  logout: PropTypes.func.isRequired,
  openLoginDialog: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    "isFetching": state.userReducer.isFetching,
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "updatedAt": state.userReducer.updatedAt,
    "newNotificationCount": state.notificationReducer.unreadCount,
  };
};

export default withRouter(connect(mapStateToProps, {
  openLoginDialog,
  logout,
  getUnreadCount,
})(withStyles(styles)(Header)));
