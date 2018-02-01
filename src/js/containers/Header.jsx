import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import AccountCircle from 'material-ui-icons/AccountCircle';

const styles = theme => ({
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
      <AppBar className={classes.appBar} position="static">
        <Toolbar>
          <Typography type="title" color="inherit" align="left" className={classes.flex}>
            <NavLink to="/"><Button color="contrast">iKoreaTown</Button></NavLink>
          </Typography>
          <NavLink to="/business">
            <Button color="contrast">Business</Button>
          </NavLink>
          <NavLink to="/story"><Button color="contrast">Story</Button></NavLink>
          <NavLink to="/setting/account"><Button color="contrast">profile</Button></NavLink>
          <NavLink to="/signin"><Button color="contrast"><AccountCircle /></Button></NavLink>
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
