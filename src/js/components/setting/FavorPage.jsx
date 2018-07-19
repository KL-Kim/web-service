import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Components
import SettingContainer from '../layout/SettingContainer';
import BusinessCard from '../utils/BusinessCard';

// Actions
import { getBusinessList, clearBusinessList } from '../../actions/business.actions';

// Webstorage
import { loadFromStorage } from '../../helpers/webStorage';
import webStorageTypes from '../../constants/webStorage.types';

const styles = (theme) => ({

});

class FavorPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 18,
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
          <Typography variant="display1">My Favorite Business</Typography>
          <br />

          {
            _.isEmpty(businessList)
              ? <Typography variant="body1" align="center">None</Typography>
              : <div>
                  <InfiniteScroll
                    pageStart={0}
                    loadMore={this.loadMore}
                    hasMore={this.state.hasMore}
                    loader={<div style={{ textAlign: 'center' }} key={0}>
                              <CircularProgress size={30} />
                            </div>}
                  >
                    <Grid container spacing={24} style={{ marginBottom: 12 }}>
                      {
                        businessList.map(item => (
                          <Grid item xs={4} key={item._id}>
                            <BusinessCard
                              bid={item._id}
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
                    </Grid>
                    {
                      this.state.hasMore
                        ? null
                        : <Typography variant="caption" align="center">
                            --- No more favorite business. You have total {this.props.totalCount} favors ---
                          </Typography>

                    }
                  </InfiniteScroll>
                </div>
          }
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
