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
import Button from 'material-ui/Button';

import SettingContainer from '../SettingContainer';
import LinkContainer from '../../utils/LinkContainer';
import TablePaginationActions from '../../utils/TablePaginationActions';
import { getBusinessList } from '../../../actions/business.actions.js';

const styles = (theme) => ({
  "container": {
    marginBottom: theme.spacing.unit,
  },
  "buttonContainer": {
    "display": "flex",
    "justifyContent": "flex-end",
  },
  "button": {
    margin: theme.spacing.unit,
  },
});

class BusinessList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "dialogOpen": false,
      "search": '',
      "rowsPerPage": 10,
      "page": 0,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    this.props.getBusinessList(0, this.state.rowsPerPage);
  }

  handlePaginationChange(e, page) {
    this.setState({
      page: page,
    });
  }

  handleChangeRowsPerPage(e) {
    this.setState({
      rowsPerPage: e.target.value,
    });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }

  render() {
    const { classes, admin, businessList = {} } = this.props;

    return (
      <SettingContainer>
        <div>
          <Typography type="display1" gutterBottom>
            Business List
          </Typography>

          <Grid container spacing={16} className={classes.container}>
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

            <Grid item xs={8}>
              <div className={classes.buttonContainer}>
                <LinkContainer to={{
                    pathname: "/admin/setting/business/new",
                    hash: '#',
                    state: {
                      "admin": this.props.admin,
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
                  <TableCell>힌국어</TableCell>
                  <TableCell>Business category</TableCell>
                  <TableCell>Views Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  _.isEmpty(businessList) ? (<TableRow></TableRow>)
                  : businessList.map((business, index) => (
                    <LinkContainer to={{
                        pathname: "/admin/setting/business/" + business.cnName,
                        hash: '#',
                        state: {
                          "admin": this.props.admin,
                          "business": business
                        }
                      }} key={index}
                    >
                      <TableRow hover >
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{business.cnName}</TableCell>
                        <TableCell>{business.krName}</TableCell>
                        <TableCell>{_.isEmpty(business.category) ? '' : business.category.krName}</TableCell>
                        <TableCell>{business.viewsCount}</TableCell>
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
  "getBusinessList": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
    "businessList": state.businessReducer.businessList,
    "totalCount": state.businessReducer.totalCount,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getBusinessList })(withStyles(styles)(BusinessList));
