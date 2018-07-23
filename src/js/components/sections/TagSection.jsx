import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';

// Custom Components
import CustomButton from 'js/components/utils/Button';
import TagPanel from './TagPanel';

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

const tags = [
  {
    code: 11,
    enName: "bbq",
    krName: "불고기",
    cnName: "烧烤",
  },
  {
    code: 12,
    enName: "buffet",
    krName: "뷔페",
    cnName: "自助餐",
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
      tags: tags.slice(),
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.wrapper}>
        {
          _.isEmpty(this.state.tags)
            ? null
            : <div className={classes.section}>
                {
                  this.state.tags.map(item =>
                    item.priority > 7
                      ? <Link to={"/business/tag/" + item.enName} key={item._id}>
                          <CustomButton
                            color="primary"
                            round
                            className={classes.chip}
                          >
                            {item.krName}
                          </CustomButton>
                        </Link>
                      : null
                  )
                }
              </div>
        }

        {
          tags.map(tag => <div className={classes.section} key={tag.code}><TagPanel tag={tag} /></div>)
        }
      </div>
    );
  }
}

TagSection.propTypes = {
  "classes": PropTypes.object.isRequired,
};

export default withStyles(styles)(TagSection);
