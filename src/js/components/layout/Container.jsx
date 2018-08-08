import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// Custom Components
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import Alert from '../utils/Alert';

// For dev
import DevTools from './DevTools';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    maxWidth: 976,
    height: '100%',
    width: '100%',
    margin: 'auto',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    marginTop: theme.spacing.unit * 8,
    marginBottom: theme.spacing.unit * 8,
    paddingTop: theme.spacing.unit * 4,

    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing.unit * 7,
      marginBottom: theme.spacing.unit * 7,
      paddingTop: theme.spacing.unit * 2,
    }
  },
});

class Container extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Header position={"fixed"} />
        <main className={classes.appFrame}>
          {this.props.children}
        </main>
        <BottomNav />
        <Footer />
        <DevTools />
        <Alert />
      </div>
    );
  }
}

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.element.isRequired,
};

export default withStyles(styles)(Container);
