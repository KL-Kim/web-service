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

class EmailPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "expanded": null,
      "email": {
        "value": null,
        "showError": false,
        "errorMessage": ''
      },
    };

    this.handlePanelChange = this.handlePanelChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      "expanded": expanded ? panel : undefined
    });
  }

  handleChange(e) {
    const { name, value } = e.target;

    if (validator.equals('email', name)) {
      this.setState({
        "email": {
          "value": value,
          "showError": false,
          "errorMessage": ''
        },
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const id = this.props.user._id;

  }

  render() {
    const { classes, user } = this.props;
    let { expanded } = this.state;

    const content = user.isVerified ? 'Your email has been verified' : "Not Verified";

    return (
      <ExpansionPanel expanded={expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography type="body1" className={classes.heading}>Email</Typography>
          <Typography type="body1" className={classes.secondaryHeading}>{_.isEmpty(user.email) ? '' : user.email}</Typography>
        </ExpansionPanelSummary>
        <Divider />
        <ExpansionPanelDetails>
          { content }
        </ExpansionPanelDetails>

        <ExpansionPanelActions>
          {
            user.isVerified
            ? (<Button raised color="primary" className={classes.button} onClick={this.handlePanelChange('panel')}>OK</Button>)
            : (<div><Button raised disabled={this.state.email.showError} color="primary" onClick={this.handleSubmit} className={classes.button}>
                Send Email
              </Button>
              <Button color="primary" className={classes.button} onClick={this.handlePanelChange('panel')}>
                Cancel
              </Button></div>)
          }
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

EmailPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "error": PropTypes.object,
  "updateUserProfile": PropTypes.func.isRequired,
};

export default withStyles(styles)(EmailPanel);
