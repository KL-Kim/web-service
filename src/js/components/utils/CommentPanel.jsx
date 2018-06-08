import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import ThumbUp from 'material-ui-icons/ThumbUp';
import ThumbDown from 'material-ui-icons/ThumbDown';
import IconButton from 'material-ui/IconButton';

import Avatar from './Avatar';
import ProperName from './ProperName';
import ElapsedTime from '../../helpers/ElapsedTime';

import image from '../../../css/ikt-icon.gif';

const styles = theme => ({
  "paper": {
    padding: theme.spacing.unit * 3,
  },
  "buttonContainer": {
    "display": "flex",
    "justifyContent": "flex-end",
  },
});

class CommentPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.paper}>
        <Grid container>
          <Grid item xs={2}>
            <Avatar user={this.props.user} type="SMALL" />
          </Grid>
          <Grid item xs={10}>
            <div>
              <span>
                <strong>
                  <ProperName user={this.props.user} />
                </strong>
              </span>
              <span> - {ElapsedTime(this.props.createdAt)}</span>
            </div>
            <Typography type="body1" gutterBottom>{this.props.status === 'NORMAL' ? this.props.content : 'This comment violated the policy of iKoreaTown'}</Typography>
            <Grid container alignItems="center">
              <Grid item xs={6}>
                <span>
                  <IconButton color="primary">
                    <ThumbUp />
                  </IconButton>
                  {this.props.upVote}
                </span>
                <span>
                  <IconButton>
                    <ThumbDown />
                  </IconButton>
                  {this.props.downVote}
                </span>
              </Grid>
              <Grid item xs={6}>
                <div className={classes.buttonContainer}>
                  <Button color="primary">
                    reply
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

CommentPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
}

export default withStyles(styles)(CommentPanel);
