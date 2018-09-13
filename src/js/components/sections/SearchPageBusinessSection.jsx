import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';


// Material UI Icons
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

// Custom Components
import BusinessPanel from './BusinessPanel';
import BusinessFilterPanel from './BusinessFilterPanel';
import ChipsBar from './ChipsBar';

// Actions
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions';

class SearchPageBusinessPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "categories": [],
            "selectedCategory": '',
            "orderBy": '',
            "event": false,
            "originalArea:": {},
            "originalOrderBy": '',
            "originalEvent": false,
            "isFilterPanelOpen": false,

            "queryChanged": false,
        };
    }

    componentDidMount() {
        if (!isEmpty(this.props.businessList)) {
            const categories = [];
            const categoryIds = [];
  
            this.props.businessList.map(business => {
                if (!categoryIds.includes(business.category._id)) {
                    categories.push(business.category);
                    categoryIds.push(business.category._id);
                }
    
                return null;
            });
  
            this.setState({
                categories: [...categories],
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

            this.props.businessList.map(business => {
                if (!categoryIds.includes(business.category._id)) {
                    categories.push(business.category);
                    categoryIds.push(business.category._id);
                }
    
                return null;
            });

            this.setState({
                categories: [...categories],
                queryChanged: false,
            });
        }
    }

    handleOpenFilterPopover = () => {
        this.setState({
            isFilterPanelOpen: !this.state.isFilterPanelOpen,
        });
    }

    handleSelectCategory = category => {
        if (this.state.selectedCategory !== category.enName) {
            this.setState({
                selectedCategory: category.enName,
            });

            this.props.getBusinessList({
                category: category.enName,
                event: this.state.event,
                orderBy: this.state.orderBy,
                search: this.props.searchedQuery,
            });
        }
    }

    handleSelectSort = orderBy => {
        if (this.state.orderBy !== orderBy) {
            this.setState({
                orderBy: orderBy,
            });

            this.props.getBusinessList({
                category: this.state.selectedCategory,
                event: this.state.event,
                search: this.props.searchedQuery,
                orderBy: orderBy,
            });
        }
    }

    handleToggleEvent = () => {
        this.setState({
            event: !this.state.event,
        });

        this.props.getBusinessList({
            category: this.state.selectedCategory,
            event: !this.state.event,
            search: this.props.searchedQuery,
            orderBy: this.state.orderBy,
        });
    }


    render() {
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
                    onSelectSort={this.handleSelectSort}
                    onToggleEvent={this.handleToggleEvent}
                />
                  
                <div>
                    <ChipsBar 
                        chips={this.state.categories} 
                        onSelect={this.handleSelectCategory}
                    />
                </div>


                <BusinessPanel showNoMore />

                <div id="modal-container">
                   
                </div>
            </div>
        );
    }
}

SearchPageBusinessPanel.propTypes = {
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
})(SearchPageBusinessPanel);