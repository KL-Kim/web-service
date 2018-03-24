import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withStyles } from 'material-ui/styles';
import Avatar from 'material-ui/Avatar';

import config from '../../config/config';

const styles = theme => ({
  "avatar": {
    "margin": 0,
  },
  "medium": {
    "margin": 0,
    "width": 150,
    "height": 150,
    "fontSize": "6em"
  },
  "big": {
    "margin": 0,
    "width": 250,
    "height": 250,
    "fontSize": "10em",
  },
});

class AvatarModule extends Component {
  render() {
    const { classes, type, user, updatedAt } = this.props;
    let avatar;
    let avatarSrc = _.isEmpty(user) ? '' : config.API_GATEWAY_ROOT + '/' + user.profilePhotoUri + '?t=' + updatedAt;
    let initial = _.isEmpty(user.lastName) ? _.upperCase(user.username[0]) :  _.upperCase(user.lastName[0]);

    switch (type) {
      case "BIG":
        avatar = _.isEmpty(user.profilePhotoUri)
          ? (<Avatar className={classes.big}>{initial}</Avatar>)
          : (<Avatar className={classes.big} alt={user.username[0]} src={avatarSrc} />);
        break;

      case "MEDIUM":
        avatar = _.isEmpty(user.profilePhotoUri)
          ? (<Avatar className={classes.medium}>{initial}</Avatar>)
          : (<Avatar className={classes.medium} alt={user.username[0]} src={avatarSrc} />);
        break;

      default:
        avatar = _.isEmpty(user.profilePhotoUri)
          ? (<Avatar className={classes.avatar}>{initial}</Avatar>)
          : (<Avatar className={classes.avatar} alt={user.username[0]} src={avatarSrc} />);
    }

    return avatar;
  }
}

AvatarModule.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.string,
  user: PropTypes.object,
  updatedAt: PropTypes.number,
};

export default withStyles(styles)(AvatarModule);
