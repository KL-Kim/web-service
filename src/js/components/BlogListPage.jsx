import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

// Custom Components
import Container from './layout/Container';
import PostPanel from './utils/PostPanel';

// Actions
import { getPostsList } from '../actions/blog.actions.js';

const styles = theme => ({
  "root": {
    maxWidth: 760,
    margin: 'auto',
  },
  "section": {
    marginBottom: theme.spacing.unit * 8
  },
});

class BlogListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 10,
      count: 0,
      hasMore: false,
    }

    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.props.getPostsList({
      limit: this.state.limit,
      status: 'PUBLISHED',
      state: 'NORMAL',
    }).then(response => {
      if (response) {
        this.setState({
          count: response.list.length,
          hasMore: response.list.length < response.totalCount,
        });
      }
    });
  }

  loadMore() {
    if (this.state.hasMore) {
      const newCount = this.state.count + this.state.limit;

      this.props.getPostsList({
        limit: newCount,
        status: "PUBLISHED",
        state: 'NORMAL',
      }).then(response => {
        if (response) {
          this.setState({
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
      });
    }
  }

  render() {
    const { classes, list } = this.props;

    return (
      <Container>
        <div className={classes.root}>
          <Typography variant="display2" gutterBottom align="center">Articles</Typography>
          <br />

          <Grid container justify="center">
            {
              _.isEmpty(list) ? ''
                : list.map((item, index) =>
                  item.state === 'NORMAL'
                    ? (
                        <Grid item xs={12} key={item._id} className={classes.section}>
                          <PostPanel
                            rtl={(index % 2) ? true : false}
                            post={item}
                          />
                        </Grid>
                      )
                    : null
                )
            }
            <Grid item>
              {
                this.state.hasMore
                  ? <Button variant="raised" color="primary" onClick={this.loadMore}>Load more</Button>
                  : <Typography variant="caption" align="center">--- No more posts ---</Typography>
              }
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

BlogListPage.propTypes = {
  "classes": PropTypes.object.isRequired,
}


const mapStateToProps = (state, ownProps) => {
  return {
    "list": state.blogReducer.list,
    "isFetching": state.blogReducer.isFetching,
    "totalCount": state.blogReducer.totalCount,
  };
};

export default connect(mapStateToProps, { getPostsList })(withStyles(styles)(BlogListPage));
