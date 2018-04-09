import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import { FormControl, FormGroup, FormControlLabel, FormHelperText } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui-icons/Search';
import Checkbox from 'material-ui/Checkbox';

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
      "rowsPerPage": 10,
      "page": 0,
      "search": '',

      // User role check states
      "role": {
        "regular": false,
        "manager": false,
        "admin": false,
      },

      // User status check states
      "userStatus": {
        "normal": false,
        "suspended": false,
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    this.props.getUsersList(this.state.rowsPerPage, 0).then(response => {
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

  handlePaginationChange(e, page) {
    this.props.getUsersList(this.state.rowsPerPage, page * this.state.rowsPerPage).then(response => {
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
    this.props.getUsersList(e.target.value, this.state.page * e.target.value).then(response => {
      if (response.users) {
        this.setState({
          rowsPerPage: e.target.value,
          users: response.users,
          totalCount: response.totalCount,
        });
      }
    });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  handleFilter(e) {
    const { value } = e.target;
    const { role, userStatus } = this.state

    switch (value) {
      case "regular":
        role.regular = !role.regular
        break;

      case "manager":
        role.manager = !role.manager
        break;

      case "admin":
        role.admin = !role.admin
        break;

      case "normal":
        userStatus.normal = !userStatus.normal;
        break;

      case "suspended":
        userStatus.suspended = !userStatus.suspended;
        break;

      default:
        break;
    }

    this.props.getUsersList(this.state.rowsPerPage, this.state.page * this.state.rowsPerPage, {
      role: role,
      userStatus: userStatus,
    }, this.state.search)
    .then(response => {
      if (response.users) {
        this.setState({
          role: role,
          userStatus: userStatus,
          users: response.users,
          totalCount: response.totalCount,
        });
      }
    });
  }

  handleSearch(e) {
    e.preventDefault();

    this.props.getUsersList(this.state.rowsPerPage, this.state.page * this.state.rowsPerPage, {
      role: this.state.role,
      userStatus: this.state.userStatus,
    }, this.state.search)
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
            <Grid item xs={6}>
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

            <Grid item xs={3}>
              <Typography type="subheading">Role</Typography>
              <FormGroup row>
                <FormControlLabel control={
                    <Checkbox
                      checked={this.state.role.regular}
                      onChange={this.handleFilter}
                      value="regular"
                    />
                  }
                  label="Regular"
                />
                <FormControlLabel control={
                    <Checkbox
                      checked={this.state.role.manager}
                      onChange={this.handleFilter}
                      value="manager"
                    />
                  }
                  label="Manager"
                />
                <FormControlLabel control={
                    <Checkbox
                      checked={this.state.role.admin}
                      onChange={this.handleFilter}
                      value="admin"
                    />
                  }
                  label="Admin"
                />
              </FormGroup>
            </Grid>

            <Grid item xs={3}>
              <Typography type="subheading">Status</Typography>
              <FormGroup row>
                <FormControlLabel control={
                    <Checkbox
                      checked={this.state.userStatus.normal}
                      onChange={this.handleFilter}
                      value="normal"
                    />
                  }
                  label="Nornaml"
                />
                <FormControlLabel control={
                    <Checkbox
                      checked={this.state.userStatus.suspended}
                      onChange={this.handleFilter}
                      value="suspended"
                    />
                  }
                  label="Suspended"
                />
              </FormGroup>
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
                          "user": user
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
