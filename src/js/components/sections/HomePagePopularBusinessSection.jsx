import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import Typography from '@material-ui/core/Typography';

// Custom Components
import BusinessPanel from './BusinessPanel';

// Actions
import { getBusinessList, clearBusinessList } from 'js/actions/business.actions.js';

// Webstorage
import { saveToStorage, loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types.js';

class HomePagePopularBusinessSection extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            businessList: [],
        };
    }

    componentDidMount() {
        const businessList = loadFromStorage(webStorageTypes.WEB_STORAGE_HOMEPAGE_POPULAR_BUSINESS);
        const businessListUpdatedAt = loadFromStorage(webStorageTypes.WEB_STORAGE_HOMEPAGE_POPULAR_BUSINESS_UPDATED_AT);
    
        if ((businessListUpdatedAt + 2 * 60 * 60 * 1000 > Date.now()) || isEmpty(businessList)) {
            this.props.getBusinessList({
                'limit': 18,
                'orderBy': "useful",
            })
            .then(response => {
                if (response) {
                    saveToStorage(webStorageTypes.WEB_STORAGE_HOMEPAGE_POPULAR_BUSINESS, response.list);
                    saveToStorage(webStorageTypes.WEB_STORAGE_HOMEPAGE_POPULAR_BUSINESS_UPDATED_AT, Date.now());
            
                    this.setState({
                        businessList: [...response.list],
                    });
                }
            });
        } 
        else {
            this.setState({
                businessList: [...businessList],
            });
        }
      }
    
    componentWillUnmount() {
        this.props.clearBusinessList();
    }

    render() {
        return (
            <div>
                <Typography variant="title" gutterBottom>Popular Business</Typography>

                <BusinessPanel businessList={this.state.businessList} />
            </div>
        );
    }
}

HomePagePopularBusinessSection.prototypes = {
    getBusinessList: PropTypes.func.isRequired, 
    clearBusinessList: PropTypes.func.isRequired,  
};

export default connect(
    () => ({}),
    { 
        getBusinessList, 
        clearBusinessList,
    }
)(HomePagePopularBusinessSection);