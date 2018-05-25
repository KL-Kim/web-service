import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import { InputLabel } from 'material-ui/Input';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions
} from 'material-ui/ExpansionPanel';
import Divider from 'material-ui/Divider';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

import Container from './utils/Container';
import BusinessCard from './utils/BusinessCard';
import ReviewCard from './utils/ReviewCard';


// Mock data

const styles = (theme) => ({
});

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.match.params.username
    };
  }

  render() {
    const { classes } = this.props;

    return (
      <Container>
        <div>
          <Grid container>
            <Grid item xs={12}>
              <Typography type="display1" gutterBottom align="center">Profile</Typography>
            </Grid>
          </Grid>
        </div>
      </Container>
    );
  }
}

export default withStyles(styles)(UserProfile);
