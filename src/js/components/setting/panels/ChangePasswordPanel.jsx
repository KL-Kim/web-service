import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

// Material UI Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import emailTypes from 'js/constants/email.types';

const styles = (theme) => ({
  "heading": {
    "fontSize": theme.typography.pxToRem(15),
    "flexBasis": '40%',
    "flexShrink": 0,
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

    return (
      <ExpansionPanel expanded={this.state.expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Password</Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <Typography>To change password, send link to your email.</Typography>
        </ExpansionPanelDetails>

        <ExpansionPanelActions>
          <Button
            size="small"
            onClick={this.handlePanelChange('panel')}
          >
            Cancel
          </Button>
          <Button
            size="small"
            disabled={isFetching}
            color="primary"
            onClick={this.handleSubmit}
          >
            {
              isFetching ? (<CircularProgress size={20} />) : 'Send Email'
            }
          </Button>
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
