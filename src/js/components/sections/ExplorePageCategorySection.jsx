import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';


// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
    if (!isEmpty(this.props.categories)) {
      const life = [];
      const sports = [];
      const tour = [];

      this.props.categories.map(item => {
        if(+item.code < 30) {
          life.push(item);
        } else if (+item.code < 50) {
          sports.push(item);
        } else {
          tour.push(item);
        }

        return null;
      });

      this.setState({
        life: [...life],
        sports: [...sports],
        tour: [...tour],
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEmpty(this.props.categories) && prevProps.categories !== this.props.categories ) {
      const life = [];
      const sports = [];
      const tour = [];

      this.props.categories.map(item => {
        if(+item.code < 30) {
          life.push(item);
        } else if (+item.code < 50) {
          sports.push(item);
        } else {
          tour.push(item);
        }

        return null;
      });

      this.setState({
        life: [...life],
        sports: [...sports],
        tour: [...tour],
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.categories !== this.props.categories && !isEmpty(nextProps.categories)) {
      return true;
    } 
    else if (nextState.life !== this.state.life || nextState.sports !== this.state.sports || nextState.tour !== this.state.tour) {
      return true;
    }
    else {
      return false;
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
                  <Link to={{
                      pathname: "/business/category/" + item.enName,
                      hash: '#',
                      state: {
                        category: item
                      }
                    }}
                  >
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
                  <Link to={{
                      pathname: "/business/category/" + item.enName,
                      hash: '#',
                      state: {
                        tag: item
                      }
                    }}
                  >
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
  "categories": PropTypes.array.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    categories: state.categoryReducer.categoriesList
  };
};

export default connect(mapStateToProps, {})(withStyles(styles)(CategorySection));
