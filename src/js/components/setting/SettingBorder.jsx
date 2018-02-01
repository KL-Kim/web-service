import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';

import SettingHeader from './SettingHeader';
import SettingFooter from './SettingFooter';
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

class SettingBorder extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <SettingHeader />
        <Sidebar />
        <div className={classes.appFrame}>
          <main className={classes.content}>
            {this.props.children}
            <SettingFooter />
          </main>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(SettingBorder);
