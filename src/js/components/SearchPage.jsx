import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { FormControl, FormControlLabel, FormLabel } from 'material-ui/Form';
import Switch from 'material-ui/Switch';

import Container from './utils/Container';
import BusinessCard from './utils/BusinessCard';
import { getBusinessList } from '../actions/business.actions.js';
import { getCategoriesList } from '../actions/category.actions.js';
import { loadFromStorage } from '../helpers/webStorage';
import webStorageTypes from '../constants/webStorage.types';
import Areas from '../constants/nanjing.areas';

const styles = theme => ({});

class SearchPage extends Component {
  constructor(props) {
    super(props);

    const parsed = queryString.parse(props.location.search);

    this.state = {
      "limit": 24,
      "count": 0,
      "categories": [],
      "categorySlug": '',
      "areas": [],
      "areaCode": '',
      "orderBy": '',
      "event": false,
      "hasMore": false,
      ...parsed
    };

    this.handleClickArea = this.handleClickArea.bind(this);
    this.handleClickOrderBy = this.handleClickOrderBy.bind(this);
    this.handleEventSwitch = this.handleEventSwitch.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    if (this.state.s) {
      this.props.getBusinessList({
        limit: this.state.limit,
        search: this.state.s,
      })
      .then(response => {
        if (response) {
          const categories = [];
          const areas = [];

          response.list.map(business => {
            categories.push(business.category);
            areas.push(business.address.area);
          });

          this.setState({
            categories: categories.slice(),
            areas: areas.slice(),
            count: this.state.limit,
            hasMore: this.state.limit < this.props.totalCount
          });
        }
      });
    }
  }

  componentDidUpdate() {
    const parsed = queryString.parse(this.props.location.search);

    if (parsed.s !== this.state.s) {
      this.setState({
        s: parsed.s
      });

      this.props.getBusinessList({
        limit: this.state.limit,
        search: parsed.s,
      })
      .then(response => {
        if (response) {
          const categories = [];
          const areas = [];

          response.list.map(business => {
            categories.push(business.category);
            areas.push(business.address.area);
          });

          this.setState({
            s: parsed.s,
            categories: categories.slice(),
            areas: areas.slice(),
            count: this.state.limit,
            hasMore: this.state.limit < this.props.totalCount
          });
        }
      });
    }
  }

  handleClickCategory = slug => e => {
    if (this.state.categorySlug !== slug) {
      this.props.getBusinessList({
        limit: this.state.limit,
        filter: {
          category: slug,
          area: this.state.areaCode,
          event: this.state.event,
        },
        orderBy: this.state.orderBy,
        search: this.state.s,
      })
      .then(response => {
        if (response) {
          this.setState({
            categorySlug: slug,
            count: this.state.limit,
            hasMore: this.state.limit < this.props.totalCount
          });
        }
      });
    }
  }

  handleClickArea = code => e => {
    if (this.state.areaCode !== code) {
      this.props.getBusinessList({
        limit: this.state.limit,
        filter: {
          category: this.state.categorySlug,
          area: code,
          event: this.state.event,
        },
        orderBy: this.state.orderBy,
        search: this.state.s,
      })
      .then(response => {
        if (response) {
          this.setState({
            areaCode: code,
            count: this.state.limit,
            hasMore: this.state.limit < this.props.totalCount
          });
        }
      });
    }
  }

  handleClickOrderBy = item => e => {
    if (this.state.orderBy !== item) {
      this.props.getBusinessList({
        limit: this.state.limit,
        filter: {
          category: this.state.categorySlug,
          area: this.state.area,
          event: this.state.event,
        },
        orderBy: item,
        search: this.state.s,
      })
      .then(response => {
        if (response) {
          this.setState({
            orderBy: item,
            count: this.state.limit,
            hasMore: this.state.limit < this.props.totalCount
          });
        }
      });
    }
  }

  handleEventSwitch() {
    this.props.getBusinessList({
      limit: this.state.limit,
      filter: {
        category: this.state.categorySlug,
        area: this.state.area,
        event: !this.state.event,
      },
      orderBy: this.state.orderBy,
      search: this.state.s,
    })
    .then(response => {
      if (response) {
        this.setState({
          event: !this.state.event,
          count: this.state.limit,
          hasMore: this.state.limit < this.props.totalCount
        });
      }
    });
  }

  loadMore() {
    if (this.state.count < this.props.totalCount) {
      this.props.getBusinessList({
        limit: this.state.count + this.state.limit,
        filter: {
          category: this.state.categorySlug,
          area: this.state.areaCode,
          event: this.state.event,
        },
        search: this.state.s,
        orderBy: this.state.orderBy,
    })
    .then((response => {
        this.setState({
          count: this.state.count + this.state.limit,
          hasMore: this.state.count + this.state.limit < this.props.totalCount
        });
      }));
    }
  }

  render() {
    const { classes, businessList } = this.props;
    let index;

    return (
      <Container>
        <div>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Typography type="display1" gutterBottom>Search: {this.state.s}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography type="title" gutterBottom>Category</Typography>
              <Button color="primary" raised={!this.state.categorySlug} onClick={this.handleClickCategory('')}>All</Button>
              {
                _.isEmpty(this.state.categories) ? ''
                  : this.state.categories.map((item, index) =>
                    <Button key={index}
                      color="primary"
                      raised={this.state.categorySlug === item.enName}
                      onClick={this.handleClickCategory(item.enName)}
                    >
                      {item.krName}
                    </Button>
                  )
              }
            </Grid>
            <Grid item xs={12}>
              <Typography type="title" gutterBottom>District</Typography>
              <Button color="primary" raised={!this.state.areaCode} onClick={this.handleClickArea('')}>All</Button>
              {
                _.isEmpty(this.state.areas) ? ''
                  : this.state.areas.map((item, index) =>
                    <Button key={index}
                      color="primary"
                      raised={this.state.areaCode === item.code}
                      onClick={this.handleClickArea(item.code)}
                    >
                      {item.name}
                    </Button>
                  )
              }
            </Grid>
            <Grid item xs={12}>
              <Typography type="title" gutterBottom>Order by</Typography>
              <Button color="primary" raised={_.isEmpty(this.state.orderBy)} onClick={this.handleClickOrderBy('')}>Recommend</Button>
              <Button color="primary" raised={this.state.orderBy === 'rating'} onClick={this.handleClickOrderBy('rating')}>Rating</Button>
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

          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={this.state.hasMore}
            loader={<div className="loader" key={0}>Loading ...</div>}
          >
            <Grid container spacing={16}>
              {
                _.isEmpty(businessList) ? <Grid item xs={12}><Typography type="headline" align="center">None</Typography></Grid> :
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
                          rating={item.ratingAverage}
                          thumbnailUri={item.thumbnailUri}
                          isFavor={!_.isUndefined(index) && index > -1 ? true : false}
                        />
                      </Grid>
                    );
                  })
              }
            </Grid>
          </InfiniteScroll>
        </div>
      </Container>
    )
  }

}

SearchPage.propTypes = {
  "classes": PropTypes.object.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "businessList": state.businessReducer.businessList,
    "totalCount": state.businessReducer.totalCount,
    "categories": state.categoryReducer.categoriesList,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getBusinessList })(withStyles(styles)(SearchPage));
