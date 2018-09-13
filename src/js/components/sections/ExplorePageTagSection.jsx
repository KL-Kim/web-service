import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Button } from '@material-ui/core';

// Custom Components
import TagBar from './TagBar';

// Actions
import { clearBusinessList } from 'js/actions/business.actions.js';

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
    if (!isEmpty(this.props.tags)) {
      const popular = [];
      const list = [];

      this.props.tags.map(item => {
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

  componentDidUpdate(prevProps) {
    if (!isEmpty(this.props.tags) && this.props.tags !== prevProps.tags) {
      const popular = [];
      const list = [];

      this.props.tags.map(item => {
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

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.tags !== this.props.tags && !isEmpty(nextProps.tags)) {
      return true;
    }
    else if (nextState.popular !== this.state.popular || nextState.list !== this.state.list) {
      return true;
    }
    else {
      return false;
    }
  }

  componentWillUnmount() {
    this.props.clearBusinessList();
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
                <Link to={{
                    pathname: "/business/tag/" + item.enName,
                    hash: '#',
                    state: {
                      tag: item
                    }
                  }}
                >
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
                <TagBar tag={item} />
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

const mapStateToProps = (state, ownProps) => {
  return {
    tags: state.tagReducer.tagsList
  };
};

export default connect(mapStateToProps, {
  clearBusinessList,
})(withStyles(styles)(TagSection));
