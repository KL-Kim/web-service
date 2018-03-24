import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions
} from 'material-ui/ExpansionPanel';
import Divider from 'material-ui/Divider';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import { CircularProgress } from 'material-ui/Progress';

import emailTypes from '../../../constants/email.types';

const styles = (theme) => ({
  "heading": {
    "fontSize": theme.typography.pxToRem(15),
    "flexBasis": '40%',
    "flexShrink": 0,
  },
  "secondaryHeading": {
    "fontSize": theme.typography.pxToRem(15),
    "color": theme.palette.text.secondary,
  },
  "button": {
    "margin": theme.spacing.unit,
    "width": 150,
  },
});

class EmailPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "expanded": null,
    };

    this.handlePanelChange = this.handlePanelChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      "expanded": expanded ? panel : undefined
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.props.user.email)
      this.props.sendEmail(emailTypes.ACCOUNT_VERIFICATION, this.props.user.email);
  }

  render() {
    const { classes, user, isFetching } = this.props;
    let { expanded } = this.state;

    const button = user.isVerified
      ? (<Button raised color="primary" className={classes.button} onClick={this.handlePanelChange('panel')}>OK</Button>)
      : (<div>
          <Button raised disabled={isFetching} color="primary" onClick={this.handleSubmit} className={classes.button}>
            {isFetching ? (<CircularProgress size={20} />) : 'Verify Email'}
          </Button>
          <Button color="primary" className={classes.button} onClick={this.handlePanelChange('panel')}>Cancel</Button>
        </div>);

    return (
      <ExpansionPanel expanded={expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography type="body1" className={classes.heading}>Email</Typography>
          <Typography type="body1" className={classes.secondaryHeading}>{_.isEmpty(user.email) ? '' : user.email}</Typography>
        </ExpansionPanelSummary>
        <Divider />
        <ExpansionPanelDetails>
          {user.isVerified ? 'Your email has been verified' : "Not Verified, send verification to your Email"}
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          {button}
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

EmailPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "error": PropTypes.bool,
  "sendEmail": PropTypes.func.isRequired,
  "isFetching": PropTypes.bool,
};

export default withStyles(styles)(EmailPanel);
