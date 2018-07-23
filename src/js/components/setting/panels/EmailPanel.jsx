import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

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
    "flexBasis": '30%',
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

    return (
      <ExpansionPanel expanded={this.state.expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Email</Typography>
          <Typography className={classes.secondaryHeading}>{_.isEmpty(user.email) ? '' : user.email}</Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          {
            user.isVerified
              ? <Typography>Your email has been verified.</Typography>
              : <Typography>Send verification link to your Email</Typography>
          }
        </ExpansionPanelDetails>

        <ExpansionPanelActions>
          {
            user.isVerified
              ? (<Button
                  size="small"
                  color="primary"
                  onClick={this.handlePanelChange('panel')}
                >
                  Close
                </Button>)
              : (<div>
                  <Button
                    size="small"
                    onClick={this.handlePanelChange('panel')}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    disabled={isFetching}
                    onClick={this.handleSubmit}
                  >
                    {
                      isFetching ? (<CircularProgress size={20} />) : 'Verify Email'
                    }
                  </Button>
                </div>)
          }
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
