import React, { Component } from 'react';
import PropTypes from 'prop-types';
import qs from 'querystring';
import { connect } from 'react-redux';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

// Custom Components
import Container from './layout/Container';
import BusinessCard from './utils/BusinessCard';

// Actions
import { getBusinessList } from '../actions/business.actions.js';

// WebStorage
import { loadFromStorage } from '../helpers/webStorage';
import webStorageTypes from '../constants/webStorage.types';

const styles = theme => ({});

class SearchPage extends Component {
  constructor(props) {
    super(props);

    const parsed = qs.parse(props.location.search.slice(1));

    this.state = {
      "limit": 12,
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

    this.state.myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

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
          const categoryIds = [];
          const areas = [];
          const areaIds = [];
          let cIndex, aIndex;

          response.list.map(business => {
            cIndex = categoryIds.indexOf(business.category._id);

            if (cIndex < 0) {
              categories.push(business.category);
              categoryIds.push(business.category._id);
            }

            aIndex = areaIds.indexOf(business.address.area.code)

            if (aIndex < 0) {
              areaIds.push(business.address.area.code);
              areas.push(business.address.area);
            }


            return '';
          });

          this.setState({
            categories: categories.slice(),
            areas: areas.slice(),
            count: response.list.length,
            hasMore: response.list.length < this.props.totalCount
          });
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      const parsed = qs.parse(this.props.location.search.slice(1));

      this.props.getBusinessList({
        limit: this.state.limit,
        search: parsed.s,
      })
      .then(response => {
        if (response) {
          const categories = [];
          const categoryIds = [];
          const areas = [];
          const areaIds = [];
          let cIndex, aIndex;

          response.list.map(business => {
            cIndex = categoryIds.indexOf(business.category._id);

            if (cIndex < 0) {
              categories.push(business.category);
              categoryIds.push(business.category._id);
            }

            aIndex = areaIds.indexOf(business.address.area.code)

            if (aIndex < 0) {
              areaIds.push(business.address.area.code);
              areas.push(business.address.area);
            }

            return '';
          });

          this.setState({
            s: parsed.s,
            categories: categories.slice(),
            areas: areas.slice(),
            count: response.list.length,
            hasMore: response.list.length < this.props.totalCount
          });
        }
      });

    }
  }

  handleClickCategory = slug => e => {
    if (this.state.categorySlug !== slug) {
      this.props.getBusinessList({
        limit: this.state.limit,
        category: slug,
        area: this.state.areaCode,
        event: this.state.event,
        orderBy: this.state.orderBy,
        search: this.state.s,
      })
      .then(response => {
        if (response) {
          this.setState({
            categorySlug: slug,
            count: response.list.length,
            hasMore: response.list.length < this.props.totalCount
          });
        }
      });
    }
  }

  handleClickArea = code => e => {
    if (this.state.areaCode !== code) {
      this.props.getBusinessList({
        limit: this.state.limit,
        category: this.state.categorySlug,
        area: code,
        event: this.state.event,
        orderBy: this.state.orderBy,
        search: this.state.s,
      })
      .then(response => {
        if (response) {
          this.setState({
            areaCode: code,
            count: response.list.length,
            hasMore: response.list.length < this.props.totalCount
          });
        }
      });
    }
  }

  handleClickOrderBy = item => e => {
    if (this.state.orderBy !== item) {
      this.props.getBusinessList({
        limit: this.state.limit,
        category: this.state.categorySlug,
        area: this.state.area,
        event: this.state.event,
        orderBy: item,
        search: this.state.s,
      })
      .then(response => {
        if (response) {
          this.setState({
            orderBy: item,
            count: response.list.length,
            hasMore: response.list.length < this.props.totalCount
          });
        }
      });
    }
  }

  handleEventSwitch() {
    this.props.getBusinessList({
      limit: this.state.limit,
      category: this.state.categorySlug,
      area: this.state.area,
      event: !this.state.event,
      orderBy: this.state.orderBy,
      search: this.state.s,
    })
    .then(response => {
      if (response) {
        this.setState({
          count: response.list.length,
          hasMore: response.list.length < this.props.totalCount
        });
      }
    });

    this.setState({
      event: !this.state.event,
    })
  }

  loadMore() {
    if (this.state.count < this.props.totalCount) {
      this.props.getBusinessList({
        limit: this.state.count + this.state.limit,
        category: this.state.categorySlug,
        area: this.state.areaCode,
        event: this.state.event,
        search: this.state.s,
        orderBy: this.state.orderBy,
    })
    .then((response => {
        this.setState({
          count: response.list.length,
          hasMore: response.list.length < this.props.totalCount
        });
      }));
    }
  }

  render() {
    const { classes, businessList } = this.props;

    return (
      <Container>
        <div>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Typography variant="display1" gutterBottom>Search: {this.state.s}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="title" gutterBottom>Category</Typography>
              <Button color="primary" variant={this.state.categorySlug ? 'text' : 'raised'} onClick={this.handleClickCategory('')}>All</Button>
              {
                _.isEmpty(this.state.categories) ? ''
                  : this.state.categories.map((item) =>
                    <Button key={item._id}
                      color="primary"
                      variant={this.state.categorySlug === item.enName ? 'raised' : 'text'}
                      onClick={this.handleClickCategory(item.enName)}
                    >
                      {item.krName}
                    </Button>
                  )
              }
            </Grid>
            <Grid item xs={12}>
              <Typography variant="title" gutterBottom>District</Typography>
              <Button color="primary" variant={!this.state.areaCode ? 'raised' : 'text'} onClick={this.handleClickArea('')}>All</Button>
              {
                _.isEmpty(this.state.areas) ? ''
                  : this.state.areas.map((item) =>
                    <Button key={item._id}
                      color="primary"
                      variant={this.state.areaCode === item.code ? 'raised' : 'text'}
                      onClick={this.handleClickArea(item.code)}
                    >
                      {item.name}
                    </Button>
                  )
              }
            </Grid>
            <Grid item xs={12}>
              <Typography variant="title" gutterBottom>Order by</Typography>
              <Button color="primary" variant={_.isEmpty(this.state.orderBy) ? 'raised' : 'text'} onClick={this.handleClickOrderBy('')}>Recommend</Button>
              <Button color="primary" variant={this.state.orderBy === 'rating' ? 'raised' : 'text'} onClick={this.handleClickOrderBy('rating')}>Rating</Button>
              <Button color="primary" variant={this.state.orderBy === 'new' ? 'raised' : 'text'} onClick={this.handleClickOrderBy('new')}>New</Button>
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
                _.isEmpty(businessList) ? <Grid item xs={12}><Typography variant="headline" align="center">None</Typography></Grid> :
                  businessList.map(item => (
                      <Grid item xs={3} key={item._id}>
                        <BusinessCard
                          key={item._id}
                          bid={item._id}
                          title={item.krName}
                          enName={item.enName}
                          rating={item.ratingAverage}
                          thumbnailUri={item.thumbnailUri}
                          myFavors={this.state.myFavors}
                        />
                      </Grid>
                    ))
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
