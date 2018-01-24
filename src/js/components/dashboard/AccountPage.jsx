import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions
} from 'material-ui/ExpansionPanel';
import Divider from 'material-ui/Divider';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';

import Dashboard from './Dashboard'

// Mock data
const user = {
  "username": "regularUser0",
  "email": "user0@abc.com",
  "address": "Bla bla bla bla bla",
  "gender": "male",
  "lastName": "Kim",
  "firstName": "Tony",
  "userStatus": "normal",
  "profilePhotoUri": '',
  "point": 0,
  "role": "regular"
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

class AccountPage extends Component {
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
    const { expanded } = this.state;
    return (
      <Dashboard>
        <Grid container spacing={24} justify="center">
              <Grid item xs={8}>
                <Typography type="display3" gutterBottom>
                  Account
                </Typography>
              </Grid>
              <Grid item xs={8}>
                <ExpansionPanel expanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography type="body1" className={classes.heading}>Username</Typography>
                    <Typography type="body1" className={classes.secondaryHeading}>{user.username}</Typography>
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
                <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography type="body1" className={classes.heading}>Email</Typography>
                    <Typography type="body1" className={classes.secondaryHeading}>{user.email}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <TextField id="email" type="text" />
                  </ExpansionPanelDetails>
                  <Divider />
                  <ExpansionPanelActions>
                    <Button raised color="primary" className={classes.button}>
                      Save
                    </Button>
                  </ExpansionPanelActions>
                </ExpansionPanel>
                <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography type="body1" className={classes.heading}>Name</Typography>
                    <Typography type="body1" className={classes.secondaryHeading}>{user.firstName + ' '+ user.lastName}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <TextField id="fisrtName" type="text" defaultValue={user.firstName} />
                    <TextField id="lastName" type="text" defaultValue={user.lastName} />
                  </ExpansionPanelDetails>
                  <Divider />
                  <ExpansionPanelActions>
                    <Button raised color="primary" className={classes.button}>
                      Save
                    </Button>
                  </ExpansionPanelActions>
                </ExpansionPanel>
                <ExpansionPanel expanded={expanded === 'panel4'} onChange={this.handleChange('panel4')}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography type="body1" className={classes.heading}>Gender</Typography>
                    <Typography type="body1" className={classes.secondaryHeading}>{user.gender}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Select native id="gender" defaultValue={user.gender}>
                        <option value="">None</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </Select>
                  </ExpansionPanelDetails>
                  <Divider />
                  <ExpansionPanelActions>
                    <Button raised color="primary" className={classes.button}>
                      Save
                    </Button>
                  </ExpansionPanelActions>
                </ExpansionPanel>
                <ExpansionPanel expanded={expanded === 'panel5'} onChange={this.handleChange('panel5')}>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography type="body1" className={classes.heading}>Address</Typography>
                    <Typography type="body1" className={classes.secondaryHeading}>{user.address}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <TextField id="address" type="text" />
                  </ExpansionPanelDetails>
                  <Divider />
                  <ExpansionPanelActions>
                    <Button raised color="primary" className={classes.button}>
                      Save
                    </Button>
                  </ExpansionPanelActions>
                </ExpansionPanel>
              </Grid>
            </Grid>
      </Dashboard>
    );
  }
}

export default withStyles(styles)(AccountPage);
