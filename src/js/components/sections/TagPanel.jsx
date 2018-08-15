import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Custom Components
import HorizontalScrollBar from 'js/components/utils/HorizontalScrollBar';
import BusinessCard from './cards/BusinessCard';

// Actions
import { openLoginDialog } from 'js/actions/app.actions'; 
import { favorOperation } from 'js/actions/user.actions';
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions.js';

// WebStorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

const styles = theme => ({
  card: { 
    marginRight: 16,
  }
});

class TagPanel extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      myFavors: [],
    };
  }

  componentDidMount() {
    this.props.getBusinessList({
      limit: 6,
      tag: this.props.tag.enName,
    }).then(response => {
      if (response) {
        this.setState({
          list: [...response.list],
        });
      }
    });

    if (this.props.isLoggedIn) {
      const myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

      if (myFavors) {
        this.setState({
          myFavors: [...myFavors],
        });
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isLoggedIn !== this.props.isLoggedIn) {
        const myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

        if (myFavors) {
          this.setState({
            myFavors: [...myFavors],
          });
        }
    }
}

  render() {
    const { classes } = this.props;

    let index;

    return _.isEmpty(this.state.list) ? null : (
      <div>
        <Grid container justify="space-between" alignItems="flex-end">
          <Grid item>
            <Typography variant="title" gutterBottom>#{this.props.tag.krName}</Typography>
          </Grid>

          <Grid item>
            <Link to={"/business/tag/" + this.props.tag.enName}>
              <Button>More</Button>
            </Link>
          </Grid>
        </Grid>

        <HorizontalScrollBar>
          {
            this.state.list.map(item => {
              index = this.state.myFavors.indexOf(item._id);

              return (
                <div className={classes.card} key={item._id}>
                  <BusinessCard
                      bid={item._id}
                      title={item.krName}
                      enName={item.enName}
                      rating={item.ratingAverage}
                      thumbnailUri={item.thumbnailUri}
                      category={item.category}
                      tags={item.tags}
                      event={!!(item.event)}

                      isFavor={index > -1 ? true : false}
                      isLoggedIn={this.props.isLoggedIn}
                      userId={_.isEmpty(this.props.user) ? '' : this.props.user._id}
                      favorOperation={this.props.favorOperation}
                      openLoginDialog={this.props.openLoginDialog}
                  />
                </div>
              );
            })
          }
        </HorizontalScrollBar>
      </div>
    );
  }
}

TagPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "tag": PropTypes.object.isRequired,
  "isFetching": PropTypes.bool,
  "user": PropTypes.object,
  "isLoggedIn": PropTypes.bool.isRequired,

  // Methods
  "getBusinessList": PropTypes.func.isRequired,
  "favorOperation": PropTypes.func.isRequired,
  "openLoginDialog": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { 
  getBusinessList, 
  favorOperation, 
  clearBusinessList,
  openLoginDialog,
})(withStyles(styles)(TagPanel));
