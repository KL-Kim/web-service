import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

// Custom Components
import CustomButton from 'js/components/utils/Button';
import CategoryPanel from './CategoryPanel';

// Helpers
import searchCategoryOrTag from 'js/helpers/searchCategoryOrTag';

const styles = theme => ({
  "section": {
    marginBottom: theme.spacing.unit * 4,
  },
  "chip": {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    fontSize: '1rem',
    width: 'auto',
  },
});

class CategorySection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
    };
  }

  componentDidMount() {
    const categories = searchCategoryOrTag('category', 'ALL');

    this.setState({
      categories: [...categories],
    });
  }

  render() {
    const { classes } = this.props;

    return _.isEmpty(this.state.categories) ? null :(
      <div>
        <div className={classes.section}>
          <Typography variant="title" gutterBottom>Category</Typography>
          <div>
            {
              this.state.categories.map(item =>
                  <Link to={"/business/category/" + item.enName} key={item._id}>
                    <CustomButton
                      color="white"
                      round
                      className={classes.chip}
                    >
                      {item.krName}
                    </CustomButton>
                  </Link>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

CategorySection.propTypes = {
  "classes": PropTypes.object.isRequired,
};

export default withStyles(styles)(CategorySection);
