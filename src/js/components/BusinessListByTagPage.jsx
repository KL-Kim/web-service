import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';

// Material UI Icons
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

// Custom Components
import Container from './layout/Container';
import BusinessPanel from './sections/BusinessPanel';

// Actions
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions';
import { getTagsList } from 'js/actions/tag.actions';

// Common Style
import { root, chip, chipBar } from 'assets/jss/common.style';

const styles = theme => ({
  "root": root(theme),
  "chip": chip(theme),
  "chipBar": chipBar(theme),
  "popoverContainer": {
    maxWidth: 400,
    padding: theme.spacing.unit * 2,
  },
  "divider": {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
});

class BusinessListByTag extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "limit": 48,
      "count": 0,
      "area": {},
      "orderBy": '',
      "event": false,
      "originalArea:": {},
      "originalOrderBy": '',
      "originalEvent": false,
      "hasMore": false,
      "filterPopoverOpen": false,
      "tag": {},
    };
    
    if (!isEmpty(props.location.state) && !isEmpty(props.location.state.tag)) {
      this.state.tag = {...props.location.state.tag}
    } 

    this.getTag = this.getTag.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.handleSelectArea = this.handleSelectArea.bind(this);
    this.handleSelectOrderBy = this.handleSelectOrderBy.bind(this);
    this.handleToggleEventSwtich = this.handleToggleEventSwtich.bind(this);
    this.handleOpenFilterPopover = this.handleOpenFilterPopover.bind(this);
    this.handleCloseFilterPopover = this.handleCloseFilterPopover.bind(this);
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.slug) {
      if(isEmpty(this.state.tag)) this.getTag();

      this.props.getBusinessList({
        limit: this.state.limit,
        tag: this.props.match.params.slug,
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
      if (!isEmpty(this.props.location.state) && !isEmpty(this.props.location.state.tag)) {
        this.setState({
          tag: {...this.props.location.state.tag}
        })
      } else {
        this.getTag();
      }

      this.props.getBusinessList({
        limit: this.state.limit,
        tag: this.props.match.params.slug,
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

  getTag() {
    this.props.getTagsList()
      .then(response => {
        if (response) {
          const tag = response.find(item => item.enName === this.props.match.params.slug);

          this.setState({
            tag: {...tag}
          });
        }
      });
  }

  handleSubmitFilter() {
    this.props.getBusinessList({
      limit: this.state.limit,
      category: this.state.categorySlug,
      tag: this.props.match.params.slug,
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
      filterPopoverOpen: false,
    });
  }

  handleSelectArea = area => e => {
    if (this.state.area.code !== area.code) {
      this.setState({
        area: {...area},
      });
    }
  }

  handleSelectOrderBy = item => e => {
    if (this.state.orderBy !== item) {
      this.setState({
        orderBy: item,
      });
    }
  }

  handleToggleEventSwtich() {
    this.setState({
      event: !this.state.event,
    })
  }

  handleOpenFilterPopover() {
    this.setState({
      filterPopoverOpen: true,
      originalArea: this.state.area,
      originalOrderBy: this.state.orderBy,
      originalEvent: this.state.event,
    });
  }

  handleCloseFilterPopover() {
    this.setState({
      filterPopoverOpen: false,
      area: this.state.originalArea,
      orderBy: this.state.originalOrderBy,
      event: this.state.originalEvent
    });
  }

  loadMore() {
    if (this.state.hasMore) {
      this.props.getBusinessList({
        limit: this.state.count + this.state.limit,
        tag: this.props.match.params.slug,
        category: this.state.categorySlug,
        area: this.state.area.code,
        event: this.state.event,
        search: this.state.s,
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

  render() {
    const { classes } = this.props;

    return (
      <Container>
        <div className={classes.root}>
          <Grid container justify="space-between" alignItems="flex-end">
            <Grid item>
              <Typography variant="display1">#{this.state.tag.krName}</Typography>
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
          <br />
          
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
                      color={isEmpty(this.state.area) ? 'primary' : 'default'}
                      variant={isEmpty(this.state.area) ? 'raised' : 'text'}
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
                          variant={this.state.area.code === item.code ? 'raised' : 'text'}
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
                      color={isEmpty(this.state.orderBy) ? 'primary' : 'default'}
                      variant={isEmpty(this.state.orderBy) ? 'raised' : 'text'}
                      onClick={this.handleSelectOrderBy('')}
                    >
                      Recommend
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      fullWidth
                      size="small"
                      color={this.state.orderBy === 'rating' ? 'primary' : 'default'}
                      variant={this.state.orderBy === 'rating' ? 'raised' : 'text'}
                      onClick={this.handleSelectOrderBy('rating')}
                    >
                      Rating
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      fullWidth
                      size="small"
                      color={this.state.orderBy === 'new' ? 'primary' : 'default'}
                      variant={this.state.orderBy === 'new' ? 'raised' : 'text'}
                      onClick={this.handleSelectOrderBy('new')}
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
                        onChange={this.handleToggleEventSwtich}
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
    )
  }

}

BusinessListByTag.propTypes = {
  "classes": PropTypes.object.isRequired,
  "areas": PropTypes.array.isRequired,

  // Methods
  "getTagsList": PropTypes.func.isRequired,
  "getBusinessList": PropTypes.func.isRequired,
  "clearBusinessList": PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    areas: state.pcaReducer.areas,
  };
};

export default connect(mapStateToProps, { 
  getBusinessList, 
  clearBusinessList,
  getTagsList,
})(withStyles(styles)(BusinessListByTag));
