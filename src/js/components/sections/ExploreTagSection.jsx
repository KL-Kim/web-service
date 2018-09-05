import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';

// Custom Components
import TagPanel from './TagPanel';

// Helpers
import searchCategoryOrTag from 'js/helpers/searchCategoryOrTag';

const styles = theme => ({
  "section": {
    marginBottom: theme.spacing.unit * 2,
  },
});

class TagSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popular: [],
      list: [],
    };
  }

  componentDidMount() {
    const tags = searchCategoryOrTag('tag', 'ALL');

    if (!isEmpty(tags)) {
      const popular = [];
      const list = [];

      tags.map(item => {
        if (item.priority === 8) {
          popular.push(item);
        } else if (item.priority === 9) {
          list.push(item);
        }

        this.setState({
          popular: [...popular],
          list: [...list],
        });

        return null;
      })
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        <Typography variant="title" gutterBottom>Popular Tags</Typography>
        
        <Grid container spacing={16} className={classes.section}>
          {
            this.state.popular.map(item =>
              <Grid item xs={4} sm={2} md="auto" key={item._id}> 
                <Link to={"/business/tag/" + item.enName}>
                  <Button
                    variant="outlined"
                    fullWidth
                    className={classes.chip}
                  >
                    #{item.krName}
                  </Button>
                </Link>
              </Grid>
            )
          }
        </Grid>
        
        <div>
          {
            this.state.list.map(item => 
              <div className={classes.section} key={item.code}>
                <TagPanel tag={item} />
              </div>
            )
          }
        </div>
        
      </div>
    );
  }
}

TagSection.propTypes = {
  "classes": PropTypes.object.isRequired,
};

export default withStyles(styles)(TagSection);
