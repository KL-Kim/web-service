import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import upperCase from 'lodash/upperCase';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const styles = theme => ({
  "normal": {
    "margin": 0,
  },
  "small": {
    "margin": 'auto',
    "width": 70,
    "height": 70,
    "fontSize": "2em"
  },
  "medium": {
    "margin": 'auto',
    "width": 100,
    "height": 100,
    "fontSize": "4em"
  },
  "big": {
    "margin": 'auto',
    "width": 150,
    "height": 150,
    "fontSize": "5rem",
  },
});

class AvatarModule extends Component {
  render() {
    if (isEmpty(this.props.user)) return null;

    const { classes, type, user, updatedAt } = this.props;

    let className;

    switch (type) {
      case "BIG":
        className = classes.big;
        break;

      case "MEDIUM":
        className = classes.medium;
        break;

      case "SMALL":
        className = classes.small;
        break;

      default:
        className = classes.normal;
    }

    return isEmpty(user.avatarUrl) 
      ? <Avatar className={className}>{upperCase(user.username[0])}</Avatar>
      : <Avatar className={className} alt={user.username[0]} src={user.avatarUrl + '?t=' + updatedAt} />
    ;
  }
}

AvatarModule.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  type: PropTypes.string,
};

export default withStyles(styles)(AvatarModule);
