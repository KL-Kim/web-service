import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';

import SettingContainer from './SettingContainer';
import UsernamePanel from './modules/UsernamePanel';
import EmailPanel from './modules/EmailPanel';
import NamePanel from './modules/NamePanel';
import GenderPanel from './modules/GenderPanel';
import AddressPanel from './modules/AddressPanel';
import MobilePanel from './modules/MobilePanel';
import BirthdayPanel from './modules/BirthdayPanel';

import { updateUserProfile } from '../../actions/user.actions';

const styles = (theme) => ({
  "container": {
    "marginBottom": theme.spacing.unit * 6
  },
  "paper": {
    "padding": theme.spacing.unit * 5,
    "color": theme.palette.text.secondary
  },
  "button": {
    "margin": theme.spacing.unit,
  },
  "avatar": {
    "margin": 0,
    "width": 100,
    "height": 100,
  },
  "bigAvatar": {
    "margin": "0 auto",
    "marginBottom": theme.spacing.unit,
    "width": 200,
    "height": 200,
    "fontSize": "5em",
  },
  "bigDivider": {
    "marginTop": theme.spacing.unit * 2,
    "marginBottom": theme.spacing.unit * 2
  },
});

class AccountPage extends Component {
  componentWillReceiveProps(nextProps, nextState) {
    if (!nextProps.isLoggedIn) {
      this.props.history.push('/');
    }
  }

  render() {
    const { history, classes, user, error } = this.props;

    return _.isEmpty(user) ? null : (
      <SettingContainer history={history}>
        <div>
          <Grid container justify="center" className={classes.container}>
            <Grid item xs={8}>
              <Typography type="display2">
                Profile
              </Typography>
            </Grid>

            <Grid item xs={8}>
              <UsernamePanel user={user} error={error} updateUserProfile={this.props.updateUserProfile} />
              <EmailPanel user={user} error={error} updateUserProfile={this.props.updateUserProfile} />
              <MobilePanel user={user} error={error} updateUserProfile={this.props.updateUserProfile} />
              <NamePanel user={user} error={error} updateUserProfile={this.props.updateUserProfile} />
              <GenderPanel user={user} error={error} updateUserProfile={this.props.updateUserProfile} />
              <BirthdayPanel user={user} error={error} updateUserProfile={this.props.updateUserProfile} />
              <AddressPanel user={user} error={error} updateUserProfile={this.props.updateUserProfile} />
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
                        {_.isEmpty(user.profilePhotoUri)
                          ? (<Avatar className={classes.bigAvatar}>{_.isEmpty(user.username) ? '' : _.upperCase(user.username[0])}</Avatar>)
                          : (<Avatar src={user.profilePhotoUri} alt={user.username} className={classes.bigAvatar} />)}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container justify="center">
                      <Grid item>
                        {_.isEmpty(user.profilePhotoUri)
                          ? (<Avatar className={classes.avatar}>{_.isEmpty(user.username) ? '' : _.upperCase(user.username[0])}</Avatar>)
                          : (<Avatar src={user.profilePhotoUri} alt={user.username} className={classes.avatar} />)}
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
                <Button raised color="primary">Send email</Button>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </SettingContainer>
    );
  }
}

AccountPage.propTypes = {
  "user": PropTypes.object,
  "isLoggedIn": PropTypes.bool.isRequired,
  "error": PropTypes.object,
  "updateUserProfile": PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "error": state.userReducer.error,
    "provinces": state.pcaReducer.provinces,
  };
};

export default connect(mapStateToProps, { updateUserProfile })(withStyles(styles)(AccountPage));
