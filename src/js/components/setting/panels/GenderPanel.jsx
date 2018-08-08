import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

// Material UI Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = (theme) => ({
  "secondaryHeading": {
    "color": theme.palette.text.secondary,
  },
});

class GenderPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "expanded": null,
      "gender": props.user.gender || '',
    };

    this.handlePanelChange = this.handlePanelChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePanelChange = panel => (e, expanded) => {
    this.setState({
      "expanded": expanded ? panel : undefined
    });
  }

  handleChange(e, value) {
    this.setState({
      "gender": value
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const id = this.props.user._id;

    this.props.updateUserProfile(id, {
      "gender": this.state.gender
    }).then(response => {
      if (response) {
        this.setState({
            "expanded": null,
        });
      }
    });
  }

  render() {
    const { classes, user, isFetching } = this.props;

    return (
      <ExpansionPanel expanded={this.state.expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="body2">Gender</Typography>
            </Grid>

            <Grid item>
              <Typography variant="body1" className={classes.secondaryHeading}>{_.isEmpty(user.gender) ? '' : user.gender}</Typography>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <FormControl fullWidth >
            <RadioGroup
              row
              aria-label="gender"
              name="gender"
              value={this.state.gender}
              onChange={this.handleChange}
            >
              <FormControlLabel value="Male" control={<Radio color="primary" />} label="Male" />
              <FormControlLabel value="Female" control={<Radio color="primary" />} label="Female" />
              <FormControlLabel value="Other" control={<Radio color="primary" />} label="Other" />
            </RadioGroup>
          </FormControl>
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
            disabled={isFetching}
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

GenderPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "isFetching": PropTypes.bool,
  "updateUserProfile": PropTypes.func.isRequired,
};

export default withStyles(styles)(GenderPanel);
