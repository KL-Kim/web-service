import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import { FormControl, FormGroup, FormControlLabel, FormHelperText, FormLabel } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui-icons/Search';
import Checkbox from 'material-ui/Checkbox';
import Radio, { RadioGroup } from 'material-ui/Radio';

import SettingContainer from '../setting/SettingContainer';
import LinkContainer from '../utils/LinkContainer';
import TablePaginationActions from '../utils/TablePaginationActions';
import { getUsersList, adminEditUser } from '../../actions/admin.actions.js';

const styles = (theme) => ({});

class UsersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "users": null,
      "totalCount": 0,
      "rowsPerPage": 20,
      "page": 0,
      "search": '',
      "role": '',
      "status": ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleFilterRole = this.handleFilterRole.bind(this);
    this.handleFilterStatus = this.handleFilterStatus.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.props.getUsersList({
      limit: this.state.rowsPerPage,
    })
    .then(response => {
      if (response.users) {
        this.setState({
          users: response.users,
          totalCount: response.totalCount,
        });
      }
    });
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (_.isEmpty(nextProps.admin) && (nextProps.admin.role !== 'admin')) {
      this.props.history.push('/404');
    }
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    })
  }

  handlePaginationChange(e, page) {
    this.props.getUsersList({
      skip: page * this.state.rowsPerPage,
      limit: this.state.rowsPerPage
    }).then(response => {
        if (response.users) {
          this.setState({
            page: page,
            users: response.users,
            totalCount: response.totalCount,
          });
        }
      });
  }

  handleChangeRowsPerPage(e) {
    this.props.getUsersList({
      skip: this.state.page * e.target.value,
      limit: e.target.value
    }).then(response => {
        if (response.users) {
          this.setState({
            rowsPerPage: e.target.value,
            users: response.users,
            totalCount: response.totalCount,
          });
        }
      });
  }

  handleFilterRole(e) {
    const { value } = e.target;

    this.props.getUsersList({
      skip: this.state.page * this.state.rowsPerPage,
      limit: this.state.rowsPerPage,
      role: value,
      status: this.state.status,
      search: this.state.search
    })
    .then(response => {
      if (response.users) {
        this.setState({
          role: value,
          users: response.users,
          totalCount: response.totalCount,
        });
      }
    });
  }

  handleFilterStatus(e) {
    const { value } = e.target;

    this.props.getUsersList({
      skip: this.state.page * this.state.rowsPerPage,
      limit: this.state.rowsPerPage,
      role: this.state.role,
      status: value,
      search: this.state.search
    })
    .then(response => {
      if (response.users) {
        this.setState({
          status: value,
          users: response.users,
          totalCount: response.totalCount,
        });
      }
    });
  }

  handleSearch(e) {
    e.preventDefault();

    this.props.getUsersList({
      limit: this.state.rowsPerPage,
      role: this.state.role,
      status: this.state.status,
      search: this.state.search
    })
    .then(response => {
      if (response.users) {
        this.setState({
          users: response.users,
          totalCount: response.totalCount,
        });
      }
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <SettingContainer>
        <div>
          <Typography type="display1" gutterBottom>
            Users List
          </Typography>

          <Grid container spacing={16}>
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
                  <FormHelperText id="search-helper-text">Email or Username</FormHelperText>
                </FormControl>
              </form>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth >
                <FormLabel component="label">Role</FormLabel>
                <RadioGroup
                  row
                  aria-label="Role"
                  name="role"
                  value={this.state.role}
                  onChange={this.handleFilterRole}
                >
                  <FormControlLabel value="" control={<Radio />} label="All" />
                  <FormControlLabel value="regular" control={<Radio />} label="Regular" />
                  <FormControlLabel value="writer" control={<Radio />} label="Writer" />
                  <FormControlLabel value="manager" control={<Radio />} label="Manager" />
                  <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth >
                <FormLabel component="label">User Status</FormLabel>
                <RadioGroup
                  row
                  aria-label="Status"
                  name="status"
                  value={this.state.status}
                  onChange={this.handleFilterStatus}
                >
                  <FormControlLabel value="" control={<Radio />} label="All" />
                  <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                  <FormControlLabel value="suspended" control={<Radio />} label="Suspended" />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>

          <Paper>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Index</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { _.isEmpty(this.state.users) ? (<TableRow></TableRow>)
                  : this.state.users.map((user, index) => (
                    <LinkContainer to={{
                        pathname: "/admin/user/" + user.username,
                        hash: '#',
                        state: {
                          "admin": this.props.admin,
                          "userId": user._id
                        }
                      }} key={index}
                    >
                      <TableRow hover >
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.userStatus}</TableCell>
                      </TableRow>
                    </LinkContainer>
                  ))
                }
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    colSpan={3}
                    count={this.state.totalCount}
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

UsersList.propTypes = {
  "classes": PropTypes.object.isRequired,
  "admin": PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
  };
};

export default connect(mapStateToProps, { getUsersList, adminEditUser })(withStyles(styles)(UsersList));
