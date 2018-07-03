import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Custom Components
import SettingContainer from '../layout/SettingContainer';
import BusinessCard from '../utils/BusinessCard';

// Actions
import { getBusinessList, clearBusinessList } from '../../actions/business.actions';

// Webstorage
import { loadFromStorage } from '../../helpers/webStorage';
import webStorageTypes from '../../constants/webStorage.types';

const styles = (theme) => ({});

class FavorPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 20,
      count: 0,
      hasMore: false,
    };

    this.state.myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    if (this.state.myFavors) {
      this.props.getBusinessList({
        limit: this.state.limit,
        ids: this.state.myFavors,
      })
      .then(response => {
        if (response) {
          this.setState({
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
      });
    }
  }

  componentWillUnmount() {
    this.props.clearBusinessList();
  }

  loadMore() {
    if (this.state.hasMore) {
      this.props.getBusinessList({
        limit: this.state.count + this.state.limit,
        ids: this.props.user.favors
      })
      .then(response => {
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
    const { classes, businessList } = this.props;

    return (
      <SettingContainer>
        <div>
          <Typography variant="display1" gutterBottom>
            Favorite Business
          </Typography>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={this.state.hasMore}
            loader={<div className="loader" key={0}>Loading ...</div>}
          >
            <Grid container spacing={16}>
              {
                _.isEmpty(businessList)
                  ? <Grid item xs={12}>
                      <Typography variant="body1" align="center">None</Typography>
                    </Grid>
                  : businessList.map(item => (
                      <Grid item xs={4} key={item._id}>
                        <BusinessCard
                          bid={item._id}
                          key={item._id}
                          title={item.krName}
                          enName={item.enName}
                          rating={item.ratingAverage}
                          thumbnailUri={item.thumbnailUri}
                          category={item.category}
                          tags={item.tags}
                          myFavors={this.state.myFavors}
                        />
                      </Grid>
                    ))
              }
              <Grid item xs={12}>
                <Typography variant="caption" align="center">
                  --- No more favors. You have total {this.props.totalCount} favors ---
                </Typography>
              </Grid>
            </Grid>
          </InfiniteScroll>
        </div>
      </SettingContainer>
    );
  }
}

FavorPage.propTypes = {
  "classes": PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "businessList": state.businessReducer.businessList,
    "totalCount": state.businessReducer.totalCount,
  };
};

export default connect(mapStateToProps, { getBusinessList, clearBusinessList })(withStyles(styles)(FavorPage));
