import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import Masonry from 'react-masonry-component';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';

// Material UI Icons
import Search from 'material-ui-icons/Search';

// Custom Components
import SettingContainer from './SettingContainer';
import { loadFromStorage } from '../../helpers/webStorage';
import webStorageTypes from '../../constants/webStorage.types';
import PostCard from '../utils/PostCard';

// Actions
import { getPostsList } from '../../actions/blog.actions';

const styles = theme => ({
  "buttonContainer": {
    "display": "flex",
    "justifyContent": "flex-end",
  },
});

class PostPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "limit": 18,
      "count": 0,
      'hasMore': false,
      "search": '',
    };

    this.state.userId = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_KEY);

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    if (this.state.userId) {
      this.props.getPostsList({
        'uid': this.state.userId,
        'limit': this.state.limit,
      }).then(response => {
        if (response) {
          this.setState({
            hasMore: this.state.limit < this.props.totalCount,
            count: this.state.count + this.state.limit
          });
        }
      });
    }
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  loadMore() {
    if (this.state.hasMore) {
      this.props.getPostsList({
        'uid': this.state.userId,
        'limit': this.state.limit + this.state.count,
        'search': this.state.search,
      }).then(response => {
        if (response) {
          this.setState({
            hasMore: this.state.count + this.state.limit < response.totalCount,
            count: this.state.count + this.state.limit
          });
        }
      });
    }
  }

  handleSearch(e) {
    e.preventDefault();

    this.props.getPostsList({
      'uid': this.state.userId,
      'limit': this.state.limit,
      'search': this.state.search,
    }).then(response => {
      if (response) {
        this.setState({
          hasMore: this.state.limit < this.props.totalCount,
          count: this.state.count + this.state.limit
        });
      }
    });
  }


  render() {
    const { classes, postsList } = this.props;

    return (
      <SettingContainer>
        <div>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Typography type="display1" gutterBottom>
                My Posts
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <form onSubmit={this.handleSearch}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="search">Search</InputLabel>
                  <Input
                    id="search"
                    type="text"
                    name="search"
                    onChange={this.handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Searching"
                          onClick={this.handleSearch}
                        >
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </form>
            </Grid>

            <Grid item xs={9}>
              <div className={classes.buttonContainer}>
                <Link to="/setting/post/s/new">
                  <Button raised color="primary">Add new</Button>
                </Link>
              </div>
            </Grid>

            <Grid item xs={12}>
              <InfiniteScroll
                pageStart={0}
                loadMore={this.loadMore}
                hasMore={this.state.hasMore}
                loader={<div className="loader" key={0}>Loading ...</div>}
              >
                <Masonry>
                  {
                    _.isEmpty(postsList) ? (<p>None</p>)
                      : postsList.map(item => (
                        <PostCard
                          key={item._id}
                          id={item._id}
                          author={item.authorId}
                          user={this.props.user}
                          isOwn={item.authorId._id === this.props.user._id}
                          title={item.title}
                          status={item.status}
                          handleDelete={this.handleDelete}
                        />
                      ))
                  }
                </Masonry>
              </InfiniteScroll>
            </Grid>

            <Grid item xs={12}>
              <Typography type="caption" align="center">
                --- No more posts, You have total {this.props.totalCount} posts ---
              </Typography>
            </Grid>
          </Grid>
        </div>
      </SettingContainer>
    );
  }
}

PostPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "postsList": state.blogReducer.list,
    "totalCount": state.blogReducer.totalCount,
  };
};

export default connect(mapStateToProps, { getPostsList })(withStyles(styles)(PostPage));
