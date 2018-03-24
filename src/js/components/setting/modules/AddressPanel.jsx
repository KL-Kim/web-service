import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider';
import Grid from 'material-ui/Grid';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions
} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Select from 'material-ui/Select';
import { CircularProgress } from 'material-ui/Progress';

import { getCities, getAreas } from '../../../actions/pca.actions';
import Provinces from '../../../constants/provinces';

const styles = (theme) => ({
  "button": {
    "margin": theme.spacing.unit,
    "width": 150,
  },
  "heading": {
    "fontSize": theme.typography.pxToRem(15),
    "flexBasis": '40%',
    "flexShrink": 0,
  },
  "secondaryHeading": {
    "fontSize": theme.typography.pxToRem(15),
    "color": theme.palette.text.secondary,
  },
  "formControl": {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
  },
  "chips": {
    display: 'flex',
    flexWrap: 'wrap',
  },
  "chip": {
    margin: theme.spacing.unit / 4,
  },
});

class AddressPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "expanded": null,
      "provinceCode": '',
      "cityCode": '',
      "areaCode": '',
      "street": '',
    };

    this.handlePanelChange = this.handlePanelChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      "expanded": expanded ? panel : undefined
    });
  }

  handleChange(e) {
    const { name, value } = e.target;

    if (_.isEqual('province', name)) {
      this.setState({
        "provinceCode": value,
      });
      this.props.getCities(value);
    }

    if (_.isEqual('city', name)) {
      this.setState({
        "cityCode": value
      });
      this.props.getAreas(value);
    }

    if (_.isEqual('area', name)) {
      this.setState({
        "areaCode": value
      });
    }

    if (_.isEqual('street', name)) {
      this.setState({
        "street": value
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const id = this.props.user._id;

    const province = _.find(Provinces, { 'code': this.state.provinceCode });
    const city = _.find(this.props.cities, { 'code': this.state.cityCode });
    const area = _.find(this.props.areas, { 'code': this.state.areaCode });

    const data = {
      "address": {
        "province": {
          "name": province.cnName,
          "code": province.code,
        },
        "city": {
          "name": city.cnName,
          "code": city.code,
        },
        "area": {
          "name": area.cnName,
          "code": area.code
        },
        "street": this.state.street,
      }
    };

    this.props.updateUserProfile(id, data);
  }

  render() {
    const { classes, user, cities, areas, isFetching } = this.props;
    let { expanded } = this.state;

    let province = !_.isUndefined(user.address) ? (!_.isEmpty(user.address.province.name) ? user.address.province.name : '') : '';
    let city = !_.isUndefined(user.address) ? (!_.isEmpty(user.address.city.name) ? user.address.city.name : '') : '';
    let area = !_.isUndefined(user.address) ? (!_.isEmpty(user.address.area.name) ? user.address.area.name : '') : '';
    let street = !_.isUndefined(user.address) ? (!_.isEmpty(user.address.street) ? user.address.street : '') : '';

    return _.isEmpty(user) ? '' : (
      <ExpansionPanel expanded={expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography type="body1" className={classes.heading}>Address</Typography>
          <Typography type="body1" className={classes.secondaryHeading}>
            {province + ' ' + city + ' ' + area + ' ' + street}
          </Typography>
        </ExpansionPanelSummary>
        <Divider />
        <ExpansionPanelDetails>
          <Grid container spacing={16} justify="center">
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="province">Province</InputLabel>
                <Select native
                  name="province"
                  value={this.state.provinceCode}
                  input={<Input id="province" />}
                  onChange={this.handleChange}
                >
                  <option value="" />
                  {_.isEmpty(Provinces) ? '' : Provinces.map(p => (
                    <option key={p.code} value={p.code}>{p.cnName + ' ' + p.pinyin}</option>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="city">City</InputLabel>
                <Select native
                  name="city"
                  value={this.state.cityCode}
                  onChange={this.handleChange}
                  input={<Input id="city" />}
                >
                  <option value="" />
                    {_.isEmpty(cities) ? '' : cities.map(c => (
                      <option key={c.code} value={c.code}>{c.cnName + ' ' + c.pinyin}</option>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="area">Area</InputLabel>
                <Select native
                  name="area"
                  value={this.state.areaCode}
                  onChange={this.handleChange}
                  input={<Input id="area" />}
                >
                  <option value="" />
                  {_.isEmpty(areas) ? '' : areas.map(a => (
                    <option key={a.code} value={a.code}>{a.cnName + ' ' + a.pinyin}</option>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street"
                id="street"
                type="text"
                name="street"
                value={this.state.street}
                onChange={this.handleChange}
                helperText="Street, deparment, room ..."
              />
            </Grid>
          </Grid>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button raised
            disabled={_.isEmpty(this.state.provinceCode)
              || _.isEmpty(this.state.cityCode)
              || _.isEmpty(this.state.areaCode)
              || _.isEmpty(this.state.street)
              || isFetching}
            onClick={this.handleSubmit}
            color="primary"
            className={classes.button}
          >
            {isFetching ? (<CircularProgress size={20} />) : 'Update'}
          </Button>
          <Button color="primary" className={classes.button} onClick={this.handlePanelChange('panel')}>
            Cancel
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

AddressPanel.propTypes = {
  "classes": PropTypes.object.isRequired,
  "user": PropTypes.object.isRequired,
  "error": PropTypes.bool,
  "citis": PropTypes.array,
  "areas": PropTypes.array,
  "isFetching": PropTypes.bool,
  "updateUserProfile": PropTypes.func.isRequired,
  "getCities" : PropTypes.func.isRequired,
  "getAreas": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "cities": state.pcaReducer.cities,
    "areas": state.pcaReducer.areas,
  };
};

export default connect(mapStateToProps, { getCities, getAreas })(withStyles(styles)(AddressPanel));
