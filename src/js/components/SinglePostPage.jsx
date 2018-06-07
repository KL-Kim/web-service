import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Img from 'react-image';
import Stars from 'react-stars';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Table, { TableBody, TableCell, TableHead, TableRow, } from 'material-ui/Table';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import Share from 'material-ui-icons/Share';
import ErrorOutline from 'material-ui-icons/ErrorOutline';
import { FormControl, FormControlLabel, FormLabel, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';

import Container from './utils/Container'
import ProperName from './utils/ProperName';
import ElapsedTime from '../helpers/ElapsedTime';
import { getSinglePost } from '../actions/blog.actions';

import config from '../config/config';
import image from '../../css/ikt-icon.gif';

const styles = theme => ({
  "paper": {
    padding: theme.spacing.unit * 5,
    color: theme.palette.text.secondary
  },
});

class SinglePostPage extends Component {
  constructor(props){
    super(props);

    this.state = {};

    this.state.id = props.match.params.id;
  }

  componentDidMount() {
    if (this.state.id) {
      this.props.getSinglePost(this.state.id)
        .then(response => {
          if (response) {
            this.setState({
              post: response.post
            });
          } else {
            this.props.history.push('/404');
          }
        })
    } else {
      this.props.history.push('/404');
    }
  }

  render() {
    const { classes } = this.props;
    const { post } = this.state;

    return (
      <Container>
        {
          _.isEmpty(post) ? ''
            : <div>
                <Grid container justify="center">
                  <Grid item xs={12}>
                    <Typography type="display3" align="center" gutterBottom>{post.title}</Typography>
                    <Typography type="title" align="center">By <strong><ProperName  user={post.authorId} /></strong></Typography>
                    <Typography type="caption" align="center" gutterBottom>{ElapsedTime(post.createdAt)}</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Paper className={classes.paper}>
                      <Typography type="body1">
                        {post.content}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
                <Grid container justify="center">
                  <Grid item xs={6}>
                    <Typography type="display1" align="center" gutterBottom>Comments</Typography>
                    <FormControl fullWidth required>
                      <InputLabel htmlFor="content">Content</InputLabel>
                      <Input
                        type="text"
                        id="content"
                        multiline
                        rows={5}
                        name="content"
                        value={this.state.content}
                        onChange={this.handleChange}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </div>
        }
      </Container>
    );
  }
}

SinglePostPage.propTypes = {
  "classes": PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
  };
};

export default connect(mapStateToProps, {
  getSinglePost
})(withStyles(styles)(SinglePostPage));
