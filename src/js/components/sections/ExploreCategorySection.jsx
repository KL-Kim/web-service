import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Helpers
import searchCategoryOrTag from 'js/helpers/searchCategoryOrTag';

const styles = theme => ({
  "section": {
    marginBottom: theme.spacing.unit * 2,
  },
});

class CategorySection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      life: [],
      sports: [],
      tour: [],
    };
  }

  componentDidMount() {
    const categories = searchCategoryOrTag('category', 'ALL');
    
    if (!_.isEmpty(categories)) {
      const life = [];
      const sports = [];
      const tour = [];

      categories.map(item => {
        if(+item.code < 30) {
          life.push(item);
        } else if (+item.code < 50) {
          sports.push(item);
        } else {
          tour.push(item);
        }
      });

      this.setState({
        life: [...life],
        sports: [...sports],
        tour: [...tour],
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.section}>
          <Typography variant="title" gutterBottom>Life</Typography>
          <Grid container spacing={16}>
            {
              this.state.life.map(item =>
                <Grid item xs={4} sm={2} md="auto" key={item._id}>
                  <Link to={"/business/category/" + item.enName}>
                    <Button
                      fullWidth
                      variant="outlined"
                    >
                      {item.krName}
                    </Button>
                  </Link>
                </Grid>
              )
            }
          </Grid>
        </div>

        <div className={classes.section}>
          <Typography variant="title" gutterBottom>Sports</Typography>
          <Grid container spacing={16}>
            {
              this.state.sports.map(item =>
                <Grid item xs={4} sm={2} md="auto" key={item._id}>
                  <Link to={"/business/category/" + item.enName}>
                    <Button
                      fullWidth
                      variant="outlined"
                    >
                      {item.krName}
                    </Button>
                  </Link>
                </Grid>
              )
            }
          </Grid>
        </div>

        <div>
          <Typography variant="title" gutterBottom>Tour</Typography>
          <Grid container spacing={16}>
            {
              this.state.tour.map(item =>
                <Grid item xs={4} sm={2} md="auto" key={item._id}>
                  <Link to={"/business/category/" + item.enName}>
                    <Button
                      fullWidth
                      variant="outlined"
                    >
                      {item.krName}
                    </Button>
                  </Link>
                </Grid>
              )
            }
          </Grid>
        </div>
      </div>
    );
  }
}

CategorySection.propTypes = {
  "classes": PropTypes.object.isRequired,
};

export default withStyles(styles)(CategorySection);
