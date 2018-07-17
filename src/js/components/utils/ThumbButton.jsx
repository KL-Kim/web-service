import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

// Material UI Icons
import ThumbUp from '@material-ui/icons/ThumbUp';
import ThumbDown from '@material-ui/icons/ThumbDown';

const styles = theme => ({
  "iconNum": {
    fontSize: '1rem',
    marginLeft: theme.spacing.unit,
  },
});

class ThumbButton extends Component {
  render() {
    const { classes } = this.props;
    let button;

    switch (this.props.type) {
      case 'up':
        button = <ThumbUp color={this.props.disabled ? "inherit" : "primary"} />
        break;

      case 'down':
        button = <ThumbDown color="inherit" />
        break;

      default:
        button = <ThumbUp disabled />
    }

    return (
      <IconButton onClick={this.props.handleSubmit} disabled={this.props.disabled}>
        {button}
        <span className={classes.iconNum}>{this.props.count}</span>
      </IconButton>
    );
  }
}

ThumbButton.propTypes = {
  "classes": PropTypes.object.isRequired,
  "type": PropTypes.oneOf(['up', 'down']),
  "count": PropTypes.number,
  "disabled": PropTypes.bool,
  "handleSubmit": PropTypes.func,
};

export default withStyles(styles)(ThumbButton);
