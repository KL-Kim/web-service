import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
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

import SettingContainer from '../SettingContainer';

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

class BusinessList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: null
    };
  }

  componentDidMount() {
    if (_.isEmpty(this.props.user) || (this.props.user.role !== 'admin')) {
      this.props.history.push('/404');
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (_.isEmpty(nextProps.user) || (nextProps.user.role !== 'admin')) {
      this.props.history.push('/404');
    }
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
      <SettingContainer>
        <Grid container className={classes.root} spacing={16} justify="center" alignItems="center">
          <Grid item xs={12}>
            <Typography type="display3" gutterBottom>
            Business List
            </Typography>
            <Typography type="body1">Search: </Typography>
            <TextField id="username" type="text" />

            <Paper className={classes.paper}>
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
            </Paper>
          </Grid>
        </Grid>
      </SettingContainer>
    );
  }
}

BusinessList.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
  };
};

export default connect(mapStateToProps, {})(withStyles(styles)(BusinessList));
