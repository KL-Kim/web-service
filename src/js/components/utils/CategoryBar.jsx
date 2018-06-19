import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

// Material UI Components
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';

// Actions
import { getCategoriesList } from '../../actions/category.actions.js';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing.unit,
  }
});

class CategoryBar extends Component {
  componentDidMount() {
    this.props.getCategoriesList({
      limit: 8,
      orderBy: 'priority',
    });
  }

  render() {
    const { classes, categories } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={24} justify="center" alignItems="center">
          {
            _.isEmpty(categories)
              ? ''
              : categories.map(item => (
                <Grid item xs={3} key={item._id}>
                  <Link to={"/business/category/" + item.enName}>
                    <Button color="primary">
                      {item.krName}
                    </Button>
                  </Link>
                </Grid>
              ))
          }
        </Grid>
      </div>
    );
  }
}

CategoryBar.propTypes = {
  "classes": PropTypes.object.isRequired,
  "categories": PropTypes.array.isRequired,
  "isFetching": PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "categories": state.categoryReducer.categoriesList,
    "isFetching": state.categoryReducer.isFetching,
  };
};

export default connect(mapStateToProps, { getCategoriesList })(withStyles(styles)(CategoryBar));
