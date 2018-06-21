import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Switch from '@material-ui/core/Switch';

// Custom Components
import Container from './layout/Container';
import BusinessCard from './utils/BusinessCard';
import { loadFromStorage } from '../helpers/webStorage';
import webStorageTypes from '../constants/webStorage.types';
import Areas from '../constants/nanjing.areas';

// Actions
import { getBusinessList, clearBusinessList } from '../actions/business.actions.js';
import { getCategoriesList } from '../actions/category.actions.js';

const styles = theme => ({});

class BusinessListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "limit": 24,
      "area": '',
      "category": '',
      "orderBy": '',
      "event": false,
      "hasMore": false,
      "count": 0,
    };

    if (!_.isEmpty(this.props.match.params.slug)) {
      this.state.category = this.props.match.params.slug;
    }

    this.state.myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR);

    this.handleClickArea = this.handleClickArea.bind(this);
    this.handleClickOrderBy = this.handleClickOrderBy.bind(this);
    this.handleEventSwitch = this.handleEventSwitch.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.props.getCategoriesList();

    this.props.getBusinessList({
      limit: this.state.limit,
      filter: {
        category: this.state.category,
      }
    })
    .then(response => {
      if (response) {
        this.setState({
          count: this.state.limit,
          hasMore: this.state.limit < this.props.totalCount
        });
      }
    });
  }

  componentWillUnmount() {
    this.props.clearBusinessList();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      this.props.getBusinessList({
        limit: this.state.limit,
        filter: {
          category: this.props.match.params.slug,
          area: this.state.area,
          event: this.state.event,
        },
        orderBy: this.state.orderBy
      })
      .then(response => {
        if (response) {
          this.setState({
            category: this.props.match.params.slug,
            count: this.state.limit,
            hasMore: this.state.limit < this.props.totalCount
          });
        }
      });
    }
  }

  handleClickArea = code => e => {
    if (this.state.area !== code) {
      this.props.getBusinessList({
        limit: this.state.limit,
        filter: {
          category: this.state.category,
          area: code,
          event: this.state.event,
        },
        orderBy: this.state.orderBy
      })
      .then(response => {
        if (response) {
          this.setState({
            area: code,
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
          category: this.state.category,
          area: this.state.area,
          event: this.state.event,
        },
        orderBy: item
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
        category: this.state.category,
        area: this.state.area,
        event: !this.state.event,
      },
      orderBy: this.state.orderBy
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
          category: this.state.category,
          area: this.state.area,
          event: this.state.event,
        },
        search: this.state.search,
        orderBy: this.state.orderBy,
    }).then((response => {
        this.setState({
          count: this.state.count + this.state.limit,
          hasMore: this.state.count + this.state.limit < this.props.totalCount
        });
      }));
    }
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
        <Button color="primary" variant={this.state.category === item.enName ? 'raised' : 'text'}>{item.krName}</Button>
      </Link>
    ));

    const areasList = Areas.map((item, i) =>
      <Button color="primary" variant={this.state.area === item.code ? 'raised' : 'text'} key={i} onClick={this.handleClickArea(item.code)}>{item.cnName + '-' + item.pinyin}</Button>
    );

    return (
      <Container>
        <div>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <Typography variant="title" gutterBottom>Category</Typography>
              {categoryList}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="title" gutterBottom>District</Typography>
              <Button color="primary" variant={!this.state.area ? 'raised' : 'text'} onClick={this.handleClickArea('')}>All</Button>
              {areasList}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="title" gutterBottom>Order by</Typography>
              <Button
                color="primary"
                variant={_.isEmpty(this.state.orderBy) ? 'raised' : 'text'}
                onClick={this.handleClickOrderBy('')}
              >
                Recommend
              </Button>
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
                _.isEmpty(businessList)
                ? <Grid item xs={12}><Typography variant="headline" align="center">None</Typography></Grid>
                : businessList.map(item => {
                    if (!_.isEmpty(this.state.myFavors)) {
                      index = this.state.myFavors.indexOf(item._id);
                    }

                    return (
                      <Grid item xs={3} key={item._id}>
                        <BusinessCard
                          history={this.props.history}
                          key={item._id}
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
          </InfiniteScroll>
        </div>
      </Container>
    );
  }
}

BusinessListPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "businessList": PropTypes.array.isRequired,
  "totalCount": PropTypes.number.isRequired,
  "categories": PropTypes.array.isRequired,
  "isFetching": PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "businessList": state.businessReducer.businessList,
    "totalCount": state.businessReducer.totalCount,
    "categories": state.categoryReducer.categoriesList,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getBusinessList, getCategoriesList, clearBusinessList })(withStyles(styles)(BusinessListPage));
