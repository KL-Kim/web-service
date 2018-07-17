import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Img from 'react-image';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

// Custom Components
import ProperName from './ProperName';
import ElapsedTime from 'js/helpers/ElapsedTime';

// Mock image
import image from 'img/background_1.jpg';

const styles = theme => ({
  "thumbnail": {
    width: '100%',
    borderRadius: "6px",
    boxShadow: theme.shadows[5]
  },
  "wrapper": {
    marginBottom: theme.spacing.unit * 2,
    width: 768,
    margin: 'auto',
  },
  "paper": {
    padding: theme.spacing.unit * 4,
    height: 300,
  }
});

class PostPanel extends Component {
  render() {
    const { classes, post } = this.props;

    return (
      <div className={classes.wrapper}>
        <Grid container spacing={24} justify="center">
          <Grid item xs={12}>
              <Img src={image} className={classes.thumbnail} />
          </Grid>

          <Grid item xs={12}>
              <Typography variant="title" align="center">{post.title}</Typography>
              <Typography variant="body2" align="center" gutterBottom>
                <strong><ProperName  user={post.authorId} /></strong>
              </Typography>
              <Typography variant="body1" align="center" gutterBottom>{post.summary}</Typography>
              <Grid container justify="center">
                <Grid item>
                  <Button href={"/post/s/" + this.props.post._id} color="primary">Read More</Button>
                </Grid>
              </Grid>

          </Grid>
        </Grid>
      </div>
    );
  }
 }

PostPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "post": PropTypes.object.isRequired,
};

export default withStyles(styles)(PostPanel);
