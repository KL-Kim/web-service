import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

import SectionCarousel from './utils/SectionCarousel';
import BusinessCard from './utils/BusinessCard';
import CategoryCard from './utils/CategoryCard';

// Webstorage
import { loadFromStorage } from '../helpers/webStorage';
import webStorageTypes from '../constants/webStorage.types';

// Actions
import { getBusinessList, clearBusinessList } from '../actions/business.actions.js';

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    maxWidth: 960,
    height: '100%',
    margin: 'auto',
    marginBottom: theme.spacing.unit * 15,
  },
  section: {
    marginTop: theme.spacing.unit * 8,
  },
  paper: {
    padding: theme.spacing.unit * 5,
    color: theme.palette.text.secondary
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
      limit: 9,
      orderBy: "useful",
      event: 1,
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
            <Typography variant="title" gutterBottom>Popular Categories</Typography>
            <Grid container spacing={24} justify="center" alignItems="center">
              {
                _.isEmpty(categories)
                  ? null
                  : categories.map(item => {
                    if (item.priority > 7) {
                      return (
                        <Grid item xs={3} key={item._id}>
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
              Hot Bussiness in Event
            </Typography>
            <Grid container spacing={24} justify="center">
              {
                _.isEmpty(businessList)
                  ? null
                  : businessList.map(item => (
                      <Grid item xs={4} key={item._id}>
                        <BusinessCard
                          bid={item._id}
                          title={item.krName}
                          enName={item.enName}
                          rating={item.ratingAverage}
                          thumbnailUri={item.thumbnailUri}
                          category={item.category}
                          tags={item.tags}
                          event={item.event}
                          myFavors={this.state.myFavors}
                        />
                      </Grid>
                    ))

              }
            </Grid>
          </div>
        </main>
        <Footer />
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
};

const mapStateToProps = (state, ownProps) => {
  return {
    "businessList": state.businessReducer.businessList,
    "isFetching": state.businessReducer.isFetching,
    "categories": state.categoryReducer.categoriesList,
  };
};

export default connect(mapStateToProps, { getBusinessList, clearBusinessList })(withStyles(styles)(HomePage));
