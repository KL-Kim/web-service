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
import BusinessPanel from '../sections/BusinessPanel';

// Actions
import { favorOperation } from 'js/actions/user.actions';
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions';

// Webstorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

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

    return _.isEmpty(this.props.user) ? null : (
      <SettingContainer>
        <div>
          <Typography variant="display1">My Favorite Business</Typography>
          <br />

          <BusinessPanel 
            businessList={this.props.businessList}
            totalCount={this.props.totalCount}
            isLoggedIn={this.props.isLoggedIn}
            userId={this.props.user._id}
            favorOperation={this.props.favorOperation}
          />
          
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
    "isLoggedIn": state.userReducer.isLoggedIn,
    "businessList": state.businessReducer.businessList,
    "totalCount": state.businessReducer.totalCount,
  };
};

export default connect(mapStateToProps, { getBusinessList, clearBusinessList, favorOperation })(withStyles(styles)(FavorPage));
