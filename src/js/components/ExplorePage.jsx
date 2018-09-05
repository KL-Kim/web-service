import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

// Custom Components
import Container from 'js/components/layout/Container';
import ExploreTagSection from 'js/components/sections/ExploreTagSection';
import ExploreCategorySection from 'js/components/sections/ExploreCategorySection';

// Common Style
import { root } from 'assets/jss/common.style';

const styles = theme => ({
  "root": root(theme),
  "divider": {
    marginTop: theme.spacing.unit * 4,
    marginBottom: theme.spacing.unit * 4,
  },
});

class ExplorePage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Container>
        <div className={classes.root}>
          <ExploreCategorySection />

          <Divider className={classes.divider} />
          
          <ExploreTagSection />
        </div>
      </Container>
    );
  }
}

ExplorePage.propTypes = {
  "classes": PropTypes.object.isRequired,
};

export default withStyles(styles)(ExplorePage);
