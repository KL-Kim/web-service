import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import validator from 'validator';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Button from 'material-ui/Button';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary
} from 'material-ui/ExpansionPanel';
import Stepper, {Step, StepLabel} from 'material-ui/Stepper';
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

const getSteps = (props) => {
  return ['New '+ props.name, 'Verification code'];
}

const getStepContent = (stepIndex, props) => {
  switch (stepIndex) {
    case 0:
      return (
        <TextField
          fullWidth
          error
          label={"New " + props.name}
          id="newEmail"
          type="text"
          helperText={`Error: This ${props.name} unavailable`}
        />
      );
    case 1:
      return (
        <TextField
          fullWidth
          error
          label="Verification Code"
          id="verificationCode"
          type="text"
          helperText="Error: This email unavailable"
        />
      );
    default:
      return 'Uknown stepIndex';
  }
}

class MobilePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "expanded": null,
      "mobileNumber": {
        "value": null,
        "showError": false,
        "errorMessage": ''
      },
      activeStep: 0,
    };

    this.handlePanelChange = this.handlePanelChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleNext = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep + 1
    });
  }

  handleReset = () => {
   this.setState({
     activeStep: 0,
   });
 }

  handleBack = () => {
    const { activeStep } = this.state;
    this.setState({
      activeStep: activeStep - 1
    });
  }

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      "expanded": expanded ? panel : undefined
    });
  }

  handleChange(e) {
    const { name, value } = e.target;

    if (validator.equals('mobileNumber', name)) {
      this.setState({
        "mobileNumber": {
          "value": value,
          "showError": false,
          "errorMessage": ''
        },
      });
    }
  }

  render() {
    const { classes, user } = this.props;
    let { expanded } = this.state;
    let steps = getSteps(this.props);
    let { activeStep } = this.state;

    return (
      <ExpansionPanel expanded={expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography type="body1" className={classes.heading}>Telephone</Typography>
          <Typography type="body1" className={classes.secondaryHeading}>{_.isEmpty(user.mobileNumber) ? '' : user.mobileNumber}</Typography>
        </ExpansionPanelSummary>
        <Divider />
        <ExpansionPanelDetails>
          <Grid container justify="center">
            <Grid item xs={12}>
              <Stepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
                {steps.map(label => {
                  return (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Grid>

              {this.state.activeStep === steps.length ? (
                <Grid item xs={12}>
                  <Typography type="body1" align="center">
                    Your email has been changed
                  </Typography>
                </Grid>
              ) : (
                <Grid item xs={8}>
                  {getStepContent(activeStep, this.props)}
                  <Grid container justify="center" alignItems="center">
                    <Grid item>
                      <Button raised color="primary" onClick={this.handleNext} className={classes.button}>
                        {activeStep === steps.length - 1 ? 'Update' : 'Next'}
                      </Button>
                      <Button
                        disabled={activeStep === 0}
                        onClick={this.handleBack}
                        className={classes.button}
                      >
                        Back
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              )}
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

MobilePanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "error": PropTypes.object,
  "updateUserProfile": PropTypes.func.isRequired,
};

export default withStyles(styles)(MobilePanel);
