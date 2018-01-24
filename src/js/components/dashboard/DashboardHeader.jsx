import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const styles = theme => ({
  appBar: {
    position: 'fixed',
    width: '100%',
    zIndex: theme.zIndex.drawer + 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

class Header extends Component {
  render() {
    const { classes } = this.props;
    return (
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography type="title" color="inherit" align="left" className={classes.flex}>
            iKoreaTown
          </Typography>
          <NavLink to="/"><Button color="contrast">Home</Button></NavLink>
          <NavLink to="/business"><Button color="contrast">Business</Button></NavLink>
          <NavLink to="/dashboard/account"><Button color="contrast">profile</Button></NavLink>
          <NavLink to="/signin"><Button color="contrast">Sign in</Button></NavLink>
        </Toolbar>
      </AppBar>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.userReducer.user,
    isFetching: state.userReducer.isFetching,
    isLoggedIn: state.userReducer.isLoggedIn,
  };
};

export default withStyles(styles)(connect(mapStateToProps, {})(Header));
