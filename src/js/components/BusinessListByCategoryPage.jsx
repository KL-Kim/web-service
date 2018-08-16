import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Switch from '@material-ui/core/Switch';
import Popover from '@material-ui/core/Popover';
import Divider from '@material-ui/core/Divider';

// Material UI Icons
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

// Custom Components
import Container from './layout/Container';
import CustomButton from './utils/Button';
import BusinessPanel from './sections/BusinessPanel';
import HorizontalScrollBar from 'js/components/utils/HorizontalScrollBar';

// Actions
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions.js';
import { getCategoriesList } from 'js/actions/category.actions.js';
import { getAreas } from 'js/actions/pca.actions.js';

const styles = theme => ({
  "chipBar": {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  "chip": {
    marginRight: theme.spacing.unit,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    fontSize: theme.typography.pxToRem(16),
    width: 'auto',
    display: 'inline-block',
  },
  "popoverContainer": {
    maxWidth: 400,
    padding: theme.spacing.unit * 2,
  },
  "divider": {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class BusinessListPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "limit": 24,
      "orderBy": '',
      "event": false,
      "hasMore": false,
      "count": 0,
      "area": {},
      "tagSlug": '',
      "tags": [],
      "category": {},
      "filterPopoverOpen": false,
    };

    this.loadMore = this.loadMore.bind(this);
    this.handleSelectTag = this.handleSelectTag.bind(this);
    this.handleSelectArea = this.handleSelectArea.bind(this);
    this.handleSelectSort = this.handleSelectSort.bind(this);
    this.handleToggleEvent = this.handleToggleEvent.bind(this);
    this.handleOpenFilterPopover = this.handleOpenFilterPopover.bind(this);
    this.handleCloseFilterPopover = this.handleCloseFilterPopover.bind(this);
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.getCategory = this.getCategory.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.slug) {
      this.getCategory();

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
    if (!_.isEmpty(this.props.match.params.slug) && this.props.match.params.slug !== prevProps.match.params.slug) {
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

  getCategory() {
    this.props.getCategoriesList()
      .then(response => {
        if (response) {
          _.find(response, item => {
            if (item.enName === this.props.match.params.slug) {
              this.setState({
                category: item
              });
            }
          });
        }
      });
  }

  handleSelectTag = slug => e => {
    this.setState({
      hasMore: false,
    });

    if (this.state.tagSlug !== slug) {
      this.props.getBusinessList({
        tag: slug,
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
  
      this.setState({
        tagSlug: slug,
      });
    }
  }

  handleSelectArea = item => e => {
    if (this.state.area.code !== item.code) {
      this.setState({
        area: item,
      });
    }
  }

  handleSelectSort = item => e => {
    if (item !== this.state.orderBy) {
      this.setState({
        orderBy: item,
      });
    }
  }

  handleToggleEvent() {
    this.setState({
      event: !this.state.event,
    });
  }

  handleOpenFilterPopover() {
    this.setState({
      filterPopoverOpen: true,
    });
  }

  handleCloseFilterPopover() {
    this.setState({
      filterPopoverOpen: false,
    });
  }

  handleSubmitFilter() {
    this.setState({
      hasMore: false,
    });
    
    this.props.getBusinessList({
      limit: this.state.limit,
      category: this.state.category.enName,
      tag: this.state.tagSlug,
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

    this.setState({
      filterPopoverOpen: false,
    });
  }

  loadMore() {
    if (this.state.hasMore && !this.props.isFetching) {
      this.props.getBusinessList({
        limit: this.state.count + this.state.limit,
        category: this.state.category.enName,
        tag: this.state.tagSlug,
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
        <div>
          <Grid container justify="space-between" alignItems="flex-end">
            <Grid item>
              <Typography variant="display1">
                {
                  _.isEmpty(this.state.category) ? null : this.state.category.krName
                }
              </Typography>
            </Grid>

            <Grid item>
              <Button
                variant="text"
                color="primary"
                onClick={this.handleOpenFilterPopover}
                buttonRef={node => {
                  this.filterAnchorEl = node;
                }}
              >
                Filter
                {
                  this.state.filterPopoverOpen
                    ? <ArrowDropUp />
                    : <ArrowDropDown />
                }
              </Button>
            </Grid>
          </Grid>
          <Divider />
          
          <div className={classes.chipBar}>
            {
              _.isEmpty(this.state.tags) 
                ? null
                : <HorizontalScrollBar>
                    <CustomButton
                      round
                      color={!this.state.tagSlug ? "primary" : "white"}
                      className={classes.chip}
                      onClick={this.handleSelectTag()}
                    >
                      All
                    </CustomButton>
                    {
                      this.state.tags.map(item => (
                          <CustomButton
                            key={item._id}
                            round
                            color={this.state.tagSlug === item.enName ? "primary" : "white"}
                            className={classes.chip}
                            onClick={this.handleSelectTag(item.enName)}
                          >
                            #{item.krName}
                          </CustomButton>
                      ))
                    }
                  </HorizontalScrollBar>
            }
          </div>

          <BusinessPanel
            hasMore={this.state.hasMore}
            loadMore={this.loadMore}
            showNoMore
          />
          
          <div id="modal-container">
            <Popover
              open={this.state.filterPopoverOpen}
              anchorEl={this.filterAnchorEl}
              onClose={this.handleCloseFilterPopover}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <div className={classes.popoverContainer}>
                <Grid container spacing={8} alignItems="center">
                  <Grid item xs={12}>
                    <Typography variant="body2">District</Typography>
                  </Grid>

                  <Grid item>
                    <Button
                      fullWidth
                      size="small"
                      color={_.isEmpty(this.state.area) ? 'primary' : 'default'}
                      variant={_.isEmpty(this.state.area) ? 'outlined' : 'text'}
                      onClick={this.handleSelectArea('')}
                    >
                      All
                    </Button>
                  </Grid>

                  {
                    this.props.areas.map(item =>
                      <Grid item key={item.code}>
                        <Button
                          fullWidth
                          size="small"
                          color={this.state.area.code === item.code ? 'primary' : 'default'}
                          variant={this.state.area.code === item.code ? 'outlined' : 'text'}
                          onClick={this.handleSelectArea(item)}
                        >
                          {item.cnName}
                        </Button>
                      </Grid>
                    )
                  }

                  <Grid item xs={12}>
                    <Divider className={classes.divider} />
                    <Typography variant="body2">Order by</Typography>
                  </Grid>

                  <Grid item>
                    <Button
                      fullWidth
                      size="small"
                      color={_.isEmpty(this.state.orderBy) ? 'primary' : 'default'}
                      variant={_.isEmpty(this.state.orderBy) ? 'outlined' : 'text'}
                      onClick={this.handleSelectSort('')}
                    >
                      Recommend
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      fullWidth
                      size="small"
                      color={this.state.orderBy === 'rating' ? 'primary' : 'default'}
                      variant={this.state.orderBy === 'rating' ? 'outlined' : 'text'}
                      onClick={this.handleSelectSort('rating')}
                    >
                      Rating
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      fullWidth
                      size="small"
                      color={this.state.orderBy === 'new' ? 'primary' : 'default'}
                      variant={this.state.orderBy === 'new' ? 'outlined' : 'text'}
                      onClick={this.handleSelectSort('new')}
                    >
                      New
                    </Button>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider className={classes.divider} />
                  </Grid>

                  <Grid item>
                    <Typography variant="body2">Event</Typography>
                  </Grid>

                  <Grid item>
                    <FormControl margin="none">
                      <Switch
                        color="primary"
                        checked={this.state.event}
                        onChange={this.handleToggleEvent}
                        value="event"
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider className={classes.divider} />
                <Grid container spacing={8} justify="flex-end" alignItems="center">
                  <Grid item>
                    <Button size="small" onClick={this.handleCloseFilterPopover}>
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button color="primary" size="small" onClick={this.handleSubmitFilter}>
                      Ok
                    </Button>
                  </Grid>
                </Grid>

              </div>
            </Popover>
          </div>
        </div>
      </Container>
    );
  }
}

BusinessListPage.propTypes = {
  "classes": PropTypes.object.isRequired,

  // Methods
  "getBusinessList": PropTypes.func.isRequired,
  "clearBusinessList": PropTypes.func.isRequired,
  "getCategoriesList": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    areas: state.pcaReducer.areas,
  };
};

export default connect(mapStateToProps, { 
  getBusinessList, 
  clearBusinessList,
  getCategoriesList,
  getAreas,
})(withStyles(styles)(BusinessListPage));
