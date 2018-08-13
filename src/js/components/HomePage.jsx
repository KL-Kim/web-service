import React, { Component } from 'react';
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
import Container from './layout/Container';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Alert from './utils/Alert';
import DevTools from './layout/DevTools';
import BottomNav from './layout/BottomNav';

import SectionCarousel from './sections/SectionCarousel';
import CategoryCard from './sections/cards/CategoryCard';
import BusinessPanel from './sections/BusinessPanel';
import HorizontalScrollBar from 'js/components/utils/HorizontalScrollBar';

// Actions
import { favorOperation } from 'js/actions/user.actions';
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions.js';

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
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 16,
  },
  section: {
    marginBottom: theme.spacing.unit * 4,
  },
  card: {
    marginRight: theme.spacing.unit * 2,
  },
});

class HomePage extends Component {
  componentDidMount() {
    this.props.getBusinessList({
      'limit': 9,
      'orderBy': "useful",
      'event': 1,
    });
  }

  render() {
    const { classes } = this.props;

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
            
            <HorizontalScrollBar>
              {
                this.props.categories.map(item => {
                    if (item.priority > 7) {
                      return (
                        <div className={classes.card} key={item._id}>
                          <CategoryCard name={item.krName} url={"/business/category/" + item.enName} />
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })
              }
            </HorizontalScrollBar>
          </div>

          <div className={classes.section}>
            <Typography variant="title" gutterBottom>
              Popular Event
            </Typography>
            <BusinessPanel
              businessList={this.props.businessList}
              isFetching={this.props.isFetching}
              totalCount={this.props.totalCount}
              isLoggedIn={this.props.isLoggedIn}
              userId={_.isEmpty(this.props.user) ? '' : this.props.user._id}
              favorOperation={this.props.favorOperation}
              clearBusinessList={this.props.clearBusinessList}
            />
          </div>
        </main>
        <BottomNav />
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
  "user": PropTypes.object.isRequired,
  "isLoggedIn": PropTypes.bool.isRequired,

  // Methods
  getBusinessList: PropTypes.func.isRequired, 
  clearBusinessList: PropTypes.func.isRequired,  
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
  favorOperation, 
})(withStyles(styles)(HomePage));
