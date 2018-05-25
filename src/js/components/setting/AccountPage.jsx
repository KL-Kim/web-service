import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';

import SettingContainer from './SettingContainer';
import UsernamePanel from './modules/UsernamePanel';
import EmailPanel from './modules/EmailPanel';
import NamePanel from './modules/NamePanel';
import GenderPanel from './modules/GenderPanel';
import AddressPanel from './modules/AddressPanel';
import MobilePanel from './modules/MobilePanel';
import BirthdayPanel from './modules/BirthdayPanel';
import ChangePasswordPanel from './modules/ChangePasswordPanel';
import ChangeAvatarModule from './modules/ChangeAvatarModule';

import { updateUserProfile, uploadProfilePhoto, updateMobilePhone } from '../../actions/user.actions';
import { sendPhoneVerificationCode, sendEmail } from '../../actions/auth.actions'

const styles = (theme) => ({
  "container": {
    "marginBottom": theme.spacing.unit * 6
  },
});

class AccountPage extends Component {

  render() {
    const { classes, user, updatedAt, error, isFetching, errorMessage, updateUserProfile } = this.props;

    return _.isEmpty(user) ? null : (
      <SettingContainer history={this.props.history} location={this.props.location}>
        <div>
          <Grid container justify="center" className={classes.container}>
            <Grid item xs={8}>
              <Typography type="display2">
                Profile
              </Typography>
            </Grid>

            <Grid item xs={8}>
              <UsernamePanel user={user} error={error} errorMessage={errorMessage} isFetching={isFetching}
                updateUserProfile={updateUserProfile} />

              <EmailPanel user={user} error={error} isFetching={isFetching}
                sendEmail={this.props.sendEmail} />

              <ChangePasswordPanel user={user} error={error} isFetching={isFetching}
                sendEmail={this.props.sendEmail} />

              <MobilePanel user={user} error={error} errorMessage={errorMessage} isFetching={isFetching}
                sendPhoneVerificationCode={this.props.sendPhoneVerificationCode}
                updateMobilePhone={this.props.updateMobilePhone}/>

              <NamePanel user={user} error={error} isFetching={isFetching}
                updateUserProfile={updateUserProfile} />

              <GenderPanel user={user} error={error} isFetching={isFetching}
                updateUserProfile={updateUserProfile} />

              <BirthdayPanel user={user} error={error} isFetching={isFetching}
                updateUserProfile={updateUserProfile} />

              <AddressPanel user={user} error={error} isFetching={isFetching}
                updateUserProfile={updateUserProfile} />
            </Grid>
          </Grid>

          <Grid container justify="center" className={classes.container}>
            <Grid item xs={8}>
              <Typography type="display2" align="left">
                Photo
              </Typography>
            </Grid>
            <Grid item xs={8}>
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
