import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Custom Components
import ProperName from './ProperName';

import image from '../../../css/ikt-icon.gif';

const styles = theme => ({
  container: {
    width: '33.3%',
  },
  card: {
    margin: theme.spacing.unit * 2,
  },
  media: {
    height: 200,
  },
});

class PostCard extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardMedia className={classes.media}
            image={image}
          />
          <CardContent>
            <Typography type="title" gutterBottom>
              {this.props.title + ' '}

              {this.props.status === 'PUBLISHED' ? '' : '(' + _.toLower(this.props.status) + ')'}
            </Typography>
            <Typography type="body1" gutterBottom>
              <ProperName user={this.props.author} />
            </Typography>
            <Typography type="body1" gutterBottom>{this.props.summary}</Typography>
          </CardContent>
          {
            this.props.isOwn ? (
              <CardActions>
                <Link to={"/setting/post/s/" + this.props.id}>
                  <Button color="primary">Edit</Button>
                </Link>
              </CardActions>
            ) : ''
          }
        </Card>
      </div>
    );
  }
}

PostCard.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "author": PropTypes.string.isRequired,
  "isOwn": PropTypes.bool.isRequired,
  "title": PropTypes.string.isRequired,
  "status": PropTypes.string.isRequired,
  "handleDelete": PropTypes.func,
};

export default withStyles(styles)(PostCard);
