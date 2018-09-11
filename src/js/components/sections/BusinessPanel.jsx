import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';

// Custom Components
import BusinessCard from './cards/BusinessCard';

// WebStorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

// Actions
import { openLoginDialog } from 'js/actions/app.actions'; 
import { favorOperation } from 'js/actions/user.actions';


class BusinessPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            myFavors: [],
        };
    }

    componentDidMount() {
        if (this.props.isLoggedIn) {
            if (!isEmpty(this.props.user) && !isEmpty(this.props.user.favors)) {
                this.setState({
                    myFavors: [...this.props.user.favors]
                })
            } else {
                const myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

                if (myFavors) {
                    this.setState({
                        myFavors: [...myFavors],
                    });
                }
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user !== this.props.user) {
            if (!isEmpty(this.props.user) && !isEmpty(this.props.user.favors)) {
                this.setState({
                    myFavors: [...this.props.user.favors]
                })
            } else {
                const myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

                if (myFavors) {
                    this.setState({
                        myFavors: [...myFavors],
                    });
                }
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.businessList !== this.props.businessList) {
            return true;
        } 
        else if (nextProps.hasMore !== this.props.hasMore) {
            return true;
        } 
        else if (nextProps.user !== this.props.user) {
            return true;
        }
        else if (nextState.myFavors !== this.state.myFavors) {
            return true;
        }
        else {
            return false;
        }
    }

    render() {
        const { businessList } = this.props;

        if (this.props.getEmptyList) {
            return <Typography align="center">None</Typography>
        }
        
        return isEmpty(businessList) 
            ? null 
            : (
                <div>
                    <InfiniteScroll
                        pageStart={0}
                        hasMore={this.props.hasMore}
                        loadMore={this.props.loadMore}
                        loader={<div style={{ textAlign: 'center' }} key={0}>
                                    <CircularProgress size={30} />
                                </div>}
                    >
                        <Grid container spacing={16} style={{ marginBottom: 12 }}>
                            {
                                businessList.map(item => (
                                    <Grid item xs={12} sm={4} key={item._id}>
                                        <BusinessCard
                                            bid={item._id}
                                            title={item.krName}
                                            slug={item.enName}
                                            rating={item.ratingAverage}
                                            image={isEmpty(item.mainImage) ? '' : item.mainImage.url}
                                            category={item.category}
                                            tags={item.tags}
                                            event={!!(item.event)}

                                            isFavor={this.state.myFavors.includes(item._id)}
                                            isLoggedIn={this.props.isLoggedIn}
                                            userId={isEmpty(this.props.user) ? '' : this.props.user._id}

                                            openLoginDialog={this.props.openLoginDialog}
                                            favorOperation={this.props.favorOperation}
                                        />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </InfiniteScroll>
                    {
                        !this.props.hasMore && this.props.showNoMore
                            ?   <Typography variant="caption" align="center">
                                    --- No More ---
                                </Typography>
                            : null
                    }
                </div>
        )
    }
}

BusinessPanel.defaultProps = {
    "isLoggedIn": false,
    "hasMore": false,
    "getEmptyList": false,
    "loadMore": () => {},
};

BusinessPanel.propTypes = {
    "businessList": PropTypes.array.isRequired,
    "isFetching": PropTypes.bool.isRequired,
    "getEmptyList": PropTypes.bool.isRequired,
    "hasMore": PropTypes.bool,
    "loadMore": PropTypes.func,

    "isLoggedIn": PropTypes.bool.isRequired,
    "user": PropTypes.object.isRequired,
    "favorOperation": PropTypes.func.isRequired,
    "openLoginDialog": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
    return {
        "isLoggedIn": state.userReducer.isLoggedIn,
        "user": state.userReducer.user,
        "businessList": isEmpty(ownProps.businessList) ? state.businessReducer.businessList : ownProps.businessList,
        "totalCount": state.businessReducer.totalCount,
        "isFetching": state.businessReducer.isFetching,
        "getEmptyList": state.businessReducer.getEmptyList,
    };
};

export default connect(mapStateToProps, {
    openLoginDialog,
    favorOperation,
})(BusinessPanel);