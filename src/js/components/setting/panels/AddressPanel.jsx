import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import find from 'lodash/find';

// Material UI Components
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import CircularProgress from '@material-ui/core/CircularProgress';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

// Material UI Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

// Actions
import { getProvinces, getCities, getAreas } from 'js/actions/pca.actions';

const styles = (theme) => ({
  "secondaryHeading": {
    "color": theme.palette.text.secondary,
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
      "provinces": [],
      "cities": [],
      "areas": [],
    };

    this.handlePanelChange = this.handlePanelChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getProvinces()
      .then(response => {
        if (response) {
          this.setState({
            provinces: [...response],
          });
        }
      });
  }

  handlePanelChange = panel => (event, expanded) => {
    this.setState({
      "expanded": expanded ? panel : undefined
    });
  }

  handleChange(e) {
    const { name, value } = e.target;

    switch (name) {
      case 'province':
        this.setState({
          "provinceCode": value,
        });
        this.props.getCities(value)
          .then(response => {
            if (response) {
              this.setState({
                cities: [...response],
              });
            }
          });
        break;

      case 'city':
        this.setState({
          "cityCode": value
        });
        this.props.getAreas(value).then(response => {
          if (response) {
            this.setState({
              areas: [...response],
            });
          }
        });
        break;

      case 'area':
        this.setState({
          "areaCode": value
        });
        break;

      default:
        this.setState({
          [name]: value
        });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const province = find(this.state.provinces, { 'code': this.state.provinceCode });
    const city = find(this.state.cities, { 'code': this.state.cityCode });
    const area = find(this.state.areas, { 'code': this.state.areaCode });

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
      },
    };

    if (!isEmpty(this.props.user)) {
      this.props.updateUserProfile(this.props.user._id, data);
    }
  }

  render() {
    const { classes, user, isFetching } = this.props;
    const { cities, areas } = this.state;

    const area = !isEmpty(user.address) ? (!isEmpty(user.address.area.name) ? user.address.area.name : '') : '';
    const street = !isEmpty(user.address) ? (!isEmpty(user.address.street) ? user.address.street : '') : '';

    return isEmpty(user) ? '' : (
      <ExpansionPanel expanded={this.state.expanded === 'panel'} onChange={this.handlePanelChange('panel')}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
           <Grid container justify="space-between" alignItems="center">
            <Grid item>
              <Typography variant="body2">Address</Typography>
            </Grid>

            <Grid item>
              <Typography variant="body1" className={classes.secondaryHeading}>{area + ' ' + street}</Typography>
            </Grid>
          </Grid>
        </ExpansionPanelSummary>

        <ExpansionPanelDetails>
          <Grid container spacing={16} justify="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="province">Province</InputLabel>
                <Select native
                  name="province"
                  className={classes.input}
                  value={this.state.provinceCode}
                  input={<Input id="province" />}
                  onChange={this.handleChange}
                >
                  <option value="" />
                  {
                    isEmpty(this.state.provinces)
                      ? null
                      : this.state.provinces.map(p => (
                          <option key={p.code} value={p.code}>{p.cnName + ' ' + p.pinyin}</option>
                        ))
                  }
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="city">City</InputLabel>
                <Select native
                  name="city"
                  value={this.state.cityCode}
                  onChange={this.handleChange}
                  input={<Input id="city" />}
                >
                  <option value="" />
                  {
                    isEmpty(cities)
                      ? null
                      : cities.map(c => (
                          <option key={c.code} value={c.code}>{c.cnName + ' ' + c.pinyin}</option>
                        ))
                  }
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="area">Area</InputLabel>
                <Select native
                  name="area"
                  value={this.state.areaCode}
                  onChange={this.handleChange}
                  input={<Input id="area" />}
                >
                  <option value="" />
                  {
                    isEmpty(areas)
                    ? null
                    : areas.map(a => (
                        <option key={a.code} value={a.code}>{a.cnName + ' ' + a.pinyin}</option>
                      ))
                  }
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
          <Button
            size="small"
            onClick={this.handlePanelChange('panel')}
          >
            Cancel
          </Button>
          <Button
            size="small"
            color="primary"
            disabled={isEmpty(this.state.provinceCode)
              || isEmpty(this.state.cityCode)
              || isEmpty(this.state.areaCode)
              || isEmpty(this.state.street)
              || isFetching}
            onClick={this.handleSubmit}
          >
            {
              isFetching ? (<CircularProgress size={20} />) : 'Save'
            }
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
  
  "isFetching": PropTypes.bool,
  "updateUserProfile": PropTypes.func.isRequired,
  "getCities" : PropTypes.func.isRequired,
  "getAreas": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
  };
};

export default connect(mapStateToProps, { getProvinces, getCities, getAreas })(withStyles(styles)(AddressPanel));
