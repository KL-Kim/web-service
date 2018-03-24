import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

class ChangePasswordPanel extends Component {
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
      this.props.sendEmail(emailTypes.CHANGE_PASSWORD, this.props.user.email);
  }

  render() {
    const { classes, isFetching } = this.props;
    let { expanded } = this.state;

    return (
      <ExpansionPanel expanded={expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography type="body1" className={classes.heading}>Password</Typography>
        </ExpansionPanelSummary>
        <Divider />
        <ExpansionPanelDetails>
          To change password, send email.
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button raised disabled={isFetching} color="primary" onClick={this.handleSubmit} className={classes.button}>
            {isFetching ? (<CircularProgress size={20} />) : 'Send Email'}
          </Button>
          <Button color="primary" className={classes.button} onClick={this.handlePanelChange('panel')}>Cancel</Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

ChangePasswordPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "sendEmail": PropTypes.func.isRequired,
}

export default withStyles(styles)(ChangePasswordPanel);
