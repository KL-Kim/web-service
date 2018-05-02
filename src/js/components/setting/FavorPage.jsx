import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import SettingContainer from './SettingContainer';
import BusinessCard from '../utils/BusinessCard';
import { getBusinessList, clearBusinessList } from '../../actions/business.actions';
import { loadFromStorage } from '../../helpers/webStorage';
import webStorageTypes from '../../constants/webStorage.types';

const styles = (theme) => ({});

class FavorPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 4,
      count: 0,
      hasMore: false,
    };

    this.state.favors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR);

    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    if (!_.isEmpty(this.props.user.favors)) {
      this.props.getBusinessList(0, this.state.limit,
        {
          list: this.props.user.favors
        }
      )
      .then(response => {
        if (response) {
          this.setState({
            count: this.state.limit,
            hasMore: this.state.limit < response.totalCount,
          });
        }
      });
    } else if (!_.isEmpty(this.state.favors)) {
      this.props.getBusinessList(0, this.state.limit,
        {
          list: this.state.favors
        }
      )
      .then(response => {
        if (response) {
          this.setState({
            count: this.state.limit,
            hasMore: this.state.limit < response.totalCount,
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
      this.props.getBusinessList(0, this.state.count + this.state.limit, {
        list: this.props.user.favors
      })
      .then(response => {
        if (response) {
          this.setState({
            count: this.state.count + this.state.limit,
            hasMore: this.state.count + this.state.limit < response.totalCount,
          });
        }
      });
    }
  }

  render() {
    const { classes, businessList } = this.props;
    let index;

    return (
      <SettingContainer>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.loadMore}
          hasMore={this.state.hasMore}
          loader={<div className="loader" key={0}>Loading ...</div>}
        >
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography type="display1" gutterBottom>
              Favorite Business. Total count: {this.props.totalCount}
            </Typography>
          </Grid>
          {
            _.isEmpty(businessList)
              ? <Grid item xs={12}><Typography type="body1" align="center">None</Typography></Grid>
              : businessList.map((item, i) => {
                if (!_.isEmpty(this.state.favors)) {
                  index = this.state.favors.indexOf(item._id);
                }

                return (
                  <Grid item xs={3} key={i}>
                    <BusinessCard
                      bid={item._id}
                      key={item._id}
                      title={item.krName}
                      enName={item.enName}
                      rating={item.ratingSum / item.reviewsList.length}
                      thumbnailUri={item.thumbnailUri}
                      isFavor={index > -1 ? true : false}
                    />
                  </Grid>
                );
              })
          }
          <Grid item xs={12}>
            <Typography type="caption" align="center">
              --- No more favors ---
            </Typography>
          </Grid>
        </Grid>
        </InfiniteScroll>
      </SettingContainer>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "businessList": state.businessReducer.businessList,
    "totalCount": state.businessReducer.totalCount,
  };
};

export default connect(mapStateToProps, { getBusinessList, clearBusinessList })(withStyles(styles)(FavorPage));
