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
import CustomButton from 'js/components/utils/Button';
import BusinessPanel from './BusinessPanel';
import HorizontalScrollBar from 'js/components/utils/HorizontalScrollBar';
import ChipsBar from './ChipsBar';

// Actions
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions';

// Common Style
import { chip, chipBar } from 'assets/jss/common.style';

const styles = theme => ({
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

class SearchPageBusinessPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "categories": [],
            "selectedCategory": '',
            "areas": [],
            "area": {},
            "orderBy": '',
            "event": false,
            "originalArea:": {},
            "originalOrderBy": '',
            "originalEvent": false,
            "filterPopoverOpen": false,

            "queryChanged": false,
        };
    }

    componentDidMount() {
        if (!isEmpty(this.props.businessList)) {
            const categories = [];
            const categoryIds = [];
            const areas = [];
            const areaIds = [];
  
            this.props.businessList.map(business => {
                if (!categoryIds.includes(business.category._id)) {
                    categories.push(business.category);
                    categoryIds.push(business.category._id);
                }
    
                if (!areaIds.includes(business.address.area.code)) {
                    areaIds.push(business.address.area.code);
                    areas.push(business.address.area);
                }
    
                return null;
            });
  
            this.setState({
                categories: [...categories],
                areas: [...areas],
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.searchedQuery !== this.props.searchedQuery) {
            this.setState({
                queryChanged: true,
            });
        }

        if (this.state.queryChanged && prevProps.businessList !== this.props.businessList) {
            const categories = [];
            const categoryIds = [];
            const areas = [];
            const areaIds = [];

            this.props.businessList.map(business => {
                if (!categoryIds.includes(business.category._id)) {
                    categories.push(business.category);
                    categoryIds.push(business.category._id);
                }
    
                if (!areaIds.includes(business.address.area.code)) {
                    areaIds.push(business.address.area.code);
                    areas.push(business.address.area);
                }
    
                return null;
            });

            this.setState({
                categories: [...categories],
                areas: [...areas],
                queryChanged: false,
            });
        }
    }

    componentWillUnmount() {
        this.props.clearBusinessList();
      }

    handleOpenFilterPopover = () => {
        this.setState({
            filterPopoverOpen: true,
            originalArea: this.state.area,
            originalOrderBy: this.state.orderBy,
            originalEvent: this.state.event,
        });
    }

    handleCloseFilterPopover = () => {
        this.setState({
            filterPopoverOpen: false,
            area: this.state.originalArea,
            orderBy: this.state.originalOrderBy,
            event: this.state.originalEvent
        });
    }

    handleSelectCategory = slug => {
        this.props.getBusinessList({
            category: slug,
            area: this.state.area.code,
            event: this.state.event,
            orderBy: this.state.orderBy,
            search: this.props.searchedQuery,
        });
    }
    
    handleSelectArea = area => e => {
        if (this.state.area.code !== area.code) {
            this.setState({
                area: {...area},
            });
        }
    }

    handleSelectOrder = item => e => {
        if (this.state.orderBy !== item) {
            this.setState({
                orderBy: item,
            });
        }
    }

    handleToggleEvent = () => {
        this.setState({
            event: !this.state.event,
        });
    }

    handleSubmitFilter = () => {
        this.props.getBusinessList({
            category: this.state.selectedCategory,
            area: this.state.area.code,
            event: this.state.event,
            search: this.props.searchedQuery,
            orderBy: this.state.orderBy,
        });
    
        this.setState({
          filterPopoverOpen: false,
        });
      }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Grid container justify="space-between" alignItems="flex-end">
                    <Grid item>
                        <Typography variant="title" gutterBottom>
                            Business ({this.props.totalCount}) 
                        </Typography>
                    </Grid>

                    <Grid item>
                      <Button
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
                  
                <div>
                    <ChipsBar 
                        chips={this.state.categories} 
                        onSelect={this.handleSelectCategory}
                    />
                </div>


                <BusinessPanel showNoMore />

                <div id="modal-container">
                    <Popover
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        anchorEl={this.filterAnchorEl}
                        open={this.state.filterPopoverOpen}
                        onClose={this.handleCloseFilterPopover}
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
                                    this.state.areas.map(item =>
                                        <Grid item key={item.code}>
                                            <Button
                                                fullWidth
                                                size="small"
                                                color={this.state.area.code === item.code ? 'primary' : 'default'}
                                                variant={this.state.area.code === item.code ? 'raised' : 'text'}
                                                onClick={this.handleSelectArea(item)}
                                            >
                                                {item.name}
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
                                        onClick={this.handleSelectOrder('')}
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
                                        onClick={this.handleSelectOrder('rating')}
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
                                        onClick={this.handleSelectOrder('new')}
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
        );
    }
}

SearchPageBusinessPanel.propTypes = {
    "classes": PropTypes.object.isRequired,
    "searchedQuery": PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
    return {
      "businessList": state.businessReducer.businessList,
      "totalCount": state.businessReducer.totalCount,
    };
};

export default connect(mapStateToProps, {
    getBusinessList,
    clearBusinessList,
})(withStyles(styles)(SearchPageBusinessPanel));