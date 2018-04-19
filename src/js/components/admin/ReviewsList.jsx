import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui-icons/Search';

import SettingContainer from '../setting/SettingContainer';
import TablePaginationActions from '../utils/TablePaginationActions';
import { getReviews, clearReviewsList } from '../../actions/review.actions';

const styles = (theme) => ({
});

class ReviewsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "rowsPerPage": 20,
      "page": 0,
      "search": '',
    };

    this.handleRowClick = this.handleRowClick.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.props.getReviews(0, this.state.rowsPerPage, {
      "orderBy": "new"
    });
  }

  componentWillUnmount() {
    this.props.clearReviewsList();
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  handleRowClick() {
    console.log("Click the row");
  }

  handlePaginationChange(e, page) {
    this.props.getReviews(this.state.rowsPerPage, page * this.state.rowsPerPage, {
      "orderBy": "new"
    }, this.state.search)
      .then(response => {
        this.setState({
          page: page,
        });
      });
  }

  handleChangeRowsPerPage(e) {
    this.props.getReviews(e.target.value, this.state.page * e.target.value, {
      "orderBy": "new"
    }, this.state.search).then(response => {
      if (response) {
        this.setState({
          rowsPerPage: e.target.value,
        });
      }
    });
  }

  handleSearch(e) {
    e.preventDefault();

    this.props.getReviews(this.state.page, this.state.rowsPerPage, {
      "orderBy": "new"
    }, this.state.search);
  }

  render() {
    const { classes, reviews } = this.props;

    return (
      <SettingContainer>
        <Grid container className={classes.root} spacing={16}>
          <Grid item xs={12}>
            <Typography type="display3" gutterBottom>
              Reviews List
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <form onSubmit={this.handleSearch}>
              <FormControl fullWidth>
                <InputLabel htmlFor="adornment-password">Search</InputLabel>
                <Input
                  id="search"
                  type="text"
                  name="search"
                  onChange={this.handleChange}
                  onKeyPress={this.handleKeyPress}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={this.handleSearch}
                      >
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </form>
          </Grid>

          <Grid item xs={12}>
            <Paper>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Business</TableCell>
                    <TableCell>Content</TableCell>
                    <TableCell>Quality</TableCell>
                    <TableCell>Up Vote</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    _.isEmpty(reviews) ? (<TableRow></TableRow>)
                    : reviews.map((review, index) => (

                        <TableRow hover key={index}
                          onClick={event => this.handleRowClick(event, review)}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{review.userId}</TableCell>
                          <TableCell>{review.businessId}</TableCell>
                          <TableCell>{review.content}</TableCell>
                          <TableCell>{review.quality}</TableCell>
                          <TableCell>{review.upVote.length}</TableCell>
                        </TableRow>
                    ))
                  }
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      colSpan={3}
                      count={this.props.totalCount}
                      rowsPerPage={this.state.rowsPerPage}
                      rowsPerPageOptions={[10, 20, 30]}
                      page={this.state.page}
                      onChangePage={this.handlePaginationChange}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      Actions={TablePaginationActions}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </SettingContainer>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "updatedAt": state.userReducer.updatedAt,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "reviews": state.reviewReducer.reviews,
    "totalCount": state.reviewReducer.totalCount,
    "error": state.reviewReducer.error,
  };
};

export default connect(mapStateToProps, { getReviews, clearReviewsList })(withStyles(styles)(ReviewsList));
