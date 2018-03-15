import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import validator from 'validator';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions
} from 'material-ui/ExpansionPanel';
import Divider from 'material-ui/Divider';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

const styles = (theme) => ({
  "button": {
    "margin": theme.spacing.unit,
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
      "username": {
        "value": null,
        "showError": false,
        "errorMessage": ''
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handlePanelChange = this.handlePanelChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.isValidUsername = this.isValidUsername.bind(this);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.error) {
      this.setState({
        "username": {
          "showError": true,
          "errorMessage": nextProps.error.message,
        }
      });
    }
  }

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      "expanded": expanded ? panel : undefined
    });
  }

  handleChange(e) {
    const { name, value } = e.target;

    if (validator.equals('username', name)) {
      this.setState({
        "username": {
          "value": value,
          "showError": false,
          "errorMessage": ''
        },
      });
    }
  }

  isValidUsername() {
    const username = this.state.username.value;

    if(_.isEmpty(username)) {
      this.setState({
        "username": {
          "value": username,
          "showError": true,
          "errorMessage": 'Error: Input a valid username'
        }
      });
      return false;
    } else if (!validator.isAlphanumeric(username)) {
      this.setState({
        "username": {
          "value": username,
          "showError": true,
          "errorMessage": 'Error: Only contains a-z, A-Z, 0-9'
        }
      });
    } else if (!validator.isLength(username, {min: 4, max: 30})) {
      this.setState({
        "username": {
          "value": username,
          "showError": true,
          "errorMessage": 'Error: should longer than 3 letters and shorter than 31 letters.'
        }
      });
    } else {
      this.setState({
        "username": {
          "value": username,
          "showError": false,
          "errorMessage": ''
        }
      });

      return true;
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const id = this.props.user._id;

    if (id && this.isValidUsername()) {
      this.props.updateUserProfile(id, {
        "username": this.state.username.value
      });
    }
  }

  render() {
    const { classes, user } = this.props;
    let { expanded } = this.state;

    return (
      <ExpansionPanel expanded={expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography type="body1" className={classes.heading}>Username</Typography>
          <Typography type="body1" className={classes.secondaryHeading}>{_.isEmpty(user.username) ? '' : user.username}</Typography>
        </ExpansionPanelSummary>
        <Divider />
        <ExpansionPanelDetails>
          <TextField
            fullWidth
            name="username"
            error={this.state.username.showError}
            helperText={this.state.username.showError ? this.state.username.errorMessage : 'Only contains a-z, A-Z, 0-9, should longer than 3 letters and shorter than 31 letters.'}
            onChange={this.handleChange}
            onBlur={this.isValidUsername}
            label="New username"
            id="username"
            margin="normal"
            type="text"
          />
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button raised disabled={this.state.username.showError} color="primary" onClick={this.handleSubmit} className={classes.button}>
            Update
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
  "error": PropTypes.object,
  "updateUserProfile": PropTypes.func.isRequired,
};

export default withStyles(styles)(UsernamePanel);
