import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import validator from 'validator';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

// Material UI Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = (theme) => ({
  "button": {
    "margin": theme.spacing.unit,
    "width": 150,
  },
  "heading": {
    "fontSize": theme.typography.pxToRem(15),
    "flexBasis": '40%',
    "flexShrink": 0,
  },
  "secondaryHeading": {
    "fontSize": theme.typography.pxToRem(15),
    "color": theme.palette.text.secondary,
  },
});

class NamePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "expanded": null,
      "firstName": null,
      "lastName": null,
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

    if (validator.equals('firstName', name)) {
      this.setState({
        "firstName": value
      });
    }

    if (validator.equals('lastName', name)) {
      this.setState({
        "lastName": value
      });
    }
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
    let { expanded } = this.state;

    return (
      <ExpansionPanel expanded={expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body1" className={classes.heading}>Name</Typography>
          <Typography variant="body1" className={classes.secondaryHeading}>{(_.isEmpty(user.firstName) ? '' : user.firstName) + ' '+ (_.isEmpty(user.lastName) ? '' : user.lastName)}</Typography>
        </ExpansionPanelSummary>
        <Divider />
        <ExpansionPanelDetails>
          <Grid container spacing={16} justify="center">
            <Grid item lg={6}>
              <TextField
                onChange={this.handleChange}
                fullWidth
                label="First Name"
                id="firstName"
                type="text"
                name="firstName"
              />
            </Grid>
            <Grid item lg={6}>
              <TextField
                onChange={this.handleChange}
                fullWidth
                label="Last Name"
                id="lastName"
                type="text"
                name="lastName"
              />
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button variant="raised"
            color="primary"
            disabled={
              _.isEmpty(this.state.firstName)
              || _.isEmpty(this.state.lastName)}
            className={classes.button}
            onClick={this.handleSubmit}
          >
            {isFetching ? (<CircularProgress size={20} />) : 'Update'}
          </Button>
          <Button color="primary" className={classes.button} onClick={this.handlePanelChange('panel')}>
            Cancel
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

NamePanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "error": PropTypes.bool,
  "isFetching": PropTypes.bool,
  "updateUserProfile": PropTypes.func.isRequired,
};

export default withStyles(styles)(NamePanel);
