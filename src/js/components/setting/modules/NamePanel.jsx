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
import Grid from 'material-ui/Grid';

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
    const { classes, user } = this.props;
    let { expanded } = this.state;

    return (
      <ExpansionPanel expanded={expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography type="body1" className={classes.heading}>Name</Typography>
          <Typography type="body1" className={classes.secondaryHeading}>{(_.isEmpty(user.firstName) ? '' : user.firstName) + ' '+ (_.isEmpty(user.lastName) ? '' : user.lastName)}</Typography>
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
          <Button raised color="primary" disabled={_.isEmpty(this.state.firstName) || _.isEmpty(this.state.lastName)} className={classes.button} onClick={this.handleSubmit}>
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

NamePanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "error": PropTypes.object,
  "updateUserProfile": PropTypes.func.isRequired,
};

export default withStyles(styles)(NamePanel);
