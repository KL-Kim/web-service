import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';

import SettingBorder from './SettingBorder';

// Mock data
const notifications = {
  id: 1,
  uid: 1,
  isRead: true,
  category: 'story', // story, review, following
  content: 'Bla bla bla'
};

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class ChangePasswordPage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <SettingBorder>
        <Grid container className={classes.root} spacing={16} justify="center" alignItems="flex-start">
          <Grid item xs={12}>
            <Typography type="display3" gutterBottom>
              Notifications
            </Typography>
            <Paper className={classes.paper}>
              <List>
                <ListItem className={classes.listItem}>
                  <Checkbox tabIndex={-1} disableRipple />
                  <ListItemText primary={notifications.content} />
                  <ListItemSecondaryAction>
                    <Button>Hide</Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem className={classes.listItem}>
                  <Checkbox checked={notifications.isRead} tabIndex={-1} disableRipple />
                  <ListItemText primary={notifications.content} />
                  <ListItemSecondaryAction>
                    <Button>Hide</Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </SettingBorder>
    );
  }
}

export default withStyles(styles)(ChangePasswordPage);
