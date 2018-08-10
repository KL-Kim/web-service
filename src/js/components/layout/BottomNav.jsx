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

// Custom Components
import LinkContainer from 'js/components/utils/LinkContainer';

const styles = (theme) => ({
  root: {
    width: '100%',
    position: 'fixed',
    bottom: -1,
    left: 0,
    right: 0,
    zIndex: 1200,
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
      
      case '/setting/*':
        this.setState({
          index: 3,
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
            <BottomNavigationAction icon={<LinkContainer to="/"><Home /></LinkContainer>} />
            <BottomNavigationAction icon={<LinkContainer to="/explore"><Explore /></LinkContainer>} />
            <BottomNavigationAction icon={<LinkContainer to="/search"><Search /></LinkContainer>} />
            <BottomNavigationAction icon={<LinkContainer to="/setting/account"><AccountCircle /></LinkContainer>} />
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
