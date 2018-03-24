import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import { FormControl, FormGroup, FormControlLabel } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Select from 'material-ui/Select';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui-icons/Search';
import Checkbox from 'material-ui/Checkbox';

import SettingContainer from '../SettingContainer';
import LinkContainer from '../../utils/LinkContainer';
import { getUsersList, adminEditUser } from '../../../actions/admin.actions.js';
import TablePaginationActions from '../../utils/TablePaginationActions';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '40%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class UsersList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
      totalCount: 0,

      rowsPerPage: 10,
      page: 0,

      check: {
        role: true,
        status: true,
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    // if (_.isEmpty(this.props.user) || (this.props.user.role !== 'admin')) {
    //   this.props.history.push('/404');
    // } else {
    //   let rowsPerPage = 10;
    //   let skip = 0;
    //   this.props.getUsersList(rowsPerPage, skip).then(usersList => {
    //     if (usersList) {
    //       this.setState({
    //         users: usersList
    //       });
    //     }
    //   });
    // }

    // For sake of convenience

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
    // if (_.isEmpty(nextProps.user) || (nextProps.user.role !== 'admin')) {
    //   this.props.history.push('/404');
    // }
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
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

  handleSubmit = id => (e) => {
    const { role, userStatus } = this.state;

    const data = {
      id: id,
    };

    if (role) data.role = role;
    if (userStatus) data.userStatus = userStatus;

    if (role || userStatus)
      this.props.adminEditUser(this.props.user._id, data);
  }

  handleSearch(e) {
    e.preventDefault();

    console.log("Clicked the search button");
  }


  render() {
    const { classes, history } = this.props;
    const { expanded } = this.state;

    return (
      <SettingContainer history={history} >
        <Grid container className={classes.root} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography type="display3" gutterBottom>
              Users List
            </Typography>
            <form onSubmit={this.handleSearch}>
              <FormControl fullWidth>
                <InputLabel htmlFor="adornment-password">Search</InputLabel>
                <Input
                  id="search"
                  type="text"
                  value={this.state.search}
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
            <Grid container spacing={16}>
              <Grid item xs={4}>
                <Typography type="display1">Role</Typography>
                <FormGroup row>
                  <FormControlLabel control={
                      <Checkbox
                        checked={this.state.check.role}
                        onChange={this.handleChange}
                        value="regular"
                      />
                    }
                    label="Regular"
                  />
                  <FormControlLabel control={
                      <Checkbox
                        checked={this.state.check.role}
                        onChange={this.handleChange}
                        value="manager"
                      />
                    }
                    label="Manager"
                  />
                  <FormControlLabel control={
                      <Checkbox
                        checked={this.state.check.role}
                        onChange={this.handleChange}
                        value="admin"
                      />
                    }
                    label="Admin"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={4}>
                <Typography type="display1">Status</Typography>
                <FormGroup row>
                  <FormControlLabel control={
                      <Checkbox
                        checked={this.state.check.status}
                        onChange={this.handleChange}
                        value="normal"
                      />
                    }
                    label="Nornaml"
                  />
                  <FormControlLabel control={
                      <Checkbox
                        checked={this.state.check.status}
                        onChange={this.handleChange}
                        value="suspended"
                      />
                    }
                    label="Suspened"
                  />
                </FormGroup>
              </Grid>
            </Grid>

            <Paper className={classes.tableWrapper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Index</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  { _.isEmpty(this.state.users) ? (<TableRow></TableRow>)
                    : this.state.users.map((user, index) => (
                      <LinkContainer to={"/admin/setting/users/" + user.username} key={index}>
                        <TableRow hover >
                          <TableCell>{index+1}</TableCell>
                          <TableCell>{_.isEmpty(user) ? '' : user.email}</TableCell>
                          <TableCell>{_.isEmpty(user) ? '' : user.username}</TableCell>
                          <TableCell>{_.isEmpty(user) ? '' : user.role}</TableCell>
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
          </Grid>
        </Grid>
      </SettingContainer>
    );
  }
}

UsersList.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
  };
};

export default connect(mapStateToProps, { getUsersList, adminEditUser })(withStyles(styles)(UsersList));
