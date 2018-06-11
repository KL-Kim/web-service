import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import TextField from 'material-ui/TextField';
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination
} from 'material-ui/Table';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { FormControl, FormControlLabel, FormLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';

import SettingContainer from '../setting/SettingContainer';
import TablePaginationActions from '../utils/TablePaginationActions';
import { getPostsList, updatePostState } from '../../actions/blog.actions';
import ElapsedTime from '../../helpers/ElapsedTime';

const styles = (theme) => ({

});

class BlogList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "dialogOpen": false,
      "search": '',
      "rowsPerPage": 10,
      "page": 0,
      "title": '',
      "content": '',
      "state": '',
      "postId": '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.hanldeDialogClose = this.hanldeDialogClose.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleUpdatePostState = this.handleUpdatePostState.bind(this);
  }

  componentDidMount() {
    this.props.getPostsList({
      limit: this.state.rowsPerPage,
    });
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleRowClick = blog => e => {
    this.setState({
      dialogOpen: true,
      title: blog.title,
      content: blog.content,
      state: blog.state,
      postId: blog._id,
    });
  }

  hanldeDialogClose() {
    this.setState({
      dialogOpen: false,
      title: '',
      content: '',
    });
  }

  handlePaginationChange(e, page) {
    this.props.getPostsList({
      skip: page * this.state.rowsPerPage,
      limit: this.state.rowsPerPage,
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
    this.props.getPostsList({
      limit: e.target.value,
      skip: this.state.page * e.target.value
    }).then(response => {
      if (response) {
        this.setState({
          rowsPerPage: e.target.value
        });
      }
    });
  }

  handleUpdatePostState() {
    if (this.state.postId) {
      this.props.updatePostState(this.state.postId, this.state.state)
        .then(response => {
          if (response) {
            this.setState({
              dialogOpen: false
            });
          }
        })
        .then(() => {
          return this.props.getPostsList({
            limit: this.state.rowsPerPage,
            skip: this.state.page * this.state.rowsPerPage,
          });
        });
    }
  }

  render() {
    const { classes, blogList } = this.props;

    return (
      <SettingContainer>
        <div>
          <Typography type="display1" gutterBottom>
            Posts List
          </Typography>

          <Grid container className={classes.root} spacing={16} justify="center" alignItems="center">
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Summary</TableCell>
                      <TableCell>Publish Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>State</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      _.isEmpty(blogList)
                        ? (<TableRow></TableRow>)
                        : blogList.map((item, index) => (
                            <TableRow hover key={index}
                              onClick={this.handleRowClick(item)}
                            >
                              <TableCell>{index + 1}</TableCell>
                              <TableCell>{item.authorId.username}</TableCell>
                              <TableCell>{item.title}</TableCell>
                              <TableCell>{item.summary}</TableCell>
                              <TableCell>{ElapsedTime(item.updatedAt)}</TableCell>
                              <TableCell>{item.status}</TableCell>
                              <TableCell>{item.state}</TableCell>
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

          <div>
            <Dialog
              fullWidth
              open={this.state.dialogOpen}
              onClose={this.hanldeDialogClose}
              aria-labelledby="blog-dialog-title"
              aria-describedby="blog-dialog-description"
            >
              <DialogTitle id="blog-dialog-title">
                {this.state.title}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="blog-dialog-description" >
                  <Grid container>
                    <Grid item xs={12}>
                      <FormControl fullWidth >
                        <FormLabel component="label">State</FormLabel>
                        <RadioGroup
                          row
                          aria-label="State"
                          name="state"
                          value={this.state.state}
                          onChange={this.handleChange}
                        >
                          <FormControlLabel value="NORMAL" control={<Radio />} label="Normal" />
                          <FormControlLabel value="SUSPENDED" control={<Radio />} label="Suspended" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      {this.state.content}
                    </Grid>
                  </Grid>


                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button color="primary" raised onClick={this.handleUpdatePostState} className={classes.button}>
                  Save
                </Button>
                <Button color="primary" onClick={this.hanldeDialogClose} className={classes.button}>
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </SettingContainer>
    );
  }
}

BlogList.propTypes = {
  "classes": PropTypes.object.isRequired,
  "blogList": PropTypes.array.isRequired,
  "isFetching": PropTypes.bool.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
    "blogList": state.blogReducer.list,
    "totalCount": state.blogReducer.totalCount,
    "isFetching": state.blogReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getPostsList, updatePostState })(withStyles(styles)(BlogList));
