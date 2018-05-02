import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { FormControl, FormControlLabel, FormLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

import Container from './utils/Container';
import BusinessCard from './utils/BusinessCard';
import { getBusinessListByCategory } from '../actions/business.actions.js';
import { getCategoriesList } from '../actions/category.actions.js';
import { loadFromStorage } from '../helpers/webStorage';
import webStorageTypes from '../constants/webStorage.types';
import Areas from '../constants/nanjing.areas';

const styles = theme => ({});

class BusinessListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "limit": 10,
      "count": 0,
      "page": 0,
      "area": '',
      "category": '',
      "orderBy": '',
      "event": false,
    };

    if (!_.isEmpty(this.props.match.params.slug)) {
      this.state.category = this.props.match.params.slug;
    }

    this.state.myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR);

    this.handleClickArea = this.handleClickArea.bind(this);
    this.handleClickOrderBy = this.handleClickOrderBy.bind(this);
    this.handleEventSwitch = this.handleEventSwitch.bind(this);
  }

  componentDidMount() {
    this.props.getCategoriesList();

    this.props.getBusinessListByCategory(this.state.category, this.state.limit);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.match.params.slug !== nextProps.match.params.slug) {
      this.props.getBusinessListByCategory(nextProps.match.params.slug, this.state.limit, {
        area: this.state.area,
        event: this.state.event,
      }, this.state.orderBy).then(response => {
        if (response) {
          this.setState({
            category: nextProps.match.params.slug,
          });
        }
      });
    }
  }

  handleClickArea = code => e => {
    this.props.getBusinessListByCategory(this.state.category, this.state.limit, {
      area: code,
      event: this.state.event,
    }, this.state.orderBy).then(response => {
      if (response) {
        this.setState({
          area: code,
        });
      }
    });
  }

  handleClickOrderBy = item => e => {
    this.props.getBusinessListByCategory(this.state.category, this.state.limit, {
      area: this.state.area,
      event: this.state.event,
    }, item).then(response => {
      if (response) {
        this.setState({
          orderBy: item,
        });
      }
    });
  }

  handleEventSwitch() {
    this.props.getBusinessListByCategory(this.state.category, this.state.limit, {
      area: this.state.area,
      event: !this.state.event,
    }, this.state.orderBy).then(response => {
      if (response) {
        this.setState({
          event: !this.state.event
        });
      }
    });
  }

  render() {
    const { classes, businessList, categories } = this.props;
    let index;

    const categoryList = categories.map((item, i) => (
      <Link to={{
          pathname: '/business/category/' + item.enName,
        }}
        key={i}
      >
        <Button color="primary" raised={this.state.category === item.enName}>{item.krName}</Button>
      </Link>
    ));

    const areasList = Areas.map((item, i) =>
      <Button color="primary" raised={this.state.area === item.code} key={i} onClick={this.handleClickArea(item.code)}>{item.cnName + '-' + item.pinyin}</Button>
    );

    return (
      <Container>
        <div>
          <Grid container spacing={16}>
            <Grid item xs={12}>
              <Grid container spacing={8}>
                <Grid item xs={12}>
                  <Typography type="title" gutterBottom>Category</Typography>
                  {categoryList}
                </Grid>
                <Grid item xs={12}>
                  <Typography type="title" gutterBottom>District</Typography>
                  <Button color="primary" raised={!this.state.area} onClick={this.handleClickArea('')}>All</Button>
                  {areasList}
                </Grid>
                <Grid item xs={12}>
                  <Typography type="title" gutterBottom>Order by</Typography>
                  <Button color="primary" raised={_.isEmpty(this.state.orderBy)} onClick={this.handleClickOrderBy('')}>Recommend</Button>
                  <Button color="primary" raised={this.state.orderBy === 'new'} onClick={this.handleClickOrderBy('new')}>New</Button>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth >
                    <FormLabel component="label">Event</FormLabel>
                    <Switch
                      color="primary"
                      checked={this.state.event}
                      onChange={this.handleEventSwitch}
                      value="event"
                      />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            {
              _.isEmpty(businessList) ? '' :
                businessList.map((item, i) => {
                  if (!_.isEmpty(this.state.myFavors)) {
                    index = this.state.myFavors.indexOf(item._id);
                  }

                  return (
                    <Grid item xs={3} key={i}>
                      <BusinessCard
                        key={item._id}
                        bid={item._id}
                        title={item.krName}
                        enName={item.enName}
                        rating={item.ratingSum / item.reviewsList.length}
                        thumbnailUri={item.thumbnailUri}
                        isFavor={!_.isUndefined(index) && index > -1 ? true : false}
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

BusinessListPage.propTypes = {
  "classes": PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "businessList": state.businessReducer.businessList,
    "totalCount": state.businessReducer.totalCount,
    "categories": state.categoryReducer.categoriesList,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getBusinessListByCategory, getCategoriesList })(withStyles(styles)(BusinessListPage));
