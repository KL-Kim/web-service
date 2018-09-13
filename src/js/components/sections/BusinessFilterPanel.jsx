import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';

const styles = theme => ({
    "section": {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});

class FilterPanel extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            area: {},
            orderBy: '',
            event: false,
        };
    }

    handleSelectArea = area => e => {
        this.setState({
            area: area
        });

        this.props.onSelectArea(area);
    }

    handleSelectSort = orderBy => e => {
        this.setState({
            orderBy: orderBy
        });

        this.props.onSelectSort(orderBy);
    }

    handleToggleEvent = () => {
        this.setState({
            event: !this.state.event
        });

        this.props.onToggleEvent()
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <Collapse in={this.props.open}>
                    {
                        isEmpty(this.props.areas)
                            ?   null
                            :   <div>
                                    <div className={classes.section}>
                                        <Grid container spacing={8} alignItems="center">
                                            <Grid item xs={12}>
                                                <Typography variant="body2">District</Typography>
                                            </Grid>

                                            <Grid item xs={6} sm="auto">
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
                                                    <Grid item key={item.code} xs={6} sm="auto">
                                                        <Button
                                                            fullWidth
                                                            size="small"
                                                            color={this.state.area.code === item.code ? 'primary' : 'default'}
                                                            variant={this.state.area.code === item.code ? 'raised' : 'text'}
                                                            onClick={this.handleSelectArea(item)}
                                                        >
                                                            {item.cnName}-{item.pinyin}
                                                        </Button>
                                                    </Grid>
                                                )
                                            }
                                        </Grid>
                                    </div>
                                    <Divider />
                                </div>
                    }

                    <div className={classes.section}>
                        <Grid container spacing={8} alignItems="center">
                            <Grid item xs={12}>
                                <Typography variant="body2">Order by</Typography>
                            </Grid>
                        
                            <Grid item xs={4} sm="auto">
                                <Button
                                    fullWidth
                                    size="small"
                                    color={isEmpty(this.state.orderBy) ? 'primary' : 'default'}
                                    variant={isEmpty(this.state.orderBy) ? 'raised' : 'text'}
                                    onClick={this.handleSelectSort('')}
                                >
                                    Recommend
                                </Button>
                            </Grid>

                            <Grid item xs={4} sm="auto">
                                <Button
                                    fullWidth
                                    size="small"
                                    color={this.state.orderBy === 'rating' ? 'primary' : 'default'}
                                    variant={this.state.orderBy === 'rating' ? 'raised' : 'text'}
                                    onClick={this.handleSelectSort('rating')}
                                >
                                    Rating
                                </Button>
                            </Grid>

                            <Grid item xs={4} sm="auto">
                                <Button
                                    fullWidth
                                    size="small"
                                    color={this.state.orderBy === 'new' ? 'primary' : 'default'}
                                    variant={this.state.orderBy === 'new' ? 'raised' : 'text'}
                                    onClick={this.handleSelectSort('new')}
                                >
                                    New
                                </Button>
                            </Grid>
                        </Grid>
                    </div>

                    <Divider />

                    <div className={classes.section}>
                        <Grid container spacing={8} alignItems="center">
                            <Grid item>
                                <Typography variant="body2">Event</Typography>
                            </Grid>

                            <Grid item>
                                <FormControl margin="none">
                                    <Switch
                                        value="event"
                                        color="primary"
                                        checked={this.state.event}
                                        onChange={this.handleToggleEvent}
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </div>

                    <Divider />
                </Collapse>
            </div>
        );
    }
}

FilterPanel.prototypes = {
    "classes": PropTypes.object.isRequired,
    "areas": PropTypes.array,
    "onSelectArea": PropTypes.func,
    "onSelectSort": PropTypes.func.isRequired,
    "onToggleEvent": PropTypes.func.isRequired,
};

export default withStyles(styles)(FilterPanel);