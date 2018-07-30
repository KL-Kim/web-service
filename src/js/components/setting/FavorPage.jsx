import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';

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
      myFavors: [],
    };

    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    const favors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR);

    if (!_.isEmpty(favors)) {
      this.props.getBusinessList({
        limit: this.state.limit,
        ids: favors,
      })
      .then(response => {
        if (response) {
          this.setState({
            myFavors: [...favors],
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
    const { classes } = this.props;

    return _.isEmpty(this.props.user) ? null : (
      <SettingContainer>
        <div>
          <Typography variant="display1">My Favorite Business</Typography>
          <br />

          <BusinessPanel 
            hasMore={this.state.hasMore}
            loadMore={this.loadMore}
            businessList={this.props.businessList}
            totalCount={this.props.totalCount}
            isLoggedIn={this.props.isLoggedIn}
            userId={this.props.user._id}
            favorOperation={this.props.favorOperation}
            showNoMore
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
