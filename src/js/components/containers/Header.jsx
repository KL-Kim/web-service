import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import AccountCircle from 'material-ui-icons/AccountCircle';

import LinkContainer from '../utils/LinkContainer';

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
      <AppBar position="static">
        <Toolbar>
          <Typography type="title" color="inherit" align="left" className={classes.flex}>
            <LinkContainer to="/"><Button color="inherit">iKoreaTown</Button></LinkContainer>
          </Typography>
          <LinkContainer to="/business">
            <Button color="inherit">Business</Button>
          </LinkContainer>
          <LinkContainer to="/story"><Button color="inherit">Story</Button></LinkContainer>
          <LinkContainer to="/setting/account"><Button color="inherit">profile</Button></LinkContainer>
          <LinkContainer to="/signin"><Button color="inherit"><AccountCircle /></Button></LinkContainer>
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.userReducer.user,
    isFetching: state.userReducer.isFetching,
    isLoggedIn: state.userReducer.isLoggedIn,
  };
};

export default withStyles(styles)(connect(mapStateToProps, {})(Header));
