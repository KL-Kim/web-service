import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Restaurant from '@material-ui/icons/Restaurant';

const icon = "Restaurant"

const styles = theme => ({
    card: {
        marginRight: theme.spacing.unit * 2,
    },
});

class PopularCategorySection extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div>
                <Typography variant="title" gutterBottom>Popular Categories</Typography>
                    
                <Grid container spacing={16} justify="space-around">
                    {
                        this.props.categories.map(item => {
                            if (item.priority > 7) {
                                return (
                                    <Grid item xs={4} sm='auto' key={item._id}>
                                        <Link to={"/business/category/" + item.enName}>
                                            <div style={{ width: '100%', color: '#111'}}>
                                                
                                                <Restaurant style={{ fontSize: 50 }} />
                                                
                                                <div> 
                                                    <Typography align="center">{item.krName}</Typography>
                                                </div>
                                            </div>
                                        </Link>
                                    </Grid>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                    <Grid item xs={4} sm='auto'> 
                        <Link to="/explore">
                            <Button fullWidth>All</Button>
                        </Link>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(PopularCategorySection);