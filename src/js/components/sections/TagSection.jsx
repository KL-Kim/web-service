import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

// Custom Components
import CustomButton from 'js/components/utils/Button';
import HorizontalScrollBar from 'js/components/utils/HorizontalScrollBar';
import TagPanel from './TagPanel';

// Helpers
import searchCategoryOrTag from 'js/helpers/searchCategoryOrTag';

const styles = theme => ({
  "section": {
    marginBottom: theme.spacing.unit * 4,
  },
  "chip": {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    fontSize: theme.typography.pxToRem(15),
    minWidth: 100,
  },
});

const tags = [
  {
    code: 1,
    enName: "korean_restaurant",
    krName: "한식",
    cnName: "韩式料理",
  },
  {
    code: 11,
    enName: "bbq",
    krName: "불고기",
    cnName: "烧烤",
  },
];

class TagSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: [],
    }
  }

  componentDidMount() {
    const tags = searchCategoryOrTag('tag', 'ALL');

    this.setState({
      tags: [...tags],
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        <Typography variant="title" gutterBottom>Popular Tags</Typography>
        {
          _.isEmpty(this.state.tags)
            ? null
            : <div className={classes.section}>
                <HorizontalScrollBar>
                  {
                    this.state.tags.map(item =>
                      item.priority === 9
                        ? <Link to={"/business/tag/" + item.enName} key={item._id}>
                            <CustomButton
                              color="white"
                              round
                              className={classes.chip}
                            >
                              #{item.krName}
                            </CustomButton>
                          </Link>
                        : null
                    )
                  }
                </HorizontalScrollBar>
              </div>
        }

        {
          tags.map(tag => (
            <div className={classes.section} key={tag.code}>
              <TagPanel tag={tag} />
            </div>
          ))
        }
      </div>
    );
  }
}

TagSection.propTypes = {
  "classes": PropTypes.object.isRequired,
};

export default withStyles(styles)(TagSection);
