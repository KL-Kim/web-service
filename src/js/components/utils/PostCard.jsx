import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

// Material UI Icons
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

// Custom Components
import ProperName from './ProperName';

// Mock Image
import image from 'css/ikt-icon.gif';

const styles = theme => ({

});

class PostCard extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Card>
        <CardMedia
          image={image}
          style={{ height: 180 }}
        />
        <CardContent>
          <Typography variant="title">
            {this.props.title}
          </Typography>
          <Typography variant="subheading" gutterBottom>
            {_.toLower(this.props.status)}
          </Typography>
          <Typography variant="body1" gutterBottom>{this.props.summary}</Typography>
        </CardContent>

        <CardActions>
          <Link to={"/setting/post/s/" + this.props.id}>
            <IconButton color="primary">
              <Edit />
            </IconButton>
          </Link>
        </CardActions>
      </Card>
    );
  }
}

PostCard.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "author": PropTypes.object.isRequired,
  "title": PropTypes.string.isRequired,
  "status": PropTypes.string.isRequired,
  "handleDelete": PropTypes.func,
};

export default withStyles(styles)(PostCard);
