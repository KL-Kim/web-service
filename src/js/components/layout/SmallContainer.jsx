import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    "root": {
        maxWidth: 600,
        margin: 'auto',
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        transform: 'translateY(-50%)',
      },
    "paper": {
        "paddingTop": theme.spacing.unit * 8,
        "paddingBottom": theme.spacing.unit * 8,
        "paddingLeft": theme.spacing.unit * 12,
        "paddingRight": theme.spacing.unit * 12,
        "color": theme.palette.text.secondary,
    
        [theme.breakpoints.down('xs')]: {
          marginLeft: theme.spacing.unit,
          marginRight: theme.spacing.unit,
          "padding": theme.spacing.unit * 4,
        }
    },
});

class SmallContainer extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Paper className={classes.paper}>
                    {this.props.children}
                </Paper>
            </div>
        )
    }
}

SmallContainer.propsTypes = {
    "classes": PropTypes.object.isRequired,
    "children": PropTypes.element.isRequired,
}

export default withStyles(styles)(SmallContainer);