import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow, TableFooter, TablePagination } from 'material-ui/Table';
import Button from 'material-ui/Button';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui-icons/Search';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import { FormControl, FormControlLabel, FormLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';

import SettingContainer from '../setting/SettingContainer';
import ProperName from '../utils/ProperName';
import TablePaginationActions from '../utils/TablePaginationActions';
import { getComments, updateCommentStatus } from '../../actions/comment.actions';

const styles = (theme) => ({});

class CommentsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "rowsPerPage": 20,
      "page": 0,
      "editDialogOpen": false,
      "commentId": '',
      "content": '',
      "status": '',
      "userId": '',
      "username": '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handlePaginationChange = this.handlePaginationChange.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getComments({
      limit: this.state.rowsPerPage,
    });
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleRowClick(e, item) {
    this.setState({
      editDialogOpen: true,
      commentId: item._id,
      content: item.content,
      status: item.status,
      userId: item.userId._id,
      username: item.userId.username,
    });
  }

  handlePaginationChange(e, page) {
    this.props.getComments({
      skip: page * this.state.rowsPerPage,
      limit: this.state.rowsPerPage,
    }).then(response => {
      if (response) {
        this.setState({
          page: page
        });
      }
    });
  }

  handleChangeRowsPerPage(e) {
    this.props.getComments({
      skip: this.state.page * e.target.value,
      limit: e.target.value,
    })
    .then(response => {
      if (response) {
        this.setState({
          limit: e.target.value,
        });
      }
    });
  }

  handleDialogClose() {
    this.setState({
      editDialogOpen: false,
      commentId: '',
      content: '',
      status: '',
      userId: '',
      username: '',
    });
  }

  handleSubmit() {
    if (this.state.commentId) {
      this.props.updateCommentStatus(this.state.commentId, this.state.status)
        .then(response => {
          return this.props.getComments({
            skip: this.state.page * this.state.rowsPerPage,
            limit: this.state.rowsPerPage,
          });
        })
        .then(response => {
          this.setState({
            editDialogOpen: false
          });
        });
    }
  }

  render() {
    const { classes, comments } = this.props;

    return (
      <SettingContainer>
        <div>
          <Grid container>
            <Grid item xs={12}>
              <Typography type="display1" gutterBottom>Comments List</Typography>
            </Grid>

            <Grid item xs={12}>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Post</TableCell>
                      <TableCell>Content</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {
                      _.isEmpty(comments) ? (<TableRow></TableRow>)
                        : comments.map((comment, index) => (
                          <TableRow hover key={index}
                            onClick={e => this.handleRowClick(e, comment)}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell><ProperName user={comment.userId} /></TableCell>
                            <TableCell>{comment.postId.title}</TableCell>
                            <TableCell>{comment.content}</TableCell>
                            <TableCell>{comment.status}</TableCell>
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
          <Dialog fullWidth
            open={this.state.editDialogOpen}
            onClose={this.handleDialogClose}
            aria-labelledby="comment-dialog-title"
            aria-describedby="comment-dialog-description"
          >
            <DialogTitle id="comment-dialog-title">
              <Link to={{
                  pathname: "/admin/user/" + this.state.username,
                  hash: '#',
                  state: {
                    "admin": this.props.admin,
                    "userId": this.state.userId,
                  }
                }}
              >
                {this.state.username}
              </Link>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={16}>
                <Grid item xs={6}>
                  <FormControl fullWidth >
                    <FormLabel component="label">Staus</FormLabel>
                    <RadioGroup
                      row
                      aria-label="Status"
                      name="status"
                      value={this.state.status}
                      onChange={this.handleChange}
                    >
                      <FormControlLabel value="NORMAL" control={<Radio />} label="Normal" />
                      <FormControlLabel value="SUSPENDED" control={<Radio />} label="Suspended" />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography type="body1" gutterBottom>{this.state.content}</Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button raised autoFocus color="primary" disabled={_.isEmpty(this.state.commentId)} onClick={this.handleSubmit}>
                Save
              </Button>
              <Button color="primary" onClick={this.handleDialogClose}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </SettingContainer>
    );
  }
}

CommentsList.propTypes = {
  "classes": PropTypes.object.isRequired,
  "comments": PropTypes.array.isRequired,
  "totalCount": PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
    "comments": state.commentReducer.comments,
    "totalCount": state.commentReducer.totalCount,
  };
};

export default connect(mapStateToProps, { getComments, updateCommentStatus })(withStyles(styles)(CommentsList));
