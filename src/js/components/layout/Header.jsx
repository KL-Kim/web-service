import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Img from 'react-image';

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
import Popover from '@material-ui/core/Popover';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';

// Material UI Icons
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Notifications from '@material-ui/icons/Notifications';
import Search from '@material-ui/icons/Search';
import FiberNew from '@material-ui/icons/FiberNew';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Restaurant from '@material-ui/icons/Restaurant';
import LocalBar from '@material-ui/icons/LocalBar';
import LocalPlay from '@material-ui/icons/LocalPlay';
import LocalHospital from '@material-ui/icons/LocalHospital';
import Spa from '@material-ui/icons/Spa';
import LocalMall from '@material-ui/icons/LocalMall';

// Custom Components
import LinkContainer from '../utils/LinkContainer';
import Avatar from '../utils/Avatar';
import LoginDialog from '../utils/LoginDialog';
import MessageContent from '../utils/MessageContent';
import ProperName from '../utils/ProperName';
import getElapsedTime from '../../helpers/ElapsedTime';

// Actions
import { logout } from '../../actions/user.actions';
import { openLoginDialog } from '../../actions/app.actions';
import { getNotification } from '../../actions/notification.actions';

import Logo from '../../../img/logo.png';

const styles = theme => ({
  "root": {
    flexGrow: 1
  },
  "appBar": {
    zIndex: theme.zIndex.drawer + 1,
    "backgroundColor": 'gold'
  },
  "flex": {
    "flex": 1,

  },
  "logo": {
    "width": 150,
    "height": '100%',
  },
  "float": {
    float: 'left',
  },
  "button": {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  "drawerPaper": {
    "width": 300,
  },
  "account": {
    "margin": "0 auto",
    "marginTop": theme.spacing.unit * 3,
    "marginBottom": theme.spacing.unit * 3,
    "textAlign": "center",
  },
  "avatarName": {
    "marginTop": theme.spacing.unit,
  },
  "bootstrapRoot": {
    padding: 0,
    backgroundColor: theme.palette.common.white,
    borderRadius: 4,
    border: '1px solid #ced4da',
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  "bootstrapInput": {
    fontSize: 16,
    padding: '10px 12px',
    width: 'calc(100% - 24px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
  },
  "popoverContainer": {
    width: 500,
    height: 400,
    padding: theme.spacing.unit,
  },
  "menuContainer": {
    width: 150,
  },
  "rightIcon": {
    marginLeft: theme.spacing.unit,
  },
  "login": {

  },
});

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "drawerOpen": false,
      "search": '',
      "notificationPopoverOpen": false,
      "notificationsList": [],
      "categoriesPopoverOpen": false,
    };

    this.handleDrawerToggle = this.handleDrawerToggle.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleNotificationPopoverOpen = this.handleNotificationPopoverOpen.bind(this);
    this.handleNotificationPopoverClose = this.handleNotificationPopoverClose.bind(this);
    this.handleClickListItem = this.handleClickListItem.bind(this);
    this.handleCategoriesMenuOpen = this.handleCategoriesMenuOpen.bind(this);
    this.handleCategoriesMenuClose = this.handleCategoriesMenuClose.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleDrawerToggle() {
    this.setState({
      "drawerOpen": !this.state.drawerOpen
    });
  }

  handleNotificationPopoverOpen() {
    this.props.getNotification({
      uid: this.props.user._id,
      unRead: true,
      limit: 10,
    })
    .then(response => {
      if (response) {
        this.setState({
          notificationPopoverOpen: true,
          notificationsList: response.list.slice(),
        });
      }
    });
  }

  handleNotificationPopoverClose() {
    this.setState({
      notificationPopoverOpen: false,
    });
  }

  handleLogout() {
    this.props.logout()
      .then(response => {
        if (response) {
          this.setState({
            drawerOpen: false,
          });
        }

        this.props.history.push('/');
      });
  }

  handleSearch(e) {
    e.preventDefault();

    this.props.history.push("/search?s=" + this.state.search);
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

  handleCategoriesMenuOpen() {
    this.setState({
      "categoriesPopoverOpen": true
    });
  }

  handleCategoriesMenuClose() {
    this.setState({
      "categoriesPopoverOpen": false
    })
  }

  render() {
    const { classes, user, isLoggedIn, updatedAt, newNotificationCount, categories } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position={this.props.position} className={classes.appBar}>
          <Toolbar>
            <div className={classes.flex}>
              <Grid container alignItems="center">
                <Grid item>
                  <div style={{
                      marginRight: 40,
                    }}
                  >
                    <Link to="/">
                      <Img src={Logo} className={classes.logo} />
                    </Link>
                  </div>

                </Grid>
                <Grid item>
                  <div style={{
                      width: 400,
                    }}
                  >
                  <form onSubmit={this.handleSearch} >
                    <FormControl fullWidth>
                      <Input
                        classes={{
                          root: classes.bootstrapRoot,
                          input: classes.bootstrapInput,
                        }}
                        id="search-bar"
                        type="text"
                        name="search"
                        placeholder="Search"
                        disableUnderline
                        onChange={this.handleChange}
                        onKeyPress={this.handleKeyPress}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              disableRipple
                              aria-label="Toggle password visibility"
                              onClick={this.handleSearch}
                            >
                              <Search />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </form>
                  </div>
                </Grid>
              </Grid>
            </div>

            <Button
              size="small"
              className={classes.button}
              onClick={this.handleCategoriesMenuOpen}
              buttonRef={node => {
                this.categoriesAnchorEl = node;
              }}
            >
              Business
              {
                this.state.categoriesPopoverOpen
                  ? <ExpandLess className={classes.rightIcon} />
                  : <ExpandMore className={classes.rightIcon} />
              }
            </Button>

            <LinkContainer to="/blog">
              <Button
                size="small"
                className={classes.button}
              >
                Articles
              </Button>
            </LinkContainer>

            <div className={classes.login}>
              {
                isLoggedIn
                  ? <IconButton
                      className={classes.button}
                      onClick={this.handleNotificationPopoverOpen}
                      buttonRef={node => {
                        this.notificationAnchorEl = node;
                      }}
                    >
                      <Notifications />
                    </IconButton>
                  : ''
              }
              {
                isLoggedIn
                  ? <Button
                      className={classes.button}
                      onClick={this.handleDrawerToggle}
                    >
                      <Avatar user={user} updatedAt={updatedAt} />
                    </Button>
                  : <Button
                      size="small"
                      className={classes.button}
                      onClick={this.props.openLoginDialog}
                      >
                        Sign in
                      </Button>
              }
            </div>
          </Toolbar>
        </AppBar>

        <div>
          {
            isLoggedIn
              ? (<Drawer
                  anchor="right"
                  open={this.state.drawerOpen}
                  onClose={this.handleDrawerToggle}
                  variant="temporary"
                  classes={{paper: classes.drawerPaper}}
                >
                  <div className={classes.account}>
                    <Avatar user={user} type="MEDIUM" updatedAt={updatedAt} />
                    <Typography variant="body1" className={classes.avatarName}>
                      <ProperName user={user} />
                    </Typography>
                  </div>

                  <Divider />

                  <MenuList>
                    <LinkContainer to="/setting/account">
                      <MenuItem>
                        <ListItemIcon>
                          <AccountCircle />
                        </ListItemIcon>
                        <ListItemText primary="account" />
                      </MenuItem>
                    </LinkContainer>
                    <MenuItem onClick={this.handleLogout}>
                      <ListItemIcon>
                        <ExitToApp />
                      </ListItemIcon>
                      <ListItemText primary="logout" onClick={this.handleLogout}/>
                    </MenuItem>
                  </MenuList>
                </Drawer>)
              : <LoginDialog />
          }

          <Popover
            open={this.state.notificationPopoverOpen}
            anchorEl={this.notificationAnchorEl}
            onClose={this.handleNotificationPopoverClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <div className={classes.popoverContainer}>
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="body1">{newNotificationCount} new notifications</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Link to="/setting/notification">
                    <Typography variant="button" align="right">View all</Typography>
                  </Link>
                </Grid>
              </Grid>
              <Divider />
              <List>
                {
                  _.isEmpty(this.state.notificationsList)
                    ? <Typography variant="body1" align="center">No more new notifications</Typography>
                    : this.state.notificationsList.map((item, index) => (
                      <ListItem key={index} divider button onClick={this.handleClickListItem(item)}>
                        <ListItemIcon>
                          <FiberNew color="secondary"/>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <MessageContent
                              sender={item.senderId}
                              type={item.type}
                              event={item.event}
                              subjectTitle={item.subjectTitle}
                              subjectContent={item.subjectContent}
                              subjectUrl={item.subjectUrl}
                              commentId={item.commentId}
                              commentContent={item.commentContent}
                              content={item.content}
                            />
                          }
                          secondary={getElapsedTime(item.createdAt)}
                        />
                      </ListItem>
                    ))
                }
                {
                  (newNotificationCount <= 10) ? ''
                    : <ListItem button>
                      <Link to="/setting/notification">
                        <ListItemText primary={"You have " + (newNotificationCount - 10)  + " more new notifications"} />
                      </Link>
                    </ListItem>
                }
              </List>
            </div>
          </Popover>

          <Popover
            open={this.state.categoriesPopoverOpen}
            anchorEl={this.categoriesAnchorEl}
            onClose={this.handleCategoriesMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <div className={classes.menuContainer}>
              <MenuList role="menu">
                <Link to={"/business/category/restaurant"}>
                  <MenuItem>
                    <ListItemIcon>
                      <Restaurant />
                    </ListItemIcon>
                    <ListItemText primary="맛집" />
                  </MenuItem>
                </Link>
                <Link to={"/business/category/nightbar"}>
                  <MenuItem>
                    <ListItemIcon>
                      <LocalBar />
                    </ListItemIcon>
                    <ListItemText primary="호프" />
                  </MenuItem>
                </Link>
                <Link to={"/business/category/ktv"}>
                  <MenuItem>
                    <ListItemIcon>
                      <LocalPlay />
                    </ListItemIcon>
                    <ListItemText primary="노래방" />
                  </MenuItem>
                </Link>
                <Link to={"/business/category/hospital"}>
                  <MenuItem>
                    <ListItemIcon>
                      <LocalHospital />
                    </ListItemIcon>
                    <ListItemText primary="병원" />
                  </MenuItem>
                </Link>
                <Link to={"/business/category/massage"}>
                  <MenuItem>
                    <ListItemIcon>
                      <Spa />
                    </ListItemIcon>
                    <ListItemText primary="마사지" />
                  </MenuItem>
                </Link>
                <Link to={"/business/category/shopping_mall"}>
                  <MenuItem>
                    <ListItemIcon>
                      <LocalMall />
                    </ListItemIcon>
                    <ListItemText primary="쇼핑몰" />
                  </MenuItem>
                </Link>
              </MenuList>
            </div>
          </Popover>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  position: PropTypes.string.isRequired,
  user: PropTypes.object,
  updatedAt: PropTypes.number,
  isLoggedIn: PropTypes.bool.isRequired,
  newNotificationCount: PropTypes.number.isRequired,
  logout: PropTypes.func.isRequired,
  getNotification: PropTypes.func.isRequired,
  openLoginDialog: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "updatedAt": state.userReducer.updatedAt,
    "newNotificationCount": state.notificationReducer.unreadCount,
    "categories": state.categoryReducer.categoriesList,
  };
};

export default withRouter(connect(mapStateToProps, {
  logout,
  getNotification,
  openLoginDialog
})(withStyles(styles)(Header)));
