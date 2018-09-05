import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// Material UI Components
import { withStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Hidden from '@material-ui/core/Hidden';

// Material UI Icons
import Home from '@material-ui/icons/Home';
import Explore from '@material-ui/icons/Explore';
import Search from '@material-ui/icons/Search';

// Custom Components
import LinkContainer from 'js/components/utils/LinkContainer';

const styles = (theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: theme.zIndex.appBar,
    borderTop: '1px solid #eee'
  },
});

class BottomNav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;

    return (
      <Hidden smUp>
        <div className={classes.root}>
          <BottomNavigation
            value={this.state.value}
            onChange={this.handleChange}
          >
            
              <BottomNavigationAction label="Home" value="" icon={<Home />} />
            
              <BottomNavigationAction label="Explore" value="explore" icon={<Explore />} />
            
              
            

            
              <BottomNavigationAction label="Search" value="search" icon={<Search />} />
            
              
           
            
          </BottomNavigation>
        </div>
      </Hidden>
    );
  }
}

BottomNav.propTypes = {
  "classes": PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(BottomNav));
