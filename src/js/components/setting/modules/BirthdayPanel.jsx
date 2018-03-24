import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions
} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';

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
  "textField": {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
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
    let { expanded } = this.state;

    return (
      <ExpansionPanel expanded={expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography type="body1" className={classes.heading}>Birthday</Typography>
          <Typography type="body1" className={classes.secondaryHeading}>{_.isEmpty(user.birthday) ? 'None' : user.birthday}</Typography>
        </ExpansionPanelSummary>
        <Divider />
        <ExpansionPanelDetails>
          <TextField id="date"
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
          <Button raised color="primary" disabled={_.isEmpty(this.state.date)} className={classes.button} onClick={this.handleSubmit}>
            {isFetching ? (<CircularProgress size={20} />) : 'Update'}
          </Button>
          <Button color="primary" className={classes.button} onClick={this.handlePanelChange('panel')}>
            Cancel
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
