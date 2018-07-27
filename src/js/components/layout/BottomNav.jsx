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
import Business from '@material-ui/icons/Business';
import Explore from '@material-ui/icons/Explore';
import Search from '@material-ui/icons/Search';
import Notifications from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';

// Custom Components
import LinkContainer from 'js/components/utils/LinkContainer';

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
          index: 3,
        });
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
            <BottomNavigationAction label="Home" icon={<LinkContainer to="/"><Home /></LinkContainer>} />
            <BottomNavigationAction label="Explore" icon={<LinkContainer to="/explore"><Explore /></LinkContainer>} />
            <BottomNavigationAction label="Search" icon={<LinkContainer to="/search"><Search /></LinkContainer>} />
            <BottomNavigationAction label="Account" icon={<LinkContainer to="/setting/account"><AccountCircle /></LinkContainer>} />
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
