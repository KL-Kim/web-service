import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';

// Custom Components
import CustomButton from 'js/components/utils/Button';
import HorizontalScrollBar from 'js/components/utils/HorizontalScrollBar';

// Common Style
import { chip, chipBar } from 'assets/jss/common.style';

const styles = theme => ({
    "chip": chip(theme),
    "chipBar": chipBar(theme),
});

class ChipsBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: '',
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.chips !== this.props.chips) {
            return true;
        }
        else if (nextState.selected !== this.state.selected) {
            return true;
        }
        else {
            return false;
        }
    }

    handleSelect = item => e => {
        this.props.onSelect(item);

        this.setState({
            selected: item
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <HorizontalScrollBar className={classes.chipBar}>
                    <CustomButton
                        color={isEmpty(this.state.selected) ? "primary" : 'white'}
                        round
                        className={classes.chip}
                        onClick={this.handleSelect('')}
                    >
                        All
                    </CustomButton>

                    {
                        isEmpty(this.props.chips)
                            ?   null
                            :   this.props.chips.map(item => (
                                    <CustomButton
                                        key={item._id}
                                        color={this.state.selected === item.enName ? "primary" : 'white'}
                                        round
                                        className={classes.chip}
                                        onClick={this.handleSelect(item.enName)}
                                    >
                                        {item.krName}
                                    </CustomButton>
                                ))
                    }
                </HorizontalScrollBar>
            </div>
        )
    }
}

ChipsBar.prototypes = {
    "classes": PropTypes.object.isRequired,
    "chips": PropTypes.array.isRequired,
    "onSelect": PropTypes.func.isRequired,
}

export default withStyles(styles)(ChipsBar);