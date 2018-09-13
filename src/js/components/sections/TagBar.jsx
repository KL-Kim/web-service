import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

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
import { getBusinessList } from 'js/actions/business.actions.js';

// WebStorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

const styles = theme => ({
  card: {
    width: 260,
    marginRight: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit,
  },
});

class TagBar extends Component {
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
      if (!isEmpty(this.props.user) && !isEmpty(this.props.user.favors)) {
          this.setState({
              myFavors: [...this.props.user.favors]
          })
      } else {
          const myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

          if (myFavors) {
              this.setState({
                  myFavors: [...myFavors],
              });
          }
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== this.props.user) {
      if (!isEmpty(this.props.user) && !isEmpty(this.props.user.favors)) {
          this.setState({
              myFavors: [...this.props.user.favors]
          })
      } else {
          const myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

          if (myFavors) {
              this.setState({
                  myFavors: [...myFavors],
              });
          }
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.list !== this.state.list) {
      return true;
    } 
    else if (nextState.myFavors !== this.state.myFavors) {
      return true;
    } 
    else if (nextProps.user !== this.props.user) {
      return true;
    }
    else {
      return false;
    }
  }

  render() {
    const { classes } = this.props;

    return isEmpty(this.state.list) ? null : (
      <div>
        <Grid container justify="space-between" alignItems="flex-end">
          <Grid item>
            <Typography variant="title" gutterBottom>#{this.props.tag.krName}</Typography>
          </Grid>

          <Grid item>
            <Link to={{
                pathname: "/business/tag/" + this.props.tag.enName,
                hash: '#',
                state: {
                  tag: this.props.tag
                }
              }} 
            >
              <Button>More</Button>
            </Link>
          </Grid>
        </Grid>

        <HorizontalScrollBar>
          {
            this.state.list.map(item => (
                <div className={classes.card} key={item._id}>
                  <BusinessCard
                      bid={item._id}
                      title={item.krName}
                      slug={item.enName}
                      rating={item.ratingAverage}
                      ratesCount={item.reviewsList.length}
                      image={isEmpty(item.mainImage) ? '' : item.mainImage.url}
                      category={item.category}
                      tags={item.tags}
                      event={!isEmpty(item.event)}

                      isFavor={this.state.myFavors.includes(item._id)}
                      isLoggedIn={this.props.isLoggedIn}
                      userId={isEmpty(this.props.user) ? '' : this.props.user._id}
                      favorOperation={this.props.favorOperation}
                      openLoginDialog={this.props.openLoginDialog}
                  />
                </div>
              ))
          }
        </HorizontalScrollBar>
      </div>
    );
  }
}

TagBar.propTypes = {
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
  openLoginDialog,
})(withStyles(styles)(TagBar));
