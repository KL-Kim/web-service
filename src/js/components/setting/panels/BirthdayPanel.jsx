import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

// Material UI Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
  "textField": {
    width: 262,
  },
});

class BirthdayPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "expanded": null,
      "date": null,
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

    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const id = this.props.user._id;

    this.props.updateUserProfile(id, {
      "birthday": this.state.date,
    });
  }

  render() {
    const { classes, user, isFetching } = this.props;

    return (
      <ExpansionPanel expanded={this.state.expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Birthday</Typography>
          <Typography className={classes.secondaryHeading}>{_.isEmpty(user.birthday) ? 'None' : user.birthday}</Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <TextField
            id="birthday"
            label="Birthday"
            type="date"
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            name="date"
            onChange={this.handleChange}
          />
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
            color="primary"
            disabled={_.isEmpty(this.state.date)}
            onClick={this.handleSubmit}
          >
            {
              isFetching ? (<CircularProgress size={20} />) : 'Save'
            }
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

BirthdayPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "error": PropTypes.bool,
  "isFetching": PropTypes.bool,
  "updateUserProfile": PropTypes.func.isRequired,
};

export default withStyles(styles)(BirthdayPanel);
