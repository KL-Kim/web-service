import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow, } from 'material-ui/Table';
import { FormControl } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import SettingContainer from '../SettingContainer';
import { adminEditUser } from '../../../actions/admin.actions.js';

const styles = (theme) => ({
  "paper": {
    padding: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 4,
  },
  "buttonContainer": {
    "display": "flex",
    "justifyContent": "flex-end",
  },
  "button": {
    "margin": theme.spacing.unit,
    "width": 150,
  },
});

class SingleUserInfoPage extends Component {
  constructor(props) {
    super(props);

    const user = _.isUndefined(props.location.state) ? '' : props.location.state.user;

    this.state = {
      "userStatus": user.userStatus,
      "role": user.role,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentWillMount() {
    if (_.isUndefined(this.props.location.state))
      this.props.history.push('/404');
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
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
      this.props.adminEditUser(this.props.admin._id, data);

  }

  handleCancel() {
    this.props.history.goBack();
  }

  render() {
    const { classes, history, location } = this.props;
    const user = _.isUndefined(location.state) ? '' : location.state.user;

    return _.isEmpty(user) ? '' :(
      <SettingContainer history={history}>
        <div>
          <Typography type="display1" gutterBottom>Email -  {(_.isEmpty(user) ? '' : user.email)}</Typography>
          <Paper className={classes.paper}>
            <Grid container spacing={16} alignItems="center">
              <Grid item xs={3}>
                <TextField fullWidth disabled id="username" label="Username"  margin="normal" defaultValue={user.username} />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth disabled id="phone" label="Phone"  margin="normal" defaultValue={_.isUndefined(user.phoneNumber) ? 'None' : user.phoneNumber.toString()} />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="status">Status</InputLabel>
                  <Select native
                    name="userStatus"
                    value={this.state.userStatus}
                    inputProps={{
                      id: "status"
                    }}
                    onChange={this.handleChange}
                  >
                    <option value="normal">Normal</option>
                    <option value="suspended">Suspened</option>
                </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="role">Role</InputLabel>
                  <Select native
                    name="role"
                    value={this.state.role}
                    inputProps={{
                      id: "role"
                    }}
                    onChange={this.handleChange}
                  >
                    <option value="regular">Regular</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth disabled id="name" label="Name" margin="normal" defaultValue={
                  (_.isUndefined(user.firstName) ? '' : user.firstName) + ' ' + (_.isUndefined(user.lastName) ? '' : user.lastName)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth disabled id="verified" label="Verification"  margin="normal" defaultValue={user.isVerified ? 'Yes' : 'No'} />
              </Grid>

              <Grid item xs={3}>
                <TextField fullWidth disabled id="gender" label="Gender" margin="normal" defaultValue={_.isUndefined(user.gender) ? 'None' : user.gender} />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth disabled id="birthday" label="Birthday" margin="normal" defaultValue={_.isUndefined(user.birthday) ? 'None' : user.birthday} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth disabled id="address" label="Address" margin="normal" defaultValue={
                  _.isUndefined(user.address) ? 'None' : user.address.province.name + ' ' + user.address.city.name + ' ' + user.address.area.name + ' ' + user.address.street}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth disabled id="point" label="Point" margin="normal" defaultValue={_.isUndefined(user.point) ? '0' : user.point.toString()} />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth disabled id="createdAt" label="Join at" margin="normal" defaultValue={_.isUndefined(user.createdAt) ? 'none' : user.createdAt.toString()} />
              </Grid>
              <Grid item xs={12}>
                <div className={classes.buttonContainer}>
                  <Button raised color="primary" className={classes.button} onClick={this.handleSubmit(user._id)}>
                    Update
                  </Button>
                  <Button color="primary" className={classes.button} onClick={this.handleCancel}>
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Paper>

          <Typography type="display1" gutterBottom>Login History</Typography>
          <Paper className={classes.paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>IP</TableCell>
                  <TableCell>Agent</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.isUndefined(user.lastLogin) ? '' : user.lastLogin.map((item, index) => {
                  const date = new Date(item.time);
                  return (
                    <TableRow key={index}>
                      <TableCell>{date.toLocaleString()}</TableCell>
                      <TableCell>{item.ip}</TableCell>
                      <TableCell>{item.agent}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </SettingContainer>
    );
  }
}

SingleUserInfoPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "admin": PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
  };
};

export default connect(mapStateToProps, { adminEditUser })(withStyles(styles)(SingleUserInfoPage));
