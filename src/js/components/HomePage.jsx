import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

// Custom Components
import Container from './layout/Container';
import SectionCarousel from './sections/SectionCarousel';
import BusinessPanel from './sections/BusinessPanel';
import PopularCategorySection from './sections/PopularCategorySection';

// Actions
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions.js';

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
  componentDidMount() {
    this.props.getBusinessList({
      'limit': 9,
      'orderBy': "useful",
      'event': 1,
    });
  }

  componentWillUnmount() {
    this.props.clearBusinessList();
  }

  render() {
    const { classes } = this.props;

    return (
      <Container>
        <div>
          <div className={classes.carousel}>
              <SectionCarousel />
          </div>
          
          <div className={classes.container}>
            <div className={classes.section}>
              <PopularCategorySection />
            </div>

            <div className={classes.section}>
              <Typography variant="title" gutterBottom>Popular Event</Typography>

              <BusinessPanel />
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

HomePage.propTypes = {
  "classes": PropTypes.object.isRequired,

  // Methods
  getBusinessList: PropTypes.func.isRequired, 
  clearBusinessList: PropTypes.func.isRequired,  
};

const mapStateToProps = (state, ownProps) => {
  return {};
};

export default connect(mapStateToProps, { 
  getBusinessList, 
  clearBusinessList,
})(withStyles(styles)(HomePage));
