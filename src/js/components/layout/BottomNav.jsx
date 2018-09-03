import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

// Material UI Components
import { withStyles } from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Hidden from '@material-ui/core/Hidden';

// Material UI Icons
import Home from '@material-ui/icons/Home';
import Explore from '@material-ui/icons/Explore';
import Search from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SettingsApplications from '@material-ui/icons/SettingsApplications';

// Custom Components
import LinkContainer from 'js/components/utils/LinkContainer';

const styles = (theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: -5,
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
      index: null,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = (e, value) => {
    this.setState({ index: value });
  };

  componentDidMount() {
    switch (this.props.match.path) {
      case '/':
        this.setState({
          index: 0,
        });
        break;

      case '/explore':
        this.setState({
          index: 1,
        });
        break;
      
      case '/search':
        this.setState({
          index: 2,
        });
        break;

      default:
        this.setState({
          index: null,
        });
        break;
    }
  }

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
            <LinkContainer to="/">
              <BottomNavigationAction icon={<Home />} />
            </LinkContainer>
            
            <LinkContainer to="/explore">
              <BottomNavigationAction icon={<Explore />} />
            </LinkContainer>

            <LinkContainer to="/search">
              <BottomNavigationAction icon={<Search />} />
            </LinkContainer>
            
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
