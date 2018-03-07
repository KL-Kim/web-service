import React, { Component } from 'react';
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

import Header from './Header';
import Footer from './Footer';
import BusinessCard from './utils/BusinessCard';
import ReviewCard from './utils/ReviewCard';
import StoryCard from './utils/StoryCard';
import Sidebar from './setting/Sidebar';



// Mock data
import image from '../../css/logo.svg';

const user = {
  "username": "regularUser0",
  "email": "user0@abc.com",
  "address": "Bla bla bla bla bla",
  "gender": "male",
  "lastName": "Kim",
  "firstName": "Tony",
  "userStatus": "normal",
  "profilePhotoUri": image,
  "point": 0,
  "role": "regular"
};

const business = {
  id: '1',
  title: 'SteakHouse',
  description: 'Awesome Steak House',
  rating: 5
};

const reviews = {
  id: '1',
  userId: '5a4ef8f5537cd042155581a3',
  businessId: '5a4ef8f5537cd042155581a3',
  businessName: 'SteakHouse',
  content: 'Very Delicious',
  rating: 5,
  good: 10,
  bad: 2,
};

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
  root: {
    flexGrow: 1,
    marginTop: 30
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },

  button: {
    margin: theme.spacing.unit,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class UserProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: null
    };
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  }

  render() {
    const { classes } = this.props;
    const { expanded } = this.state;
    return (
      <div>
          <div>
            <Header />
            <Grid container className={classes.root} spacing={16} justify="center" alignItems="top">
              <Grid item xs={2}>
                <Paper className={classes.paper}>
                  <Sidebar />
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Typography type="display3" gutterBottom>
                  Photo
                </Typography>
                <Paper className={classes.paper}>
                  <img src={user.profilePhotoUri} alt={user.username} className={classes.profilePhoto} />
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Typography type="display3" gutterBottom>
                  Profile
                </Typography>
                <ExpansionPanel expandanded={expanded === 'panel1'} onChange={this.handleChange('panel1')}>
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
                <ExpansionPanel expandanded={expanded === 'panel2'} onChange={this.handleChange('panel2')}>
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
                <ExpansionPanel expandanded={expanded === 'panel3'} onChange={this.handleChange('panel3')}>
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
                <ExpansionPanel expandanded={expanded === 'panel4'} onChange={this.handleChange('panel4')}>
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
                <ExpansionPanel expandanded={expanded === 'panel5'} onChange={this.handleChange('panel5')}>
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

              <Grid container className={classes.root} spacing={16} justify="center" alignItems="center">
                <Grid item xs={12}>
                  <Typography type="display3" gutterBottom align="center">
                    My Favor
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <BusinessCard title={business.title} />
                </Grid>
                <Grid item xs={4}>
                  <BusinessCard title={business.title} />
                </Grid>
                <Grid item xs={4}>
                  <BusinessCard title={business.title} />
                </Grid>
              </Grid>
              <Grid container className={classes.root} spacing={16} justify="center" alignItems="center">
                <Grid item xs={12}>
                  <Typography type="display3" gutterBottom align="center">
                    My Story
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <StoryCard businessName={story.businessName}
                    title={story.title}
                    content={story.content}
                    commentCount={story.commentCount}
                    good={story.good}
                    bad={story.bad}
                  />
                </Grid>
                <Grid item xs={4}>
                  <StoryCard businessName={story.businessName}
                    title={story.title}
                    content={story.content}
                    commentCount={story.commentCount}
                    good={story.good}
                    bad={story.bad}
                  />
                </Grid>
                <Grid item xs={4}>
                  <StoryCard businessName={story.businessName}
                    title={story.title}
                    content={story.content}
                    commentCount={story.commentCount}
                    good={story.good}
                    bad={story.bad}
                  />
                </Grid>
              </Grid>
              <Grid container className={classes.root} spacing={16} justify="center" alignItems="center">
                <Grid item xs={12}>
                  <Typography type="display3" gutterBottom>
                    My Reviews
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <ReviewCard businessName={reviews.businessName}
                    content={reviews.content}
                    good={reviews.good}
                    bad={reviews.bad}
                  />
                </Grid>
                <Grid item xs={4}>
                  <ReviewCard businessName={reviews.businessName}
                    content={reviews.content}
                    good={reviews.good}
                    bad={reviews.bad}
                  />
                </Grid>
                <Grid item xs={4}>
                  <ReviewCard businessName={reviews.businessName}
                    content={reviews.content}
                    good={reviews.good}
                    bad={reviews.bad}
                  />
                </Grid>
              </Grid>
            </Grid>
          <Footer />
          </div>
      </div>

    );
  }
}

export default withStyles(styles)(UserProfile);
