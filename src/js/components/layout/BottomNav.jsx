import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Material UI Components
import { withStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Hidden from '@material-ui/core/Hidden';

// Material UI Icons
import Home from '@material-ui/icons/Home';
import Business from '@material-ui/icons/Business';
import Explore from '@material-ui/icons/Explore';
import Search from '@material-ui/icons/Search';
import Notifications from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';

const styles = (theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

class BottomNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e, value) => {
    this.setState({ index: value });
  };

  render() {
    const { classes } = this.props;

    return (
      <Hidden smUp>
        <div className={classes.root}>
          <BottomNavigation
            showLabels
            value={this.state.index}
            onChange={this.handleChange}
          >
            <BottomNavigationAction label="Home" icon={<Home />} />
            <BottomNavigationAction label="Explore" icon={<Explore />} />
            <BottomNavigationAction label="Search" icon={<Search />} />
            <BottomNavigationAction label="Account" icon={<AccountCircle />} />
          </BottomNavigation>
        </div>
      </Hidden>
    );
  }
}

BottomNav.propTypes = {
  "classes": PropTypes.object.isRequired,
};

export default withStyles(styles)(BottomNav);
