import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';

// Custom Components
import Container from './layout/Container';
import SearchPageBusinessSection from './sections/SearchPageBusinessSection';
import SearchPageSearchBar from './sections/SearchPageSearchBar';
import LoadingProgress from 'js/components/utils/LoadingProgress';

// Actions
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions';

// Helpers
import { saveHistory, loadHistory } from 'js/helpers/SearchHistory';

// Common Style
import { root } from 'assets/jss/common.style';

const queries = [
  '꼬치',
  '삼계탕',
  '병원',
  '수리',
  '이따바',
];

const styles = theme => ({
  "root": root(theme),
  "section": {
    marginBottom: theme.spacing.unit * 4,
  },
  "paper": {
    padding: theme.spacing.unit * 2,
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
    const searchHistory = loadHistory();

    if (!isEmpty(searchHistory)) {
      this.setState({
        searchHistory: [...searchHistory.reverse()],
      });
    }
  }

  componentWillUnmount() {
    this.props.clearBusinessList();
  }

  saveSearchedQuery = query => {
    this.setState({
      searchedQuery: query
    });

    saveHistory(query);
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
            this.state.searchedQuery && this.props.isFetching
              ? <LoadingProgress isLoading={this.props.isFetching} />
              : null
          }

          {
            this.state.searchedQuery && this.props.getEmptyList
              ? <div className={classes.section}>
                  <Paper className={classes.paper}>
                    <Typography variant="body2" align="center">Sorry, we could not find business matching '{this.state.searchedQuery}'</Typography>
                  </Paper>
                </div>
              : null
          }
          
          {
            this.state.searchedQuery && this.props.totalCount > 0 
              ? <div className={classes.section}>
                  <SearchPageBusinessSection searchedQuery={this.state.searchedQuery} />
                </div>
              : null
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
