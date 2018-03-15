import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Stepper, {Step, StepLabel} from 'material-ui/Stepper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 4,
  },
  stepper: {

  }
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

class ChangeModule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeStep: 0
    };
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

  render() {
    const { classes } = this.props;
    const steps = getSteps(this.props);
    const { activeStep } = this.state;

    return (
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
    );
  }
}

ChangeModule.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired
};

export default withStyles(styles)(ChangeModule);
