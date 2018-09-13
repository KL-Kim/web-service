import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

// Material UI Icons
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

// Custom Components
import Container from './layout/Container';
import BusinessPanel from './sections/BusinessPanel';
import ChipsBar from './sections/ChipsBar';
import BusinessFilterPanel from './sections/BusinessFilterPanel';

// Actions
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions.js';
import { getCategoriesList } from 'js/actions/category.actions.js';
import { getTagsList } from 'js/actions/tag.actions.js';

// Common Style
import { root } from 'assets/jss/common.style';

const styles = theme => ({
  "root": root(theme),
});

class BusinessListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "limit": 24,
      "area": {},
      "orderBy": '',
      "event": false,
      "hasMore": false,
      "count": 0,
      "selectedTag": '',
      "tags": [],
      "category": {},
      "isFilterPanelOpen": false,
    };

    if (!isEmpty(props.location.state) && !isEmpty(props.location.state.category)) {
      this.state.category = {...props.location.state.category}
    }
  }

  componentDidMount() {
    if (this.props.match.params.slug) {
      if (isEmpty(this.state.category)) this.getCategory();

      this.props.getTagsList()
        .then(tags => {
          if (!isEmpty(tags)) {

            const targets = tags.filter(item => 
              !isEmpty(item.category) && item.category.enName === this.props.match.params.slug
            );

            this.setState({
              tags: [...targets]
            });
          }
        })

      this.props.getBusinessList({
        'limit': this.state.limit,
        'category': this.props.match.params.slug,
      })
      .then(response => {
        if (response) {
          this.setState({
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (!isEmpty(this.props.match.params.slug) && this.props.match.params.slug !== prevProps.match.params.slug) {
      this.getCategory();

      this.props.getBusinessList({
        'limit': this.state.limit,
        'category': this.props.match.params.slug,
      })
      .then(response => {
        if (response) {
          this.setState({
            "area": '',
            "orderBy": '',
            "event": false,
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
      });
    }
  }

  componentWillUnmount() {
    this.props.clearBusinessList();
  }

  getCategory = () => {
    this.props.getCategoriesList()
      .then(response => {
        if (response) {
          const category = response.find(item => item.enName === this.props.match.params.slug);

          this.setState({
            category: {...category}
          });
        }
      });
  }

  handleSelectTag = tag => {
    if (tag.enName !== this.state.selectedTag) {
      this.setState({
        hasMore: false,
        selectedTag: tag.enName,
      });

      this.props.getBusinessList({
        tag: tag.enName,
        limit: this.state.limit,
        category: this.state.category.enName,
        area: this.state.area.code,
        event: this.state.event,
        orderBy: this.state.orderBy,
      })
      .then(response => {
        if (response) {
          this.setState({
            count: response.list.length,
            hasMore: response.list.length < response.totalCount,
          });
        }
      });
    }
  }

  handleToggleFilterPanel = () => {
    this.setState({
      isFilterPanelOpen: !this.state.isFilterPanelOpen,
    });
  }

  handleSelectArea = area => {
    if (this.state.area.code !== area.code) {
      this.setState({
        hasMore: false
      });

      this.props.getBusinessList({
        area: area.code,
        limit: this.state.limit,
        category: this.state.category.enName,
        tag: this.state.selectedTag,
        event: this.state.event,
        orderBy: this.state.orderBy,
      })
      .then(response => {
        if (response) {
          this.setState({
            area: {...area},
            count: response.list.length,
            hasMore: response.list.length < response.totalCount
          });
        }
      });
    }
  }

  handleSelectSort = orderBy => {
    if (orderBy !== this.state.orderBy) {
      this.setState({
        hasMore: false
      });

      this.props.getBusinessList({
        orderBy: orderBy,
        limit: this.state.limit,
        category: this.state.category.enName,
        tag: this.state.selectedTag,
        area: this.state.area.code,
        event: this.state.event,
      })
      .then(response => {
        if (response) {
          this.setState({
            orderBy,
            count: response.list.length,
            hasMore: response.list.length < response.totalCount
          });
        }
      });
    }
  }

  handleToggleEvent = () => {
    this.setState({
      hasMore: false
    });

    this.props.getBusinessList({
      event: !this.state.event,
      limit: this.state.limit,
      category: this.state.category.enName,
      tag: this.state.selectedTag,
      area: this.state.area.code,
      orderBy: this.state.orderBy,
    })
    .then(response => {
      if (response) {
        this.setState({
          event: !this.state.event,
          count: response.list.length,
          hasMore: response.list.length < response.totalCount
        });
      }
    });
  }

  loadMore = () => {
    if (this.state.hasMore && !this.props.isFetching) {
      this.props.getBusinessList({
        limit: this.state.count + this.state.limit,
        category: this.state.category.enName,
        tag: this.state.selectedTag,
        area: this.state.area.code,
        event: this.state.event,
        orderBy: this.state.orderBy,
      })
      .then(response => {
        if (response) {
          this.setState({
            count: response.list.length,
            hasMore: response.list.length < response.totalCount
          });
        }
      });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Container>
        <div className={classes.root}>
          <Grid container justify="space-between" alignItems="flex-end">
            <Grid item>
              <Typography variant="display1">
                {
                  isEmpty(this.state.category) ? null : this.state.category.krName
                }
              </Typography>
            </Grid>

            <Grid item>
              <Button
                variant="text"
                color="primary"
                onClick={this.handleToggleFilterPanel}
              >
                Filter
                {
                  this.state.isFilterPanelOpen
                    ? <ArrowDropUp />
                    : <ArrowDropDown />
                }
              </Button>
            </Grid>
          </Grid>

          <Divider />

          <BusinessFilterPanel 
            open={this.state.isFilterPanelOpen}
            areas={this.props.areas}
            onSelectArea={this.handleSelectArea}
            onSelectSort={this.handleSelectSort}
            onToggleEvent={this.handleToggleEvent}
          />
          
          <div className={classes.chipBar}>
            {
              isEmpty(this.state.tags) 
                ? null
                : <ChipsBar chips={this.state.tags} type="tag" onSelect={this.handleSelectTag}/>
            }
          </div>

          <BusinessPanel
            hasMore={this.state.hasMore}
            loadMore={this.loadMore}
            showNoMore
          />
          
        </div>
      </Container>
    );
  }
}

BusinessListPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "areas": PropTypes.array.isRequired,

  // Methods
  "getBusinessList": PropTypes.func.isRequired,
  "clearBusinessList": PropTypes.func.isRequired,
  "getCategoriesList": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    areas: state.pcaReducer.areas,
    isFetching: state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { 
  getBusinessList, 
  clearBusinessList,
  getCategoriesList,
  getTagsList,
})(withStyles(styles)(BusinessListPage));
