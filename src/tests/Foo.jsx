import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { NavLink } from 'react-router-dom';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

import Container from '../js/components/Container';

const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 5,
    color: theme.palette.text.secondary
  }
});

const propTypes = {
  buttonName: PropTypes.string.isRequired
};

const defaultProps = {};

class Foo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Grid container>
          <Grid item>
            <NavLink to="/">
              <Button id="button">{this.props.buttonName}</Button>
            </NavLink>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

Foo.propTypes = propTypes;
Foo.defaultProps = defaultProps;

// withStyles is not compatible with Jest
export default withStyles(styles)(Foo);
