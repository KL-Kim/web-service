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
      limit: 4,
      count: 0,
      hasMore: false,
    };

    this.state.favors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR);

    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    if (!_.isEmpty(this.props.user.favors)) {
      this.props.getBusinessList({
        limit: this.state.limit,
        filter: {
          list: this.props.user.favors
        }
      })
      .then(response => {
        if (response) {
          this.setState({
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
      });
    } else if (!_.isEmpty(this.state.favors)) {
      this.props.getBusinessList({
        limit: this.state.limit,
        filter: {
          list: this.state.favors
        }
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
      this.props.getBusinessList(0, this.state.count + this.state.limit, {
        list: this.props.user.favors
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
    let index;

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
                          rating={item.ratingAverage}
                          thumbnailUri={item.thumbnailUri}
                          isFavor={index > -1 ? true : false}
                        />
                      </Grid>
                    );
                  })
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
