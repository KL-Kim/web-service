import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

// Custom Components
import Container from './layout/Container';
import TagSection from './sections/TagSection';
import CategorySection from './sections/CategorySection';

const styles = theme => ({
  "section": {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
  },
});

class ExplorePage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Container>
        <div>
          <CategorySection />

          <Divider className={classes.section} />
          
          <TagSection />
        </div>
      </Container>
    );
  }
}

ExplorePage.propTypes = {
  "classes": PropTypes.object.isRequired,
};

export default withStyles(styles)(ExplorePage);
