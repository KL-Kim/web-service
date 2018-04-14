import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui-icons/Search';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import SettingContainer from '../setting/SettingContainer';
import ConfirmationDialog from '../utils/ConfirmationDialog';
import { getTagsList, addNewTag, updateTag, deleteTag } from '../../actions/tag.actions.js';

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

class TagsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "AddNewDiaglogOpen": false,
      "confirmationDialogOpen": false,
      "search": '',
      "list": {},
      "isNew": false,
      "_id": '',
      "code": '',
      "enName": '',
      "krName": '',
      "cnName": '',
    };

    this.handleAddNew = this.handleAddNew.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOpenDeleteDialog = this.handleOpenDeleteDialog.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleCloseConfirmationDialog = this.handleCloseConfirmationDialog.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.props.getTagsList();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tagsList) {
      this.setState({
        list: nextProps.tagsList
      });
    }

  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleOpenDeleteDialog() {
    this.setState({
      confirmationDialogOpen: true,
      AddNewDiaglogOpen: false,
    });
  }

  handleAddNew() {
    this.setState({
      "AddNewDiaglogOpen": true,
      "isNew": true,
      "_id": '',
      "code": '',
      "enName": '',
      "krName": '',
      "cnName": '',
    });
  }

  handleDialogClose() {
    this.setState({
      AddNewDiaglogOpen: false,
      "isNew": false,
    });
  }

  handleRowClick(e, tag) {
    this.setState({
      _id: tag._id,
      code: tag.code,
      krName: tag.krName,
      cnName: tag.cnName,
      enName: tag.enName,
      AddNewDiaglogOpen: true,
    });
  }

  handleSearch(e) {
    e.preventDefault();
    const { search } = this.state;

    this.props.getTagsList(search);
  }

  handleSubmit() {
    const { _id, code, enName, krName, cnName, isNew } = this.state;

    if (code && enName && krName && cnName) {
      if (isNew) {
        this.props.addNewTag({
          code: code,
          enName: enName,
          krName: krName,
          cnName: cnName,
        });
      } else {
        this.props.updateTag({
          _id: _id,
          code: code,
          enName: enName,
          krName: krName,
          cnName: cnName,
        })
      }
    }

    this.setState({
      AddNewDiaglogOpen: false,
      isNew: false,
    });
  }

  handleCloseConfirmationDialog() {
    this.setState({
      confirmationDialogOpen: false,
    });
  }

  handleDelete() {
    if (this.state._id) {
      this.props.deleteTag(this.state._id).then(response => {
        if (response) {
          this.setState({
            AddNewDiaglogOpen: false,
            confirmationDialogOpen: false,
            "isNew": false,
            "_id": '',
            "code": '',
            "enName": '',
            "krName": '',
            "cnName": '',
          });
        }
      });
    }
  }

  render() {
    const { classes } = this.props;
    const { code, enName, krName, cnName, isNew } = this.state;

    return (
      <SettingContainer history={this.props.history} location={this.props.location}>
        <div>
          <Typography type="display1" gutterBottom>
            Tags List
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
                <Button raised color="primary" aria-label="add" size="large" onClick={this.handleAddNew}>
                  Add New
                </Button>
              </div>
            </Grid>
          </Grid>

          <Paper>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>한국어</TableCell>
                  <TableCell>中文名</TableCell>
                  <TableCell>Slug</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  _.isEmpty(this.state.list) ? (<TableRow></TableRow>)
                  : this.state.list.map((c, index) => (

                      <TableRow hover key={index}
                        onClick={event => this.handleRowClick(event, c)}
                      >
                        <TableCell>{c.code}</TableCell>
                        <TableCell>{c.krName}</TableCell>
                        <TableCell>{c.cnName}</TableCell>
                        <TableCell>{c.enName}</TableCell>
                      </TableRow>

                  ))
                }
              </TableBody>
            </Table>
          </Paper>

          <Dialog
            open={this.state.AddNewDiaglogOpen}
            onClose={this.handleDialogClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <Grid container>
                <Grid item xs={6}>
                  Tag
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.buttonContainer}>
                    <Button color="secondary" disabled={!(code && enName && krName && cnName) || isNew} onClick={this.handleOpenDeleteDialog}>
                      Delete
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent id="alert-dialog-description">
              <Grid container>
                <Grid item xs={6}>
                  <TextField fullWidth id="code" label="Code" margin="normal" name="code" onChange={this.handleChange} value={this.state.code} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth id="enName" label="English" margin="normal" name="enName" onChange={this.handleChange} value={this.state.enName} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth id="krName" label="한국어" margin="normal" name="krName" onChange={this.handleChange} value={this.state.krName} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth id="cnName" label="中文名" margin="normal" name="cnName" onChange={this.handleChange} value={this.state.cnName} />
                </Grid>
              </Grid>

            </DialogContent>
            <DialogActions>
              <Button raised autoFocus color="primary" disabled={!(code && enName && krName && cnName)} onClick={this.handleSubmit}>
                Save
              </Button>
              <Button color="primary" onClick={this.handleDialogClose}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <ConfirmationDialog
            open={this.state.confirmationDialogOpen}
            handleClose={this.handleCloseConfirmationDialog}
            operation={this.handleDelete}
            title="Warning"
            content="Are your sure to delete the category?"
          />
        </div>
      </SettingContainer>
    );
  }
}

TagsList.propTypes = {
  "classes": PropTypes.object.isRequired,
  "history": PropTypes.object.isRequired,
  "admin": PropTypes.object.isRequired,
  "getTagsList": PropTypes.func.isRequired,
  "updateTag": PropTypes.func.isRequired,
  "deleteTag": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
    "tagsList": state.tagReducer.tagsList,
    "isFetching": state.tagReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getTagsList, addNewTag, updateTag, deleteTag })(withStyles(styles)(TagsList));
