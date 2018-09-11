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
        "& .icon": {
            fontSize: 35
        }
    },

});

const items = [
    {
        code: 11,
        cnName: "美食",
        enName: "restaurant",
        krName:"맛집",
        icon: "Restaurant"
    },
    {
        "code": 12,
        "krName": "호프",
        "cnName": "酒吧",
        "enName": "nightbar",
        "icon": "LocalBar"
    },
    {
        "code": 21,
        "krName": "병원",
        "cnName": "医院",
        "enName": "hospital",
        "icon": "LocalHospital"
    },
    {
        "code": 41,
        "krName": "골프",
        "cnName": "高尔夫",
        "enName": "golf",
        "icon": "GolfCourse"
    },
    {
        "code": 51,
        "krName": "관광명소",
        "cnName": "风景区",
        "enName": "scenic_area",
        "icon": "Terrain"
    },
];


class PopularCategorySection extends Component {
    getIcon = name => {
        switch (name) {
            case "restaurant":
                return <Restaurant className="icon" />;
    
            case "nightbar":
                return <LocalBar className="icon" />;
    
            case "hospital":
                return <LocalHospital className="icon" />;
    
            case "golf":
                return <GolfCourse className="icon" />;
            
            case "scenic_area":
                return <Terrain className="icon" />;
        
            default:
                return null;
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Grid container spacing={16} justify="space-around">
                    {
                        items.map(item => (
                            <Grid item xs={4} sm="auto" key={item.code}>
                                <Link to={{
                                        pathname: "/business/category/" + item.enName,
                                        hash: '#',
                                        state: {
                                            category: item
                                        }
                                    }}
                                >
                                    <div className={classes.item}>
                                        {this.getIcon(item.enName)}
                                        <Typography variant="caption" align="center">{item.krName}</Typography>
                                    </div>
                                </Link>
                            </Grid>                            
                        ))
                    }
                    
                    <Grid item xs={4} sm='auto'> 
                        <Link to="/explore">
                            <div className={classes.item}>
                                <Dashboard className="icon" />
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