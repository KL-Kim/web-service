import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

const styles = {};

class SingleUserInfoPage extends Component {
  render() {
    return (
      <ExpansionPanel expanded={expanded === index} onChange={this.hanlePanelChange(index)} key={index}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography type="body1" className={classes.heading}>{(index + 1) + ' ' +  (_.isEmpty(user) ? '' : user.username)}</Typography>
          <Typography type="body1" className={classes.secondaryHeading}>{ _.isEmpty(user) ? '' : user.email}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Grid container spacing={16} justify="center" alignItems="center">
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="status">Status</InputLabel>
                <Select native
                  name="userStatus"
                  value={user.userStatus}
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
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="role">Role</InputLabel>
                <Select native
                  name="role"
                  value={user.role}
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
            <Grid item xs={4}>
              <TextField fullWidth disabled id="phone" label="phoneNumber"  margin="normal" defaultValue={_.isUndefined(user.phoneNumber) ? 'none' : user.phoneNumber.toString()} />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth disabled id="verified" label="IsVerified"  margin="normal" defaultValue={_.isUndefined(user.isVerified) ? 'none' : user.isVerified.toString()} />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth disabled id="point" label="Point" margin="normal" defaultValue={_.isUndefined(user.point) ? '0' : user.point.toString()} />
            </Grid>
            <Grid item xs={4}>
              <TextField fullWidth disabled id="createdAt" label="Join at" margin="normal" defaultValue={_.isUndefined(user.createdAt) ? 'none' : user.createdAt.toString()} />
            </Grid>

            <Grid item xs={12}>
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
            </Grid>
          </Grid>
        </ExpansionPanelDetails>

        <ExpansionPanelActions>
          <Button raised color="primary" className={classes.button} onClick={this.handleSubmit(user._id)}>
            Update
          </Button>
          <Button color="primary" className={classes.button} onClick={this.hanlePanelChange(index)}>
            Cancel
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

SingleUserInfoPage.propTypes = {
  "classes": PropTypes.object.isRequired,
};

export default withStyles(styles)(SingleUserInfoPage;
