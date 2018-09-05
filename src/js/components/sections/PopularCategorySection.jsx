import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Material UI Icons
import Restaurant from '@material-ui/icons/Restaurant';
import LocalBar from '@material-ui/icons/LocalBar';
import LocalHospital from '@material-ui/icons/LocalHospital';
import Dashboard from '@material-ui/icons/Dashboard';
import GolfCourse from '@material-ui/icons/GolfCourse';
import Terrain from '@material-ui/icons/Terrain';

const styles = theme => ({
    item: {
        width: '100%', 
        color: theme.palette.text.secondary, 
        textAlign: "center",
    },
});

class PopularCategorySection extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div>
                <Grid container spacing={16} justify="space-around">
                     <Grid item xs={4} sm='auto'> 
                        <Link to="/business/category/restaurant">
                            <div className={classes.item}>
                                <Restaurant style={{ fontSize: 30 }} />
                                <Typography variant="caption" align="center">맛집</Typography>
                            </div>
                        </Link>
                    </Grid>

                    <Grid item xs={4} sm='auto'> 
                        <Link to="/business/category/nightbar">
                            <div className={classes.item}>
                                <LocalBar style={{ fontSize: 30 }} />
                                <Typography variant="caption" align="center">호프</Typography>
                            </div>
                        </Link>
                    </Grid>

                    <Grid item xs={4} sm='auto'> 
                        <Link to="/business/category/hospital">
                            <div className={classes.item}>
                                <LocalHospital style={{ fontSize: 30 }} />
                                <Typography variant="caption" align="center">병원</Typography>
                            </div>
                        </Link>
                    </Grid>

                    <Grid item xs={4} sm='auto'> 
                        <Link to="/business/category/golf">
                            <div className={classes.item}>
                                <GolfCourse style={{ fontSize: 30 }} />
                                <Typography variant="caption" align="center">골프</Typography>
                            </div>
                        </Link>
                    </Grid>

                    <Grid item xs={4} sm='auto'> 
                        <Link to="/business/category/scenic_area">
                            <div className={classes.item}>
                                <Terrain style={{ fontSize: 30 }} />
                                <Typography variant="caption" align="center">관광명소</Typography>
                            </div>
                        </Link>
                    </Grid>
                    
                    <Grid item xs={4} sm='auto'> 
                        <Link to="/explore">
                            <div className={classes.item}>
                                <Dashboard style={{ fontSize: 30 }} />
                                <Typography variant="caption" align="center">ALL</Typography>
                            </div>
                        </Link>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

PopularCategorySection.prototypes = {
    "classes": PropTypes.object.isRequired,
};

export default withStyles(styles)(PopularCategorySection);