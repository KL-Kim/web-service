import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';


// Custom Components
import Container from './layout/Container';
import SearchPageBusinessSection from './sections/SearchPageBusinessSection';
import SearchPageSearchBar from './sections/SearchPageSearchBar';

// Actions
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions';

// WebStorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

// Helpers
import searchCategoryOrTag from 'js/helpers/searchCategoryOrTag';
import saveSearchHistory from 'js/helpers/saveSearchHistory';

// Common Style
import { root, chip, chipBar } from 'assets/jss/common.style';

const queries = [
  '꼬치',
  '삼계탕',
  '병원',
  '수리',
  '이따바',
];

const styles = theme => ({
  "root": root(theme),
  "chip": chip(theme),
  "chipBar": chipBar(theme),
  "section": {
    marginBottom: theme.spacing.unit * 4,
  },
  "paper": {
    padding: theme.spacing.unit * 2,
  },
  "popoverContainer": {
    maxWidth: 400,
    padding: theme.spacing.unit * 2,
  },
  "divider": {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "searchedQuery": '',
      "categories": [],
      "selectedCategory": '',
      "areas": [],
      "area": {},
      "orderBy": '',
      "event": false,
      "originalArea:": {},
      "originalOrderBy": '',
      "originalEvent": false,
      "filterPopoverOpen": false,
      "searchCategoryResponse": [],
      "searchTagResponse": [],
      "searchHistory": [],
    };

    this.handleClickQuery = this.handleClickQuery.bind(this);
  }

  componentDidMount() {
    const searchHistory = loadFromStorage(webStorageTypes.WEB_STORAGE_SEARCH_HISTORY) || [];

    if (!isEmpty(searchHistory)) {
      this.setState({
        searchHistory: [...searchHistory.reverse()],
      });
    }
  }

  saveSearchedQuery = query => {
    this.setState({
      searchedQuery: query
    });

    saveSearchHistory(query);
  }

  handleClickQuery = query => e => {
    if (query) {
      this.props.getBusinessList({
        search: query,
      });

      this.saveSearchedQuery(query);
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Container>
        <div className={classes.root}>
          <div className={classes.section}>
            <Paper className={classes.paper}>
              <SearchPageSearchBar 
                searchedQuery={this.state.searchedQuery} 
                onSearch={this.saveSearchedQuery} 
                getBusinessList={this.props.getBusinessList}
              />
            </Paper>
          </div>

          {
            this.state.searchedQuery
              ? null
              : <div className={classes.section}>
                  <Grid container spacing={16}>
                    <Grid item xs={12} sm={6}>
                      <Paper>
                        <List subheader={<ListSubheader component="div">Popular Searches</ListSubheader> }>
                          {
                            queries.map((item, index) => (
                              <ListItem key={index} button onClick={this.handleClickQuery(item)}>
                                <ListItemText primary={item} />
                              </ListItem>
                            ))
                          }
                        </List>
                      </Paper>
                    </Grid>

                    {
                      isEmpty(this.state.searchHistory)
                        ? null
                        : <Grid item xs={12} sm={6}>
                            <Paper>
                                <List subheader={<ListSubheader component="div">Recent Searches</ListSubheader> }>
                                  {
                                    this.state.searchHistory.map((item, index) => (
                                      <ListItem key={index} button onClick={this.handleClickQuery(item)}>
                                        <ListItemText primary={item} />
                                      </ListItem>
                                    ))
                                  }
                                </List>
                              </Paper>
                          </Grid>
                    }
                  </Grid>
                </div>
          }

          {
            this.props.totalCount === 0 && this.props.isFetching
              ? <div style={{ textAlign: 'center' }} key={0}>
                  <CircularProgress size={30} />
                </div>
              : null
          }

          {
            this.props.getEmptyList
              ? <Paper className={classes.paper}>
                  <Typography align="center">Sorry, you can search another word</Typography>
                </Paper>
              : null
          }

          {
            this.props.totalCount === 0 || isEmpty(this.state.searchedQuery)
              ? null
              : <div>
                  <SearchPageBusinessSection searchedQuery={this.state.searchedQuery} />
                </div>
          }
        </div>
      </Container>
    );
  }
}

SearchPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "totalCount": PropTypes.number.isRequired,
  "getEmptyList": PropTypes.bool.isRequired,

  // Methods
  "getBusinessList": PropTypes.func.isRequired,
  "clearBusinessList": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "isFetching": state.businessReducer.isFetching,
    "totalCount": state.businessReducer.totalCount,
    "getEmptyList": state.businessReducer.getEmptyList,
  };
};

export default connect(mapStateToProps, {
  getBusinessList,
  clearBusinessList,
})(withStyles(styles)(SearchPage));
