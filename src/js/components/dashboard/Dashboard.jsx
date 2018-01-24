import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';

import DashboardHeader from './DashboardHeader';
import DashboardFooter from './DashboardFooter';
import Sidebar from './Sidebar';

const styles = (theme) => ({
  root: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  content: {
    width: '100%',
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    minHeight: `calc(100vh - 112px)`,
    marginTop: 64,
    marginLeft: 260,
    marginBottom: 48
  },
});

class Dashboard extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <DashboardHeader />
        <Sidebar />
        <div className={classes.appFrame}>
          <main className={classes.content}>
            {this.props.children}
            <DashboardFooter />
          </main>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Dashboard);
