import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

// Custom Components
import Container from './layout/Container';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Alert from './utils/Alert';
import DevTools from './layout/DevTools';
import BottomNav from './layout/BottomNav';

import SectionCarousel from './utils/SectionCarousel';
import CategoryCard from './sections/cards/CategoryCard';
import BusinessPanel from './sections/BusinessPanel';

// Webstorage
import { loadFromStorage } from '../helpers/webStorage';
import webStorageTypes from '../constants/webStorage.types';

// Actions
import { openLoginDialog } from 'js/actions/app.actions';
import { favorOperation } from 'js/actions/user.actions';
import { getBusinessList, clearBusinessList } from '../actions/business.actions.js';
import { Button } from '../../../node_modules/@material-ui/core';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    maxWidth: 976,
    height: '100%',
    margin: 'auto',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    marginTop: theme.spacing.unit * 16,
    marginBottom: theme.spacing.unit * 16,
  },
  section: {
    marginTop: theme.spacing.unit * 8,
  },
});

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myFavors: loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [],
    };
  }

  componentDidMount() {
    this.props.getBusinessList({
      'limit': 9,
      'orderBy': "useful",
      'event': 1,
    });
  }

  componentWillUnmount() {
    this.props.clearBusinessList();
  }

  render() {
    const { classes, businessList, categories } = this.props;

    return (
      <div>
        <Header position={"absolute"} />
        <SectionCarousel />
        <main className={classes.appFrame}>
          <div className={classes.section}>
            <Grid container justify="space-between" alignItems="flex-end">
              <Grid item>
                <Typography variant="title" gutterBottom>Popular Categories</Typography>
              </Grid>

              <Grid item>
                <Link to="/explore">
                  <Button>More</Button>
                </Link>
              </Grid>
            </Grid>
            
            <Grid container spacing={16} justify="center" alignItems="center">
              {
                _.isEmpty(categories)
                  ? null
                  : categories.map(item => {
                    if (item.priority > 7) {
                      return (
                        <Grid item xs={6} sm={3} key={item._id}>
                          <CategoryCard name={item.krName} url={"/business/category/" + item.enName} />
                        </Grid>
                      );
                    }
                  })
              }
            </Grid>
          </div>

          <div className={classes.section}>
            <Typography variant="title" gutterBottom>
              Popular Event
            </Typography>
            <BusinessPanel
              businessList={this.props.businessList}
              totalCount={this.props.totalCount}
              isLoggedIn={this.props.isLoggedIn}
              userId={_.isEmpty(this.props.user) ? '' : this.props.user._id}
              favorOperation={this.props.favorOperation}
              openLoginDialog={this.props.openLoginDialog}
              clearBusinessList={this.props.clearBusinessList}
            />
          </div>
        </main>
        <BottomNav />
        <DevTools />
        <Alert />
      </div>
    );
  }
}

HomePage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "businessList": PropTypes.array.isRequired,
  "isFetching": PropTypes.bool.isRequired,
  "user": PropTypes.object.isRequired,
  "isLoggedIn": PropTypes.bool.isRequired,

  // Methods
  getBusinessList: PropTypes.func.isRequired, 
  clearBusinessList: PropTypes.func.isRequired, 
  openLoginDialog: PropTypes.func.isRequired, 
  favorOperation: PropTypes.func.isRequired, 
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "businessList": state.businessReducer.businessList,
    "isFetching": state.businessReducer.isFetching,
    "categories": state.categoryReducer.categoriesList,
  };
};

export default connect(mapStateToProps, { 
  getBusinessList, 
  clearBusinessList,
  openLoginDialog,
  favorOperation, 
})(withStyles(styles)(HomePage));
