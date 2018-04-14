import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Container from './utils/Container';
import BusinessCard from './utils/BusinessCard';
import BusinessFilter from './utils/BusinessFilter';

import { getBusinessList } from '../actions/business.actions.js';

const styles = theme => ({});

class BusinessListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "rowsPerPage": 10,
      "page": 0,
    };
  }

  componentDidMount() {
    this.props.getBusinessList(0, this.state.rowsPerPage, {
      "state": "published"
    });
  }

  render() {
    const { classes, businessList } = this.props;

    return (
      <Container>
        <div>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <BusinessFilter />
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            {
              _.isEmpty(businessList) ? '' :
                businessList.map((item, index) =>
                  <Grid item xs={3} key={index}>
                    <Link to={{
                      "pathname": "/business/" + item.enName,
                    }}>
                        <BusinessCard title ={item.krName} rating={item.ratingAverage} thumbnailUri={item.thumbnailUri} />
                    </Link>
                  </Grid>
                )
            }
          </Grid>
        </div>
      </Container>
    );
  }
}

BusinessListPage.propTypes = {
  "classes": PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "businessList": state.businessReducer.businessList,
    "totalCount": state.businessReducer.totalCount,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getBusinessList })(withStyles(styles)(BusinessListPage));
