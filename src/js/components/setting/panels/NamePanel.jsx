import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

// Material UI Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = (theme) => ({
  "secondaryHeading": {
    "color": theme.palette.text.secondary,
  },
});

class NamePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "expanded": null,
      "firstName": '',
      "lastName": '',
    };

    this.handlePanelChange = this.handlePanelChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      "expanded": expanded ? panel : undefined
    });
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const id = this.props.user._id;

    this.props.updateUserProfile(id, {
      "firstName": this.state.firstName,
      "lastName": this.state.lastName,
    });

  }

  render() {
    const { classes, user, isFetching } = this.props;

    return (
      <ExpansionPanel expanded={this.state.expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="body2">Name</Typography>
            </Grid>

            <Grid item>
              <Typography variant="body1" className={classes.secondaryHeading}>
                {(isEmpty(user.firstName) ? '' : user.firstName) + ' ' + (isEmpty(user.lastName) ? '' : user.lastName)}
              </Typography>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <Grid container spacing={16} justify="center">
            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                id="firstname"
                fullWidth
                label="First Name"
                name="firstName"
                onChange={this.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="lastname"
                type="text"
                fullWidth
                label="Last Name"
                name="lastName"
                onChange={this.handleChange}
              />
            </Grid>
          </Grid>
        </ExpansionPanelDetails>

        <ExpansionPanelActions>
          <Button
            size="small"
            onClick={this.handlePanelChange('panel')}
          >
            Cancel
          </Button>
          <Button
            size="small"
            color="primary"
            disabled={isEmpty(this.state.firstName) || isEmpty(this.state.lastName)}
            onClick={this.handleSubmit}
          >
            {
              isFetching ? (<CircularProgress size={20} />) : 'Save'
            }
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

NamePanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "isFetching": PropTypes.bool,
  "updateUserProfile": PropTypes.func.isRequired,
};

export default withStyles(styles)(NamePanel);
