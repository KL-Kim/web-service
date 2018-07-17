import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import isAlphanumeric from 'validator/lib/isAlphanumeric';
import isLength from 'validator/lib/isLength';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
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

class UsernamePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "expanded": null,
      "username": '',
      "showError": false,
      "errorMessage": '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePanelChange = this.handlePanelChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValidUsername = this.isValidUsername.bind(this);
  }

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      "expanded": expanded ? panel : undefined
    });
  }

  handleChange(e) {
    const { name, value } = e.target;

    if (name === 'username') {
      this.setState({
        "username": value,
        "showError": false,
        "errorMessage": '',
      });
    }
  }

  isValidUsername() {
    const username = this.state.username;

    if(_.isEmpty(username)) {
      this.setState({
        "username": username,
        "showError": true,
        "errorMessage": 'Error: Input a valid username',
      });
      return false;
    } else if (!isAlphanumeric(username)) {
      this.setState({
        "username": username,
        "showError": true,
        "errorMessage": 'Error: Only contains a-z, A-Z, 0-9',
      });
    } else if (!isLength(username, { min: 4, max: 30 })) {
      this.setState({
        "username": username,
        "showError": true,
        "errorMessage": 'Error: should longer than 3 letters and shorter than 31 letters.',
      });
    } else {
      this.setState({
        "username": username,
        "showError": false,
        "errorMessage": '',

      });

      return true;
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const id = this.props.user._id;

    if (id && this.isValidUsername()) {
      this.props.updateUserProfile(id, { "username": this.state.username })
        .then(response => {
          if (!_.isEmpty(response) && this.props.error) {
            this.setState({
              "showError": true,
              "errorMessage": this.props.errorMessage,
            });
          }
        })
    }
  }

  render() {
    const { classes, user, isFetching } = this.props;
    let { expanded } = this.state;

    return (
      <ExpansionPanel expanded={expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body1" className={classes.heading}>Username</Typography>
          <Typography variant="body1" className={classes.secondaryHeading}>{user.username}</Typography>
        </ExpansionPanelSummary>
        <Divider />
        <ExpansionPanelDetails>
          <TextField
            fullWidth
            name="username"
            error={this.state.showError}
            helperText={this.state.showError ? this.state.errorMessage : 'Only contains a-z, A-Z, 0-9, should longer than 3 letters and shorter than 31 letters.'}
            onChange={this.handleChange}
            onBlur={this.isValidUsername}
            label="New username"
            id="username"
            margin="normal"
            type="text"
          />
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button variant="raised" disabled={this.state.showError || isFetching} color="primary" onClick={this.handleSubmit} className={classes.button}>
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

UsernamePanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "error": PropTypes.bool,
  "errorMessage": PropTypes.string,
  "isFetching": PropTypes.bool,
  "updateUserProfile": PropTypes.func.isRequired,
};

export default withStyles(styles)(UsernamePanel);
