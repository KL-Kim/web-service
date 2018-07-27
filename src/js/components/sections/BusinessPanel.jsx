import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

// Custom Components
import BusinessCard from './cards/BusinessCard';

// WebStorage
import { loadFromStorage } from 'js/helpers/webStorage';
import webStorageTypes from 'js/constants/webStorage.types';

const styles = theme => ({

});

class BusinessPanel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            myFavors: [],
        };
    }

    componentDidMount() {
        if (this.props.isLoggedIn) {
            const myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

            if (myFavors) {
                this.setState({
                    myFavors,
                });
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isLoggedIn !== this.props.isLoggedIn) {
            const myFavors = loadFromStorage(webStorageTypes.WEB_STORAGE_USER_FAVOR) || [];

            if (myFavors) {
                this.setState({
                    myFavors,
                });
            }
        }
    }

    componentWillUnmount() {
        if (this.props.clearBusinessList) {
            this.props.clearBusinessList();
        }   
    }

    render() {
        const { classes, businessList } = this.props;
        let index;

        return _.isEmpty(businessList) ? null : (
            <div>
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.props.loadMore}
                    hasMore={this.props.hasMore}
                    loader={<div style={{ textAlign: 'center' }} key={0}>
                              <CircularProgress size={30} />
                            </div>}
                >
                    <Grid container spacing={16} style={{ marginBottom: 12 }}>
                        {
                            businessList.map(item => {
                                index = this.state.myFavors.indexOf(item._id);

                                return (
                                    <Grid item xs={6} sm={4} key={item._id}>
                                        <BusinessCard
                                            bid={item._id}
                                            title={item.krName}
                                            enName={item.enName}
                                            rating={item.ratingAverage}
                                            thumbnailUri={item.thumbnailUri}
                                            category={item.category}
                                            tags={item.tags}
                                            event={!!(item.event)}

                                            isFavor={index > -1 ? true : false}
                                            isLoggedIn={this.props.isLoggedIn}
                                            userId={this.props.userId}
                                            favorOperation={this.props.favorOperation}
                                            openLoginDialog={this.props.openLoginDialog}
                                        />
                                    </Grid>
                                );
                            })
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
    "userId": '',
    "businessList": [],
    "hasMore": false,
    "loadMore": () => {},
}

BusinessPanel.propTypes = {
    "classes": PropTypes.object.isRequired,
    "businessList": PropTypes.array.isRequired,
    "hasMore": PropTypes.bool,
    "loadMore": PropTypes.func,
    "userId": PropTypes.string,
    "isLoggedIn": PropTypes.bool.isRequired,
    "favorOperation": PropTypes.func.isRequired,
    "openLoginDialog": PropTypes.func,
}

export default withStyles(styles)(BusinessPanel);