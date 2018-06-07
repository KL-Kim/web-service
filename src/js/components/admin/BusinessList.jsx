import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import { FormControl, FormControlLabel, FormLabel } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui-icons/Search';
import Button from 'material-ui/Button';
import Switch from 'material-ui/Switch';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Badge from 'material-ui/Badge';

import SettingContainer from '../setting/SettingContainer';
import LinkContainer from '../utils/LinkContainer';
import TablePaginationActions from '../utils/TablePaginationActions';
import { getBusinessListByAdmin, clearBusinessList } from '../../actions/business.actions.js';

const styles = (theme) => ({
  "container": {
    marginBottom: theme.spacing.unit,
  },
  "buttonContainer": {
    "display": "flex",
    "justifyContent": "flex-end",
  },
  "title": {
    paddingRight: theme.spacing.unit * 2,
  },
});

class BusinessList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "search": '',
      "rowsPerPage": 10,
      "page": 0,
      "state": '',
      "event": false,
      "reports": false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleEventSwitch = this.handleEventSwitch.bind(this);
    this.handleReportSwitch = this.handleReportSwitch.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  componentDidMount() {
    this.props.getBusinessListByAdmin({
      limit: this.state.rowsPerPage,
      filter: {
      "state": ''
      },
    });
  }

  componentWillUnmount() {
    this.props.clearBusinessList();
  }

  handlePaginationChange(e, page) {
    const { rowsPerPage, state, search, reports, event } = this.state;

    this.props.getBusinessListByAdmin({
      skip: page * rowsPerPage,
      limit: rowsPerPage,
      filter: {
        "state": state,
        "event": event,
        "reports": reports,
      },
      search: search
    })
    .then(response => {
      if (response) {
        this.setState({
          page: page,
        });
      }
    });
  }

  handleChangeRowsPerPage(e) {
    const { page, state, search, reports, event } = this.state;

    this.props.getBusinessListByAdmin({
      skip: page * e.target.value,
      limit: e.target.value,
      filter: {
        "state": state,
        "event": event,
        "reports": reports,
      },
      search: search
    })
    .then(response => {
      if (response) {
        this.setState({
          rowsPerPage: e.target.value,
        });
      }
    });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  handleEventSwitch(e) {
    const { page, rowsPerPage, state, search, reports } = this.state;
    const checked = e.target.checked;

    this.props.getBusinessListByAdmin({
      skip: page * rowsPerPage,
      limit: rowsPerPage,
      filter: {
      "state": state,
      "event": checked,
      "reports": reports,
      },
      search: search
    })
    .then(response => {
      if (response) {
        this.setState({
          "event": checked
        });
      }
    });
  }

  handleReportSwitch(e) {
    const { page, rowsPerPage, state, search, event } = this.state;
    const checked = e.target.checked;

    this.props.getBusinessListByAdmin({
      skip: page * rowsPerPage,
      limit: rowsPerPage,
      filter: {
        "state": state,
        "event": event,
        "reports": checked
      },
      search: search,
    })
    .then(response => {
      if (response) {
        this.setState({
          "reports": checked
        });
      }
    })
  }

  handleChangeState(e) {
    const { value } = e.target;
    const { page, rowsPerPage, event, reports, search } = this.state

    this.props.getBusinessListByAdmin({
      skip: page * rowsPerPage,
      limit: rowsPerPage,
      filter: {
        "state": value,
        "event": event,
        "reports": reports,
      },
      search: search
    })
    .then(response => {
      if (response) {
        this.setState({
          state: value,
          event: event,
        });
      }
    });
  }

  handleSearch(e) {
    e.preventDefault();
    const { page, rowsPerPage, state, event, search } = this.state;

    this.props.getBusinessListByAdmin({
      skip: page * rowsPerPage,
      limit: rowsPerPage,
      filter: {
        state,
        event
      },
      search: search
    });
  }

  render() {
    const { classes, admin, businessList } = this.props;

    return (
      <SettingContainer>
        <div>
          <Typography type="display1" gutterBottom>
            Business List
          </Typography>

          <Grid container spacing={16} className={classes.container}>
            <Grid item xs={3}>
              <form onSubmit={this.handleSearch}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="search">Search</InputLabel>
                  <Input
                    type="text"
                    id="search"
                    name="search"
                    onChange={this.handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="Searching"
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
          </Grid>

          <Grid container>
            <Grid item xs={4}>
              <FormControl fullWidth >
                <FormLabel component="label">State</FormLabel>
                <RadioGroup
                  row
                  aria-label="State"
                  name="state"
                  value={this.state.state}
                  onChange={this.handleChangeState}
                >
                  <FormControlLabel value="" control={<Radio />} label="All" />
                  <FormControlLabel value="published" control={<Radio />} label="Published" />
                  <FormControlLabel value="draft" control={<Radio />} label="Draft" />
                  <FormControlLabel value="trash" control={<Radio />} label="Trash" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={2}>
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

            <Grid item xs={2}>
              <FormControl fullWidth >
                <FormLabel component="label">Reports</FormLabel>
                <Switch
                  color="primary"
                  checked={this.state.reports}
                  onChange={this.handleReportSwitch}
                  value="event"
                  />
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <div className={classes.buttonContainer}>
                <LinkContainer to={{
                    pathname: "/admin/business/new",
                    hash: '#',
                    state: {
                      "admin": admin,
                    }
                  }}
                >
                  <Button raised color="primary" aria-label="add" size="large" onClick={this.handleAddNew}>
                    Add New
                  </Button>
                </LinkContainer>
              </div>
            </Grid>
          </Grid>

          <Paper>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Index</TableCell>
                  <TableCell>中文名</TableCell>
                  <TableCell>한국어</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Month Views Count</TableCell>
                  <TableCell>Total Views Count</TableCell>
                  <TableCell>State</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  _.isEmpty(businessList) ? (<TableRow></TableRow>)
                  : businessList.map((business, index) => (
                    <LinkContainer to={{
                        pathname: "/admin/business/" + business.cnName,
                        hash: '#',
                        state: {
                          "admin": admin,
                          "businessId": business._id
                        }
                      }} key={index}
                    >
                      <TableRow hover >
                        <TableCell>{index+1}</TableCell>
                        <TableCell>
                          {
                            (business.reports.length > 0)
                              ? <Badge color="secondary" badgeContent={business.reports.length}>
                                  <Typography type="body1" className={classes.title}>
                                    {business.cnName}
                                  </Typography>
                                </Badge>
                              : business.cnName
                          }
                        </TableCell>
                        <TableCell>{business.krName}</TableCell>
                        <TableCell>{business.priority}</TableCell>
                        <TableCell>{_.isEmpty(business.category) ? '' : business.category.krName}</TableCell>
                        <TableCell>{business.monthViewsCount}</TableCell>
                        <TableCell>{business.viewsCount}</TableCell>
                        <TableCell>{_.upperFirst(business.state)}</TableCell>
                      </TableRow>
                    </LinkContainer>
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
        </div>
      </SettingContainer>
    );
  }
}

BusinessList.propTypes = {
  "classes": PropTypes.object.isRequired,
  "history": PropTypes.object.isRequired,
  "admin": PropTypes.object.isRequired,
  "getBusinessListByAdmin": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
    "businessList": state.businessReducer.businessList,
    "totalCount": state.businessReducer.totalCount,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getBusinessListByAdmin, clearBusinessList })(withStyles(styles)(BusinessList));
