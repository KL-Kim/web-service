import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';

// Custom Components
import Container from 'js/components/layout/Container';
import ExplorePageTagSection from 'js/components/sections/ExplorePageTagSection';
import ExplorePageCategorySection from 'js/components/sections/ExplorePageCategorySection';

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
          <ExplorePageCategorySection />

          <Divider className={classes.divider} />
          
          <ExplorePageTagSection />
        </div>
      </Container>
    );
  }
}

ExplorePage.propTypes = {
  "classes": PropTypes.object.isRequired,
};

export default withStyles(styles)(ExplorePage);
