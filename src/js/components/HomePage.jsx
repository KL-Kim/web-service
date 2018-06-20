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
import SearchBar from './utils/SearchBar';
import CategoryBar from './utils/CategoryBar';
import BusinessCard from './utils/BusinessCard';

import { loadFromStorage } from '../helpers/webStorage';
import webStorageTypes from '../constants/webStorage.types';

// Actions
import { getBusinessList, clearBusinessList } from '../actions/business.actions.js';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 5,
    color: theme.palette.text.secondary
  },
});

class HomePage extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.state.myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR);
  }

  componentDidMount() {
    this.props.getBusinessList({
      limit: 3,
      orderBy: "useful"
    });
  }

  componentWillUnmount() {
    this.props.clearBusinessList();
  }

  render() {
    const { classes, businessList } = this.props;
    let index;

    return (
      <Container>
        <div>
          <Grid container spacing={16} justify="center" alignItems="center">
            <Grid item xs={12}>
              <Paper className={classes.paper} >
                <SearchBar history={this.props.history} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper} >
                <CategoryBar />
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={16} justify="center" alignItems="center">
            <Grid item xs={12}>
              <Typography variant="display1" gutterBottom align="center">
                Hot & New Bussiness
              </Typography>
            </Grid>
            {
              _.isEmpty(businessList)
                ? ''
                : businessList.map(item => {
                  if (!_.isEmpty(this.state.myFavors)) {
                    index = this.state.myFavors.indexOf(item._id);
                  }

                  return (
                    <Grid item xs={4} key={item._id}>
                      <BusinessCard
                        history={this.props.history}
                        bid={item._id}
                        title={item.krName}
                        enName={item.enName}
                        rating={item.ratingAverage}
                        thumbnailUri={item.thumbnailUri}
                        isFavor={(!_.isUndefined(index) && index > -1) ? true : false}
                      />
                    </Grid>
                  );
                })

            }

          </Grid>
        </div>
      </Container>
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
  };
};

export default connect(mapStateToProps, { getBusinessList, clearBusinessList })(withStyles(styles)(HomePage));
