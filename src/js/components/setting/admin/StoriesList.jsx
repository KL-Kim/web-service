import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions
} from 'material-ui/ExpansionPanel';
import Divider from 'material-ui/Divider';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import TextField from 'material-ui/TextField';

import SettingBorder from '../SettingBorder';

// Mock data
const story = {
  id: '1',
  userId: '5a4ef8f5537cd042155581a3',
  businessId: '5a4ef8f5537cd042155581a3',
  businessName: 'SteakHouse',
  title: 'Tasting SteakHouse',
  content: 'Bla bla bla',
  commentCount: 10,
  good: 10,
  bad: 2
};


const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '40%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class StoriesList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: null
    };
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : undefined
    });
  }

  render() {
    const { classes } = this.props;
    const { expanded} = this.state;

    return (
      <SettingBorder>
        <Grid container className={classes.root} spacing={16} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography type="display3" gutterBottom>
              Stories List
            </Typography>
            <Typography type="body1">Search: </Typography>
            <TextField type="text" />

            <Paper className={classes.paper}>
              <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography type="body1" className={classes.heading}>Title</Typography>
                  <Typography type="body1" className={classes.secondaryHeading}>{story.title}</Typography>
                </ExpansionPanelSummary>
                <Divider />
                <ExpansionPanelDetails>
                  <TextField id="username" type="text" />
                </ExpansionPanelDetails>

                <ExpansionPanelActions>
                  <Button raised color="primary" className={classes.button}>
                    Save
                  </Button>
                </ExpansionPanelActions>
              </ExpansionPanel>
            </Paper>
          </Grid>
        </Grid>
      </SettingBorder>
    );
  }
}

export default withStyles(styles)(StoriesList);
