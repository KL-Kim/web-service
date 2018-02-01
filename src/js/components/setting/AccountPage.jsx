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
import Paper from 'material-ui/Paper';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl, FormControlLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Avatar from 'material-ui/Avatar';


import SettingBorder from './SettingBorder';
import ChangeModule from './ChangeModule';

// Mock data
import image from '../../../css/ikt-icon.gif';
const user = {
    "id": "5a4ef8f5537cd042155581a5",
    "username": "tony",
    "email": "tony@abc.com",
    "mobileNumber": "123-1234-1234",
    "role": "admin",
    "firstName": "Tony",
    "lastName": "Kim",
    "gender": "male",
    "address": {
      "province": "jiangsu",
      "city": "nanjing",
      "area": "xuanwu",
      "street": "仙林文枢东路7号晴天广场2F"
    },
    "point": 0,
    "userStatus": "normal",
    "profilePhotoUri": image,
    "lastLoginAt": "2017-05-11T14-00-32Z",
    "createdAt": "2015-01-01T00-00-00Z"
};



const styles = (theme) => ({
  paper: {
    padding: theme.spacing.unit * 5,
    color: theme.palette.text.secondary
  },
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
  formControl: {
    minWidth: 200,
  },
  profilePhoto: {
    width: 200,
    height: 200
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: '50%'
  },
  container: {
    marginBottom: theme.spacing.unit * 6
  },
  bigDivider: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2
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
      <SettingBorder>
        <Grid container justify="center" className={classes.container}>
          <Grid item xs={8}>
            <Typography type="display2">
              Profile
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
                <TextField
                  fullWidth
                  error
                  label="New username"
                  id="username"
                  type="text"
                  helperText="Error: This username unavailable"
                />
              </ExpansionPanelDetails>
              <ExpansionPanelActions>
                <Button raised disabled={true} color="primary" className={classes.button}>
                  Update
                </Button>
                <Button color="primary" className={classes.button} onClick={this.handleChange('panel1')}>
                  Cancel
                </Button>
              </ExpansionPanelActions>
            </ExpansionPanel>

            <ExpansionPanel expanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography type="body1" className={classes.heading}>Email</Typography>
                <Typography type="body1" className={classes.secondaryHeading}>{user.email}</Typography>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails>
                <ChangeModule name="email" />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography type="body1" className={classes.heading}>Name</Typography>
                <Typography type="body1" className={classes.secondaryHeading}>{user.firstName + ' '+ user.lastName}</Typography>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails>
                <Grid container spacing={16} justify="center">
                  <Grid item lg={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      id="firstName"
                      type="text"
                    />
                  </Grid>
                  <Grid item lg={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      id="lastName"
                      type="text"
                    />
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
              <ExpansionPanelActions>
                <Button raised disabled={true} color="primary" className={classes.button}>
                  Update
                </Button>
                <Button color="primary" className={classes.button} onClick={this.handleChange('panel3')}>
                  Cancel
                </Button>
              </ExpansionPanelActions>
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'panel4'} onChange={this.handleChange('panel4')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography type="body1" className={classes.heading}>Gender</Typography>
                <Typography type="body1" className={classes.secondaryHeading}>{user.gender}</Typography>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails>
                <FormControl fullWidth >
                  <RadioGroup
                      row
                      aria-label="gender"
                      name="gender"
                      value={user.gender}>
                    <FormControlLabel value="" control={<Radio />} label="none" />
                    <FormControlLabel value="male" control={<Radio />} label="male" />
                    <FormControlLabel value="female" control={<Radio />} label="female" />
                  </RadioGroup>
                </FormControl>
              </ExpansionPanelDetails>
              <ExpansionPanelActions>
                <Button raised disabled={true} color="primary" className={classes.button}>
                  Update
                </Button>
                <Button color="primary" className={classes.button} onClick={this.handleChange('panel4')}>
                  Cancel
                </Button>
              </ExpansionPanelActions>
            </ExpansionPanel>
            <ExpansionPanel expanded={expanded === 'panel5'} onChange={this.handleChange('panel5')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography type="body1" className={classes.heading}>Address</Typography>
                <Typography type="body1" className={classes.secondaryHeading}>{user.address.city + ' ' + user.address.street}</Typography>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails>
                <Grid container spacing={16} justify="center">
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="province">Province</InputLabel>
                      <Select native value={user.address.province} input={<Input id="province" />}>
                          <option value="">None</option>
                          <option value="jiangsu">Jiangsu</option>
                          <option value="beijing">Beijing</option>
                          <option value="shanghai">Shanghai</option>
                      </Select>
                    </FormControl>

                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="city">City</InputLabel>
                      <Select native value={user.address.province} input={<Input id="city" />}>
                          <option value="">None</option>
                          <option value="nanjing">南京</option>
                          <option value="suzhou">苏州</option>
                          <option value="wuxi">无锡</option>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="area">District</InputLabel>
                      <Select native value={user.address.province} input={<Input id="area" />}>
                          <option value="">None</option>
                          <option value="xuanwu">玄武</option>
                          <option value="qinhuai">秦淮</option>
                          <option value="biaxia">白下</option>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street"
                      id="street"
                      type="text"
                      defaultValue={user.address.street}
                      helperText="Street, deparment, room ..."
                    />
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>

              <ExpansionPanelActions>
                <Button raised disabled={true} color="primary" className={classes.button}>
                  Update
                </Button>
                <Button color="primary" className={classes.button} onClick={this.handleChange('panel5')}>
                  Cancel
                </Button>
              </ExpansionPanelActions>
            </ExpansionPanel>

            <ExpansionPanel expanded={expanded === 'panel6'} onChange={this.handleChange('panel6')}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography type="body1" className={classes.heading}>Telephone</Typography>
                <Typography type="body1" className={classes.secondaryHeading}>{user.mobileNumber}</Typography>
              </ExpansionPanelSummary>
              <Divider />
              <ExpansionPanelDetails>
                <ChangeModule name="telephone" />
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </Grid>

        <Grid container justify="center" className={classes.container}>
          <Grid item xs={8}>
            <Typography type="display2" align="left">
              Photo
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Paper className={classes.paper}>
              <Grid container spacing={0} justify="center" alignItems="center">
                <Grid item xs={6}>
                  <Grid container justify="center">
                    <Grid item>
                      <img src={user.profilePhotoUri} alt={user.username} className={classes.profilePhoto} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Grid container justify="center">
                    <Grid item>
                      <Avatar alt={user.username} src={user.profilePhotoUri} className={classes.avatar} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Divider className={classes.bigDivider}/>
                  <Grid container justify="center">
                    <Grid item>
                      <Button raised color="primary" className={classes.button}>Add a photo</Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

        </Grid>

        <Grid container justify="center" className={classes.container}>
          <Grid item xs={8}>
            <Typography type="display2">
              Change password
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Paper className={classes.paper}>
              <Button raised color="primary">Send links</Button>
            </Paper>
          </Grid>
        </Grid>
      </SettingBorder>
    );
  }
}

export default withStyles(styles)(AccountPage);
