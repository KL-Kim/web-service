import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';

// Custom Components
import Container from './layout/Container';
import HomePageCarouselSection from './sections/HomePageCarouselSection';
import HomePagePopularCategorySection from './sections/HomePagePopularCategorySection';
import HomePagePopularBusinessSection from './sections/HomePagePopularBusinessSection';

const styles = theme => ({
  carousel: {
    marginTop: theme.spacing.unit * 8,
    [theme.breakpoints.down('xs')]: {
      marginTop: theme.spacing.unit * 7,
    }
  },
  container: {
    maxWidth: 976,
    margin: 'auto',
    marginBottom: theme.spacing.unit * 8,
    paddingTop: theme.spacing.unit * 4,
    paddingLeft: theme.spacing.unit,
	  paddingRight: theme.spacing.unit,
  },
  section: {
    marginBottom: theme.spacing.unit * 4,
  },
});

class HomePage extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Container>
        <div>
          <div className={classes.carousel}>
            <HomePageCarouselSection />
          </div>
          
          <div className={classes.container}>
            <div className={classes.section}>
              <HomePagePopularCategorySection />
            </div>

            <div className={classes.section}>
              <HomePagePopularBusinessSection />
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

HomePage.propTypes = {
  "classes": PropTypes.object.isRequired,
};

export default withStyles(styles)(HomePage);
