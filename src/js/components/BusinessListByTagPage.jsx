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
import BusinessFilterPanel from './sections/BusinessFilterPanel';

// Actions
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions';
import { getTagsList } from 'js/actions/tag.actions';

// Common Style
import { root } from 'assets/jss/common.style';

const styles = theme => ({
  "root": root(theme),
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
      
      "hasMore": false,
      "isFilterPanelOpen": false,
      "tag": {},
    };
    
    if (!isEmpty(props.location.state) && !isEmpty(props.location.state.tag)) {
      this.state.tag = {...props.location.state.tag}
    }
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

  getTag = () => {
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

  handleToggleFilterPanel = () => {
    this.setState({
      isFilterPanelOpen: !this.state.isFilterPanelOpen,
    });
  }

  handleSelectArea = area => {
    if (this.state.area.code !== area.code) {
      this.setState({
        hasMore: false,
      });

      this.props.getBusinessList({
        area: area.code,
        limit: this.state.limit,
        tag: this.props.match.params.slug,
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
        hasMore: false,
      });

      this.props.getBusinessList({
        orderBy: orderBy,
        limit: this.state.limit,
        tag: this.props.match.params.slug,
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
      hasMore: false,
    });

    this.props.getBusinessList({
      event: !this.state.event,
      limit: this.state.limit,
      tag: this.props.match.params.slug,
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

          <BusinessFilterPanel 
            open={this.state.isFilterPanelOpen}
            areas={this.props.areas}
            onSelectArea={this.handleSelectArea}
            onSelectSort={this.handleSelectSort}
            onToggleEvent={this.handleToggleEvent}
          />

          <Divider />
          <br />
          
          <BusinessPanel
            hasMore={this.state.hasMore}
            loadMore={this.loadMore} 
            showNoMore
          />

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
    isFetching: state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, { 
  getBusinessList, 
  clearBusinessList,
  getTagsList,
})(withStyles(styles)(BusinessListByTag));
