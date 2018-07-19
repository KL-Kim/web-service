import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Custom Components
import SettingContainer from '../layout/SettingContainer';
import UsernamePanel from './panels/UsernamePanel';
import EmailPanel from './panels/EmailPanel';
import NamePanel from './panels/NamePanel';
import GenderPanel from './panels/GenderPanel';
import AddressPanel from './panels/AddressPanel';
import PhonePanel from './panels/PhonePanel';
import BirthdayPanel from './panels/BirthdayPanel';
import ChangePasswordPanel from './panels/ChangePasswordPanel';
import ChangeAvatarModule from './panels/ChangeAvatarModule';

// Actions
import { updateUserProfile, uploadProfilePhoto, updateMobilePhone } from 'js/actions/user.actions';
import { sendPhoneVerificationCode, sendEmail } from 'js/actions/auth.actions'

const styles = (theme) => ({
  "root": {
    maxWidth: 720,
    margin: 'auto'
  },
  "container": {
    "marginBottom": theme.spacing.unit * 4
  },
});

class AccountPage extends Component {

  render() {
    const { classes, user, updatedAt, error, isFetching, errorMessage, updateUserProfile } = this.props;

    return _.isEmpty(user) ? null : (
      <SettingContainer>
        <div className={classes.root}>
          <Grid container justify="center" className={classes.container}>
            <Grid item xs={12}>
              <Typography variant="display1" gutterBottom>
                Profile
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <UsernamePanel
                user={user}
                error={error}
                errorMessage={errorMessage}
                isFetching={isFetching}
                updateUserProfile={updateUserProfile}
              />

              <EmailPanel
                user={user}
                error={error}
                isFetching={isFetching}
                sendEmail={this.props.sendEmail}
              />

              <ChangePasswordPanel
                user={user}
                error={error}
                isFetching={isFetching}
                sendEmail={this.props.sendEmail}
              />

              <PhonePanel
                user={user}
                error={error}
                errorMessage={errorMessage}
                isFetching={isFetching}
                sendPhoneVerificationCode={this.props.sendPhoneVerificationCode}
                updateMobilePhone={this.props.updateMobilePhone}
              />

              <NamePanel
                user={user}
                error={error}
                isFetching={isFetching}
                updateUserProfile={updateUserProfile}
              />

              <GenderPanel
                user={user}
                error={error}
                isFetching={isFetching}
                updateUserProfile={updateUserProfile}
              />

              <BirthdayPanel
                user={user}
                error={error}
                isFetching={isFetching}
                updateUserProfile={updateUserProfile}
              />

              <AddressPanel
                user={user}
                error={error}
                isFetching={isFetching}
                updateUserProfile={updateUserProfile}
              />
            </Grid>
          </Grid>

          <Grid container justify="center" className={classes.container}>
            <Grid item xs={12}>
              <Typography variant="display1" gutterBottom>
                Photo
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <ChangeAvatarModule
                user={user}
                error={error}
                isFetching={isFetching}
                updatedAt={updatedAt}
                uploadProfilePhoto={this.props.uploadProfilePhoto} />
            </Grid>
          </Grid>
        </div>
      </SettingContainer>
    );
  }
}

AccountPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "updatedAt": PropTypes.number,
  "isLoggedIn": PropTypes.bool.isRequired,
  "isFetching": PropTypes.bool,
  "error": PropTypes.bool,
  "errorMessage": PropTypes.string,
  "updateUserProfile": PropTypes.func.isRequired,
  "sendEmail": PropTypes.func.isRequired,
  "updateMobilePhone": PropTypes.func.isRequired,
  "uploadProfilePhoto": PropTypes.func.isRequired,
  "sendPhoneVerificationCode": PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
    "updatedAt": state.userReducer.updatedAt,
    "isLoggedIn": state.userReducer.isLoggedIn,
    "isFetching": state.userReducer.isFetching,
    "error": state.alertReducer.error,
    "errorMessage": state.alertReducer.message,
    "provinces": state.pcaReducer.provinces,
  };
};

export default connect(mapStateToProps, {
  updateUserProfile,
  sendEmail,
  uploadProfilePhoto,
  sendPhoneVerificationCode,
  updateMobilePhone
})(withStyles(styles)(AccountPage));
