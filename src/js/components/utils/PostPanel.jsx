import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Img from 'react-image';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Custom Components
import ProperName from './ProperName';
import ElapsedTime from '../../helpers/ElapsedTime';

// Mock image
import image from '../../../css/ikt-icon.gif';

const styles = theme => ({
  thumbnail: {
    width: '100%',
    height: 'auto',
  }
});

class PostPanel extends Component {
  render() {
    const { classes, post } = this.props;

    const thumbnail = (
      <Grid item xs={4}>
        <Img src={image} className={classes.thumbnail}/>
      </Grid>
    );

    const content = (
      <Grid item xs={8}>
        <Typography type="display1" gutterBottom>{post.title}</Typography>
        <Typography type="body1" gutterBottom>{post.summary}</Typography>
        <Typography type="body1" gutterBottom>
          By <strong><ProperName  user={post.authorId} /></strong>
        </Typography>
        <Typography type="body1" gutterBottom>Creadted at: {ElapsedTime(post.createdAt)}</Typography>
      </Grid>
    );

    return (
      <div>
        <Link to={"/post/s/" + this.props.post._id}>
          <Grid container>
            {this.props.rtl ? content : thumbnail}
            {this.props.rtl ? thumbnail : content}
          </Grid>
        </Link>
      </div>
    );
  }
 }

PostPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "post": PropTypes.object.isRequired,
};

export default withStyles(styles)(PostPanel);
