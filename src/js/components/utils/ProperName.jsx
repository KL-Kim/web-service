import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class ProperName extends Component {
  render() {
    const { user } = this.props;

    if (_.isEmpty(user)) return <span>Empty user</span>;

    let name;

    if (user.firstName || user.lastName) {
      name = user.firstName + ' ' + user.lastName;
    } else {
      name = user.username
    }

    return (<span>{name}</span>);
  }
}

ProperName.propTypes = {
  "user": PropTypes.object.isRequired,
}

export default ProperName;
