import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';

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
    marginRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    fontSize: '1rem',
    minWidth: 100,
  },
});

const categories = [
  {
    code: 1101,
    enName: "korean",
    krName: "한식",
    cnName: "韩国料理",
    parent: 11,
  },
  {
    code: 1102,
    enName: "chinese",
    krName: "중식",
    cnName: "中华料理",
    parent: 11,
  },
];

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
      categories: categories.slice(),
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        {
          _.isEmpty(this.state.categories)
            ? null
            : <div className={classes.section}>
                {
                  this.state.categories.map(item =>
                    !item.parent
                      ? <Link to={"/business/category/" + item.enName} key={item._id}>
                          <CustomButton
                            round
                            className={classes.chip}
                          >
                            {item.krName}
                          </CustomButton>
                        </Link>
                      : null
                  )
                }
                <br />
              </div>
        }
        {
          categories.map(category => <div className={classes.section} key={category.code}><CategoryPanel category={category} /></div>)
        }
      </div>
    );
  }
}

CategorySection.propTypes = {
  "classes": PropTypes.object.isRequired,
};

export default withStyles(styles)(CategorySection);
