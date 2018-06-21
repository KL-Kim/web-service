import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import validator from 'validator';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
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

const getSteps = (props) => {
  return ['Input the phone number', 'Input the verification code'];
};

class MobilePanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "expanded": null,
      "activeStep": 0,
      "phoneNumber": {
        "value": '',
        "showError": false,
        "errorMessage": ''
      },
      "verificationCode": {
        "value": '',
        "showError": false,
        "errorMessage": ''
      },
    };

    this.handlePanelChange = this.handlePanelChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.getStepContent = this.getStepContent.bind(this);
    this.isValidPhoneNumber = this.isValidPhoneNumber.bind(this);
    this.isValidCode = this.isValidCode.bind(this);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.error) {
      if (this.state.activeStep === 0) {
        this.setState({
          "phoneNumber": {
            "value": '',
            "showError": true,
            "errorMessage": nextProps.errorMessage,
          }
        });
      } else if (this.state.activeStep === 1) {
        this.setState({
          "verificationCode": {
            "value": '',
            "showError": true,
            "errorMessage": nextProps.errorMessage,
          }
        });
      }
    }
  }

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      "expanded": expanded ? panel : undefined
    });
  }

  getStepContent(stepIndex, props) {
    switch (stepIndex) {
      case 0:
        return (
            <TextField
              type="text"
              fullWidth
              label="Phone number"
              id="phoneNumber"
              name="phoneNumber"
              onChange={this.handleChange}
              onBlur={this.isValidPhoneNumber}
              error={this.state.phoneNumber.showError}
              helperText={this.state.phoneNumber.errorMessage || ' '}
            />
        );

      case 1:
        return (
          <div>
            <TextField
              type="text"
              fullWidth
              label="Verification Code"
              id="verificationCode"
              name="verificationCode"
              onChange={this.handleChange}
              onBlur={this.isValidCode}
              error={this.state.verificationCode.showError}
              helperText={this.state.verificationCode.errorMessage || ' '}
            />
          </div>
        );

      default:
        return 'Uknown stepIndex';
    }
  }

  handleBack() {
    const { activeStep } = this.state;
    this.setState({
      "activeStep": activeStep - 1,
      "verificationCode": {
        "value": '',
        "showError": false,
        "errorMessage": ''
      },
    });
  }

  handleNext() {
    const { activeStep, phoneNumber, verificationCode } = this.state;

    if (activeStep === 0) {
      if (phoneNumber.value && this.isValidPhoneNumber()) {
        this.props.sendPhoneVerificationCode(phoneNumber.value).then(response => {
          if (response) {
            this.setState({
              activeStep: activeStep + 1
            });
          }
        });
      }
    } else if (activeStep === 1) {
      if (verificationCode.value && this.isValidCode()) {
        console.log("Your code is " + verificationCode.value);

        const id = this.props.user._id;
        this.props.updateMobilePhone(id, phoneNumber.value, verificationCode.value).then(response => {
          if (response) {
            this.setState({
              activeStep: activeStep + 1
            });
          }
        });
      }
    }
  }

  handleChange(e) {
    const { name, value } = e.target;

    if (validator.equals('phoneNumber', name)) {
      this.setState({
        "phoneNumber": {
          "value": value,
          "showError": false,
          "errorMessage": ''
        },
      });
    }

    if (validator.equals('verificationCode', name)) {
      this.setState({
        "verificationCode": {
          "value": value,
          "showError": false,
          "errorMessage": ''
        },
      });
    }
  }

  isValidPhoneNumber() {
    const { phoneNumber } = this.state;

    if (_.isEmpty(phoneNumber.value) || !validator.isMobilePhone(phoneNumber.value, 'zh-CN')) {
      this.setState({
        "phoneNumber": {
          "value": phoneNumber.value,
          "showError": true,
          "errorMessage": "Input a valid mobile phone number",
        }
      });

      return false;
    }

    return true;
  }

  isValidCode() {
    const { verificationCode } = this.state;

    if (_.isEmpty(verificationCode.value) || !validator.isInt(verificationCode.value, {min: 100000, max: 999999})) {
      this.setState({
        "verificationCode": {
          "value": verificationCode.value,
          "showError": true,
          "errorMessage": "Input the verification code",
        }
      });

      return false;
    } else {
      return true;
    }
  }

  render() {
    const { classes, user, isFetching } = this.props;
    let { expanded } = this.state;
    let steps = getSteps(this.props);
    let { activeStep } = this.state;

    return (
      <ExpansionPanel expanded={expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="body1" className={classes.heading}>Mobile Phone</Typography>
          <Typography variant="body1" className={classes.secondaryHeading}>{_.isEmpty(user.phoneNumber) ? '' : user.phoneNumber}</Typography>
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
                  <Typography variant="body1" align="center">
                    Congratulations, Your mobile phone has been updated!
                  </Typography>
                </Grid>
              ) : (
                <Grid item xs={8}>
                  {this.getStepContent(activeStep, this.props)}
                  <Grid container justify="center" alignItems="center">
                    <Grid item>
                      <Button variant="raised"
                        color="primary"
                        disabled={this.state.phoneNumber.showError || this.state.verificationCode.showError || isFetching}
                        onClick={this.handleNext}
                        className={classes.button}
                      >
                        {isFetching ? (<CircularProgress size={20} />) : (activeStep === steps.length - 1 ? 'Update' : 'Next')}
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
  "isFetching": PropTypes.bool,
  "error": PropTypes.bool,
  "errorMessage": PropTypes.string,
  "sendPhoneVerificationCode": PropTypes.func.isRequired,
  "updateMobilePhone": PropTypes.func.isRequired,
};

export default withStyles(styles)(MobilePanel);
