import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import Quill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Table, { TableBody, TableCell, TableHead, TableRow, } from 'material-ui/Table';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Select from 'material-ui/Select';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { MenuItem } from 'material-ui/Menu';
import Checkbox from 'material-ui/Checkbox';
import { ListItemText } from 'material-ui/List';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import Search from 'material-ui-icons/Search';
import Chip from 'material-ui/Chip';
import { FormControl, FormControlLabel, FormLabel } from 'material-ui/Form';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Switch from 'material-ui/Switch';
import Badge from 'material-ui/Badge';
import { CircularProgress } from 'material-ui/Progress';
import AddCircleOutline from 'material-ui-icons/AddCircleOutline';

import SettingContainer from '../setting/SettingContainer';
import ConfirmationDialog from '../utils/ConfirmationDialog';
import BusinessImagesModule from './BusinessImagesModule';
import Provinces from '../../constants/provinces';
import { getCategoriesList } from '../../actions/category.actions.js';
import { getTagsList } from '../../actions/tag.actions.js';
import { getCities, getAreas } from '../../actions/pca.actions';
import {
  getBusinessList,
  addBusiness,
  updateBusiness,
  deleteBusiness,
  getSingleBusiness,
  uploadImages,
  deleteImage
} from '../../actions/business.actions';

const languageList = [
  '中文',
  '한국어',
  'English',
  '日本语'
];

const paymentList = [
  'Alipay',
  'Wechat Pay',
  'UnionPay',
  'VISA',
  'MasterCard',
];

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote', 'code', ],
    [{'color': []}, {'background': []}],
    [{ 'align': [] }, {'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['clean']
  ]
};

const format = ['header',
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code',
  'color', 'background',
  'list', 'bullet', 'indent',
];

const styles = (theme) => ({
  "paper": {
    padding: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2,
  },
  "buttonContainer": {
    "display": "flex",
    "justifyContent": "flex-end",
  },
  "button": {
    "margin": theme.spacing.unit,
    "width": 150,
  },
  "progress": {
    margin: theme.spacing.unit * 2,
  },
  "chip": {
    margin: theme.spacing.unit,
  },
  "badge": {
    margin: theme.spacing.unit * 2,
  },
  "title": {
    paddingRight: theme.spacing.unit * 2,
  },
});

class SingleBusinessPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "category": {
        _id: '',
        code: '',
        krName: '',
        cnName: '',
        enName: '',
      },
      "tags": [],
      state: 'draft',
      cnName: '',
      krName: '',
      enName: '',
      tel: '',
      priceRange: '',
      supportedLanguage: [],
      payment: [],
      delivery: '',
      status: 'normal',
      "address": {
        province: {
          name: '',
          code: '',
        },
        city: {
          name: '',
          code: '',
        },
        area: {
          name: '',
          code: '',
        },
        street: '',
      },
      "geo": {
        lat: 0,
        long: 0,
      },
      openningHoursSpec: {
        mon: '',
        tue: '',
        wed: '',
        thurs: '',
        thu: '',
        fri: '',
        sat: '',
        sun: '',
      },
      rest: '',
      chains: [],
      description: '',
      ratingAverage: 0,
      "viewsCount": 0,
      "favoredCount": 0,
      "event": '',
      menu: [],
      "reports": [],
      thumbnailUri: {},
      imagesUri: [],
    }

    this.state._id = _.isUndefined(this.props.location.state.businessId) ? '' : this.props.location.state.businessId;
    this.state.search = '';
    this.state.isNew = false;
    this.state.addMenuDialogOpen = false;
    this.state.menuIndex = null;
    this.state.newMenuName = '';
    this.state.newMenuPrice = '';
    this.state.newMenuIsHot = false;
    this.state.newMenuIsNew = false;
    this.state.chainDialogOpen = false;
    this.state.confirmationDialogOpen = false;
    this.state.reportDialogOpen = false;
    this.state.reportIsCheck = false;
    this.state.reportContent = '';
    this.state.reportIndex = '';

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.handleChangeAddress = this.handleChangeAddress.bind(this);
    this.handleChangeOpenningSpec = this.handleChangeOpenningSpec.bind(this);
    this.handleOpenSubDepartmentsDialog = this.handleOpenSubDepartmentsDialog.bind(this);
    this.handleCloseSubDepartmentsDialog = this.handleCloseSubDepartmentsDialog.bind(this);
    this.handleOpenAddMenuDialog = this.handleOpenAddMenuDialog.bind(this);
    this.handleCloseAddMenuDialog = this.handleCloseAddMenuDialog.bind(this);
    this.handleAddNewMenu = this.handleAddNewMenu.bind(this);
    this.handleMenuRowClick = this.handleMenuRowClick.bind(this);
    this.handleDeleteMenu = this.handleDeleteMenu.bind(this);
    this.handleOpenConfimationDialog = this.handleOpenConfimationDialog.bind(this);
    this.handleCloseConfirmationDialog = this.handleCloseConfirmationDialog.bind(this);
    this.handleMenuSwitch = this.handleMenuSwitch.bind(this);
    this.handleChainRowClick = this.handleChainRowClick.bind(this);
    this.handleDeleteChainChip = this.handleDeleteChainChip.bind(this);
    this.handleSearchBusiness = this.handleSearchBusiness.bind(this);
    this.updateBusinessImages = this.updateBusinessImages.bind(this);
    this.handleDeleteBusiness = this.handleDeleteBusiness.bind(this);
    this.handleReportsRowClick = this.handleReportsRowClick.bind(this);
    this.handleCloseReportDialog = this.handleCloseReportDialog.bind(this);
    this.handleDeleteReport = this.handleDeleteReport.bind(this);
    this.handleDescriptionEditorChange = this.handleDescriptionEditorChange.bind(this);
    this.handleEventEditorChange = this.handleEventEditorChange.bind(this);
  }

  componentDidMount() {
    if (_.isEmpty(this.props.categoriesList)) {
      this.props.getCategoriesList();
    }

    if (_.isEmpty(this.props.tagsList)) {
      this.props.getTagsList();
    }

    if (this.state._id)
      this.props.getSingleBusiness("id", this.state._id, this.props.admin._id).then(business => {
        if (_.isEmpty(business)) return ;

        this.setState({
          "_id": business._id || '',
          "category": {
            _id: _.isEmpty(business.category) ? '' : business.category._id,
            code: _.isEmpty(business.category) ? '' : business.category.code || '',
            krName: _.isEmpty(business.category) ? '' : business.category.krName || '',
            cnName: _.isEmpty(business.category) ? '' : business.category.cnName || '',
            enName: _.isEmpty(business.category) ? '' : business.category.enName || '',
          },
          state: business.state || '',
          cnName: business.cnName || '',
          krName: business.krName || '',
          enName: business.enName || '',
          tel: business.tel || '',
          priceRange: business.priceRange || '',
          supportedLanguage: business.supportedLanguage || '',
          payment: business.payment || '',
          delivery: business.delivery || '',
          status: business.status || '',
          "address": {
            province: {
              name: business.address.province.name || '',
              code: business.address.province.code || '',
            },
            city: {
              name: business.address.city.name || '',
              code: business.address.city.code || '',
            },
            area: {
              name: business.address.area.name || '',
              code: business.address.area.code || '',
            },
            street: business.address.street || '',
          },
          "geo": {
            lat: business.geo.lat || 0,
            long: business.geo.long || 0,
          },
          "openningHoursSpec": {
            mon: _.isEmpty(business.openningHoursSpec) ? '' : (business.openningHoursSpec.mon || ''),
            tue: _.isEmpty(business.openningHoursSpec) ? '' : (business.openningHoursSpec.tue || ''),
            wed: _.isEmpty(business.openningHoursSpec) ? '' : (business.openningHoursSpec.wed || ''),
            thu: _.isEmpty(business.openningHoursSpec) ? '' : (business.openningHoursSpec.thu || ''),
            fri: _.isEmpty(business.openningHoursSpec) ? '' : (business.openningHoursSpec.fri || ''),
            sat: _.isEmpty(business.openningHoursSpec) ? '' : (business.openningHoursSpec.sat || ''),
            sun: _.isEmpty(business.openningHoursSpec) ? '' : (business.openningHoursSpec.sun || ''),
          },
          rest: business.rest || '',
          chains: _.isEmpty(business.chains) ? [] : business.chains.slice(),
          description: business.description || '',
          "viewsCount": business.viewsCount || 0,
          "favoredCount": business.favoredCount || 0,
          ratingAverage: business.ratingAverage || 0,
          "event": business.event || '',
          menu: _.isEmpty(business.menu) ? [] : business.menu.slice(),
          reports: _.isEmpty(business.reports) ? [] : business.reports.slice(),
          thumbnailUri: {
            "default": _.isEmpty(business.thumbnailUri) ? '' : business.thumbnailUri.default,
            "hd": _.isEmpty(business.thumbnailUri) ? '' : business.thumbnailUri.hd,
          },
          imagesUri: _.isEmpty(business.imagesUri) ? [] : business.imagesUri.slice(),
        });

        if (!_.isEmpty(business.tags)) {
          let tags = [];

          business.tags.map(tag => tags.push(tag.krName));

          this.setState({
            tags: tags.slice()
          });
        }
      });
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleChangeCategory(e) {
    const { name, value } = e.target;

    if (name === 'category') {
      this.setState({
        "category": {
          _id: value._id,
          code: value.code,
          krName: value.krName,
          cnName: value.cnName,
          enName: value.enName,
        }
      });
    }
  }

  handleChangeAddress(e) {
    const { name, value } = e.target;

    switch (name) {
      case 'province':
        this.setState({
          "address": {
            ...this.state.address,
            "province": {
              name: value.name,
              code: value.code
            },
            "city": {
              name: '',
              code: ''
            },
            "area": {
              name: '',
              code: ''
            }
          }
        });
        this.props.getCities(value.code);
        break;

      case 'city':
        this.setState({
          "address": {
            ...this.state.address,
            "city": {
              name: value.name,
              code: value.code
            },
            "area": {
              name: '',
              code: ''
            }
          }
        });
        this.props.getAreas(value.code);
        break;

      case 'area':
        this.setState({
          "address": {
            ...this.state.address,
            "area": {
              name: value.name,
              code: value.code
            }
          }
        });
        break;

      case 'street':
        this.setState({
          "address": {
            ...this.state.address,
            "street": value
          }
        });
        break;

      case 'lat':
        this.setState({
          "geo": {
            ...this.state.geo,
            "lat": value,
          }
        });
        break;

      case 'long':
        this.setState({
          "geo": {
            ...this.state.geo,
            "long": value,
          }
        });
        break;

      default:
        this.setState({
          [name]: value
        });
    }
  }

  handleChangeOpenningSpec(e) {
    const { name, value } = e.target;

    switch (name) {
      case 'mon':
        this.setState({
          "openningHoursSpec": {
            ...this.state.openningHoursSpec,
            "mon": value,
          }
        });
        break;

      case 'tue':
        this.setState({
          "openningHoursSpec": {
            ...this.state.openningHoursSpec,
            "tue": value,
          }
        });
        break;

      case 'wed':
        this.setState({
          "openningHoursSpec": {
            ...this.state.openningHoursSpec,
            "wed": value,
          }
        });
        break;

      case 'thu':
        this.setState({
          "openningHoursSpec": {
            ...this.state.openningHoursSpec,
            "thu": value,
          }
        });
        break;

      case 'fri':
        this.setState({
          "openningHoursSpec": {
            ...this.state.openningHoursSpec,
            "fri": value,
          }
        });
        break;

      case 'sat':
        this.setState({
          "openningHoursSpec": {
            ...this.state.openningHoursSpec,
            "sat": value,
          }
        });
        break;

      case 'sun':
        this.setState({
          "openningHoursSpec": {
            ...this.state.openningHoursSpec,
            "sun": value,
          }
        });
        break;

      default:
        this.setState({
          [name]: value
        });
    }
  }

  handleDescriptionEditorChange = (editorState) => this.setState({ description: editorState });

  handleEventEditorChange = (editorState) => this.setState({ event: editorState });

  handleOpenSubDepartmentsDialog() {
    this.setState({
      chainDialogOpen: true,
    });
  }

  handleCloseSubDepartmentsDialog() {
    this.setState({
      chainDialogOpen: false,
    });
  }

  handleSearchBusiness(e) {
    e.preventDefault();

    this.props.getBusinessList(0, 0, {}, this.state.search)
  }

  handleDeleteBusiness() {
    this.props.deleteBusiness(this.state._id).then(response => {
      if (response) {
        this.props.history.goBack();
      }
    });
  }

  handleChainRowClick(e, subdepartment) {
    const chains = this.state.chains.slice();
    chains.push(subdepartment);

    this.setState({
      chains: chains.slice()
    });
  }

  handleDeleteChainChip = data => e => {
    const chains = this.state.chains.slice();
    const index = this.state.chains.indexOf(data);

    chains.splice(index, 1);
    const newSubdepartments = chains.slice();

    this.setState({
      chains: newSubdepartments
    });
  }

  handleOpenAddMenuDialog() {
    this.setState({
      addMenuDialogOpen: true
    });
  }

  handleCloseAddMenuDialog() {
    this.setState({
      addMenuDialogOpen: false,
      menuIndex: null,
    });
  }

  handleAddNewMenu() {
    let menu = this.state.menu.slice();
    if (_.isNumber(this.state.menuIndex)) {
      menu[this.state.menuIndex] = Object.assign({}, {
        name: this.state.newMenuName,
        price: this.state.newMenuPrice,
        hot: this.state.newMenuIsHot,
        new: this.state.newMenuIsNew,
      });
    } else {
      menu.push({
        name: this.state.newMenuName,
        price: this.state.newMenuPrice,
        hot: this.state.newMenuIsHot,
        new: this.state.newMenuIsNew,
      });
    }

    this.setState({
      menu: menu,
      menuIndex: null,
      addMenuDialogOpen: false,
      newMenuName: '',
      newMenuPrice: '',
      newMenuIsHot: false,
      newMenuIsNew: false,
    });
  }

  handleDeleteMenu() {
    if (_.isNumber(this.state.menuIndex)) this.state.menu.splice(this.state.menuIndex, 1);
    const newMenu = this.state.menu.slice();

    if (_.isEmpty(this.state.menuIndex)) {
      this.setState({
        addMenuDialogOpen: false,
        menuIndex: null,
        newMenuName: '',
        newMenuPrice: '',
        newMenuIsHot: false,
        newMenuIsNew: false,
      });
    } else {
      this.setState({
        addMenuDialogOpen: false,
        menuIndex: null,
        menu: newMenu,
        newMenuName: '',
        newMenuPrice: '',
        newMenuIsHot: false,
        newMenuIsNew: false,
      });
    }
  }

  handleMenuRowClick(e, menu, index) {
    this.setState({
      addMenuDialogOpen: true,
      newMenuName: menu.name,
      newMenuPrice: menu.price,
      newMenuIsHot: menu.hot,
      newMenuIsNew: menu.new,
      menuIndex: index,
    });
  }

  handleOpenConfimationDialog() {
    this.setState({
      confirmationDialogOpen: true
    });
  }

  handleCloseConfirmationDialog() {
    this.setState({
      confirmationDialogOpen: false
    });
  }

  handleMenuSwitch = name => e => {
    this.setState({
      [name]: e.target.checked
    });
  }

  updateBusinessImages(images) {
    this.setState({
      thumbnailUri: Object.assign({}, images.thumbnailUri),
      imagesUri: images.imagesUri.slice()
    });
  }

  handleReportsRowClick(e, report, index) {
    this.setState({
      reportDialogOpen: true,
      reportIsCheck: report.checked,
      reportContent: report.content,
      reportIndex: index,
    });
  }

  handleCloseReportDialog() {
    this.setState({
      reportDialogOpen: false,
      reportIsCheck: false,
      reportContent: '',
      reportIndex: '',
    });
  }

  handleDeleteReport() {
    if (_.isNumber(this.state.reportIndex)) this.state.reports.splice(this.state.reportIndex, 1);
    const newReports = this.state.reports.slice();

    this.setState({
      reports: newReports.slice(),
      reportDialogOpen: false,
      reportIsCheck: false,
      reportContent: '',
      reportIndex: '',
    });
  }

  handleSubmit(e) {
    if (this.state.krName && this.state.cnName && this.state.enName && this.state.tel && this.state.category._id) {
      const data = {
        state: this.state.state,
        cnName: this.state.cnName,
        krName: this.state.krName,
        enName: this.state.enName,
        tel: this.state.tel,
        priceRange: this.state.priceRange || '',
        supportedLanguage: this.state.supportedLanguage || null,
        payment: this.state.payment || null,
        delivery: this.state.delivery || '',
        status: this.state.status,
        "address": {
          province: {
            name: this.state.address.province.name || '',
            code: this.state.address.province.code || '',
          },
          city: {
            name: this.state.address.city.name || '',
            code: this.state.address.city.code || '',
          },
          area: {
            name: this.state.address.area.name || '',
            code: this.state.address.area.code || '',
          },
          street: this.state.address.street || '',
        },
        "geo": {
          lat: this.state.geo.lat || '',
          long: this.state.geo.long || '',
        },
        "openningHoursSpec": {
          mon: _.isEmpty(this.state.openningHoursSpec) ? '' : (this.state.openningHoursSpec.mon || ''),
          tue: _.isEmpty(this.state.openningHoursSpec) ? '' : (this.state.openningHoursSpec.tue || ''),
          wed: _.isEmpty(this.state.openningHoursSpec) ? '' : (this.state.openningHoursSpec.wed || ''),
          thu: _.isEmpty(this.state.openningHoursSpec) ? '' : (this.state.openningHoursSpec.thu || ''),
          fri: _.isEmpty(this.state.openningHoursSpec) ? '' : (this.state.openningHoursSpec.fri || ''),
          sat: _.isEmpty(this.state.openningHoursSpec) ? '' : (this.state.openningHoursSpec.sat || ''),
          sun: _.isEmpty(this.state.openningHoursSpec) ? '' : (this.state.openningHoursSpec.sun || ''),
        },
        rest: this.state.rest || '',
        chains: _.isEmpty(this.state.chains) ? [] : this.state.chains,
        description: this.state.description || '',
        "event": this.state.event || null,
        menu: _.isEmpty(this.state.menu) ? [] : this.state.menu,
        reports: _.isEmpty(this.state.reports) ? [] : this.state.reports,
      }

      // Set business category id
      if (this.state.category) {
        data.category = this.state.category._id
      }

      // Set business tag
      if (this.state.tags) {
        let tags = [];
        let index;

        this.state.tags.map(tag => {
          index = _.findIndex(this.props.tagsList, (item) => {
            return item.krName === tag
          });

          if (index > -1) {
            tags.push(this.props.tagsList[index]._id);
          }

          return index;
        })

        data.tags = tags.slice();
      }

      if (this.state.chains) {
        let chains = [];

        this.state.chains.map(item =>
          chains.push(item._id)
        )

        data.chains = chains.slice();
      }

      if (this.state._id) {
        data._id = this.state._id;
        this.props.updateBusiness(data);
      } else {
        this.props.addBusiness(data);
      }

    }
  }

  render() {
    const { classes, cities, areas, isFetching } = this.props;

    return (
      <SettingContainer>
        {isFetching ? (<CircularProgress className={classes.progress} size={50} />) :
          (<div>
            <Grid container spacing={24} alignItems="center">
              <Grid item xs={6}>
                {
                  (this.state.reports.length > 0)
                    ? <Badge color="secondary" badgeContent={this.state.reports.length}>
                        <Typography type="display1" gutterBottom className={classes.title}>{this.state.cnName + ' - ' + this.state.krName}</Typography>
                      </Badge>
                    : <Typography type="display1" gutterBottom className={classes.title}>{this.state.cnName + ' - ' + this.state.krName}</Typography>
                }
              </Grid>

              <Grid item xs={6}>
                <div className={classes.buttonContainer}>
                  <Button color="secondary" className={classes.button}
                    onClick={this.handleOpenConfimationDialog}
                    disabled={_.isEmpty(this.state._id)}
                  >
                    Delete
                  </Button>
                  <Button raised color="primary" className={classes.button}
                    onClick={this.handleSubmit}
                    disabled={!(
                      this.state.krName
                      && this.state.cnName
                      && this.state.enName
                      && this.state.tel)
                      || _.isEmpty(this.state.category._id)
                    }
                  >
                    {this.state._id ? 'Update' : 'Save'}
                  </Button>
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={16}>
              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <FormControl fullWidth >
                    <FormLabel component="label" required error>State</FormLabel>
                    <RadioGroup
                      row
                      aria-label="state"
                      name="state"
                      value={this.state.state}
                      onChange={this.handleChange}
                    >
                      <FormControlLabel value="draft" control={<Radio />} label="Draft" />
                      <FormControlLabel value="published" control={<Radio />} label="Published" />
                      <FormControlLabel value="trash" control={<Radio />} label="Trash" />
                    </RadioGroup>
                  </FormControl>
                </Paper>
              </Grid>

              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <FormControl fullWidth error>
                    <FormLabel component="label" required>Business Status</FormLabel>
                    <RadioGroup
                      row
                      aria-label="status"
                      name="status"
                      value={this.state.status}
                      onChange={this.handleChange}
                    >
                      <FormControlLabel value="normal" control={<Radio />} label="Normal" />
                      <FormControlLabel value="dissolute" control={<Radio />} label="Dissolute" />
                    </RadioGroup>
                  </FormControl>
                </Paper>
              </Grid>

              <Grid item xs={4}>
                <Paper className={classes.paper}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <Typography type="title">Chain</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <div className={classes.buttonContainer}>
                        <IconButton color="default" onClick={this.handleOpenSubDepartmentsDialog}>
                          <AddCircleOutline />
                        </IconButton>
                      </div>
                    </Grid>

                    <Grid item xs={12}>
                      {
                        this.state.chains.map((data, index) => (
                          <Chip
                            key={index}
                            label={data.krName}
                            onDelete={this.handleDeleteChainChip(data)}
                            className={classes.chip}
                          />
                        ))
                      }
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={9}>
                <Paper className={classes.paper}>
                  <Grid container spacing={16} alignItems="center">
                    <Grid item xs={12}>
                      <Typography type="title">Basic Info</Typography>
                    </Grid>

                    <Grid item xs={4}>
                      <TextField fullWidth required
                        error={_.isEmpty(this.state.cnName)}
                        id="cnName"
                        label="中文名"
                        margin="normal"
                        name="cnName"
                        value={this.state.cnName}
                        onChange={this.handleChange} />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField fullWidth required
                        error={_.isEmpty(this.state.krName)}
                        id="krName"
                        label="한국어"
                        margin="normal"
                        name="krName"
                        value={this.state.krName}
                        onChange={this.handleChange} />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField fullWidth required
                        error={_.isEmpty(this.state.enName)}
                        id="enName"
                        label="English"
                        margin="normal"
                        value={this.state.enName}
                        name="enName"
                        onChange={this.handleChange} />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField fullWidth required
                        error={_.isEmpty(this.state.tel)}
                        id="tel"
                        label="Tel"
                        margin="normal"
                        value={this.state.tel}
                        name="tel"
                        onChange={this.handleChange} />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        id="priceRange"
                        label="Price Range"
                        margin="normal"
                        value={this.state.priceRange}
                        name="priceRange"
                        onChange={this.handleChange} />
                    </Grid>

                    <Grid item xs={4}>
                      <TextField fullWidth
                        id="delivery"
                        label="Delivery"
                        margin="normal"
                        value={this.state.delivery}
                        name="delivery"
                        onChange={this.handleChange} />
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="language">Supported language</InputLabel>
                        <Select multiple
                          name="supportedLanguage"
                          value={this.state.supportedLanguage}
                          onChange={this.handleChange}
                          input={<Input id="language" />}
                          renderValue={selected => selected.join(', ')}
                        >
                          {
                            languageList.map((item, index) => (
                              <MenuItem
                                key={index}
                                value={item}
                              >
                                <Checkbox checked={this.state.supportedLanguage.indexOf(item) > -1} />
                                <ListItemText primary={item} />
                              </MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="payment">Supported payment</InputLabel>
                        <Select multiple
                          name="payment"
                          value={this.state.payment}
                          onChange={this.handleChange}
                          input={<Input id="payment" />}
                          renderValue={selected => selected.join(', ')}
                        >
                          {
                            paymentList.map((item, index) => (
                              <MenuItem
                                key={index}
                                value={item}
                              >
                                <Checkbox checked={this.state.payment.indexOf(item) > -1} />
                                <ListItemText primary={item} />
                              </MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Grid>

                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={3}>
                <Grid container>
                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="category" required error>Category</InputLabel>
                        <Select
                          name="category"
                          value={this.state.category.krName}
                          onChange={this.handleChangeCategory}
                          input={<Input id="category" />}
                          renderValue={selected => selected}
                        >
                          {_.isEmpty(this.props.categoriesList) ? '' : this.props.categoriesList.map(item => (
                            <MenuItem
                              key={item.code}
                              value={{
                                _id: item._id,
                                code: item.code,
                                krName: item.krName,
                                cnName: item.cnName,
                                enName: item.enName,
                              }}
                            >
                              <ListItemText primary={item.krName} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper className={classes.paper}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="tag">Tags</InputLabel>
                        <Select multiple
                          name="tags"
                          value={this.state.tags}
                          onChange={this.handleChange}
                          input={<Input id="tag" />}
                          renderValue={selected => selected.join(', ')}
                        >
                          {
                            _.isEmpty(this.props.tagsList) ? '' : this.props.tagsList.map(item => (
                              <MenuItem
                                key={item.code}
                                value={item.krName}
                              >
                                <Checkbox checked={this.state.tags.indexOf(item.krName) > -1} />
                                <ListItemText primary={item.krName} />
                              </MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Paper>
                  </Grid>


                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={16}>
              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <Grid container spacing={16} alignItems="center">
                    <Grid item xs={12}>
                      <Typography type="title">Address</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="province">Province</InputLabel>
                        <Select
                          name="province"
                          className={classes.input}
                          value={this.state.address.province.name}
                          input={<Input id="province" />}
                          onChange={this.handleChangeAddress}
                          renderValue={selected => selected}
                        >
                          {_.isEmpty(Provinces) ? '' : Provinces.map(p => (
                            <MenuItem
                              key={p.code}
                              value={{
                                name: p.cnName,
                                code: p.code,
                              }}
                            >
                              <ListItemText primary={p.cnName} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="city">City</InputLabel>
                        <Select
                          name="city"
                          className={classes.input}
                          value={this.state.address.city.name}
                          input={<Input id="city" />}
                          onChange={this.handleChangeAddress}
                          renderValue={selected => selected}
                        >
                          {_.isEmpty(cities)
                            ? <MenuItem key={1} value={{name: '', code: ''}}>Need province</MenuItem>
                            : cities.map(c => (
                              <MenuItem
                                key={c.code}
                                value={{
                                  name: c.cnName,
                                  code: c.code,
                                }}
                              >
                                <ListItemText primary={c.cnName} />
                              </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="area">Area</InputLabel>
                        <Select
                          name="area"
                          className={classes.input}
                          value={this.state.address.area.name}
                          input={<Input id="area" />}
                          onChange={this.handleChangeAddress}
                          renderValue={selected => selected}
                        >
                          {_.isEmpty(areas)
                            ? <MenuItem key={1} value={{name: '', code: ''}}>Need city</MenuItem>
                            : areas.map(a => (
                              <MenuItem
                                key={a.code}
                                value={{
                                  name: a.cnName,
                                  code: a.code,
                                }}
                              >
                                <ListItemText primary={a.cnName} />
                              </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <TextField fullWidth id="street" label="Street"  margin="normal"
                        value={this.state.address.street}
                        name="street"
                        onChange={this.handleChangeAddress} />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <Grid container spacing={16} alignItems="center">
                    <Grid item xs={12}>
                      <Typography type="title">Geo</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField fullWidth id="lat" label="Latitude"  margin="normal"
                        value={this.state.geo.lat}
                        name="lat"
                        onChange={this.handleChangeAddress}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField fullWidth id="long" label="Longtitude"  margin="normal"
                        value={this.state.geo.long}
                        name="long"
                        onChange={this.handleChangeAddress}
                      />
                    </Grid>

                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <Grid container spacing={16} alignItems="center">
                    <Grid item xs={12}>
                      <Typography type="title">Statics</Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <TextField fullWidth disabled id="viewsCount" label="Views Count"  margin="normal" defaultValue={this.state.viewsCount.toString()} />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField fullWidth disabled id="favoredCount" label="Favored Count"  margin="normal" defaultValue={this.state.favoredCount.toString()} />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField fullWidth disabled id="rating" label="Rating"  margin="normal" defaultValue={this.state.ratingAverage.toString()} />
                    </Grid>

                    <Grid item xs={6}>
                      <TextField fullWidth disabled id="ratingCount" label="Rating Count"  margin="normal" defaultValue={this.state.ratingAverage.toString()} />
                    </Grid>

                  </Grid>
                </Paper>
              </Grid>


              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <Typography type="title">Reports</Typography>
                  <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Index</TableCell>
                      <TableCell>Checked</TableCell>
                      <TableCell>Content</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      _.isEmpty(this.state.reports) ? (<TableRow></TableRow>)
                      : this.state.reports.map((item, index) => (
                        <TableRow hover key={index}
                          onClick={event => this.handleReportsRowClick(event, item, index)}
                        >
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.checked ? 'Yes' : 'No'}</TableCell>
                          <TableCell>{item.content}</TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Grid container spacing={16} alignItems="center">
                    <Grid item xs={12}>
                      <Typography type="title">Openning Days & Hours</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField fullWidth
                        id="rest"
                        label="Rest Days"
                        margin="normal"
                        value={this.state.rest}
                        name="rest"
                        onChange={this.handleChange} />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField fullWidth
                        id="mon"
                        label="Monday"
                        margin="normal"
                        value={this.state.openningHoursSpec.mon}
                        name="mon"
                        onChange={this.handleChangeOpenningSpec}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField fullWidth
                        id="tue"
                        label="Tuesday"
                        margin="normal"
                        value={this.state.openningHoursSpec.tue}
                        name="tue"
                        onChange={this.handleChangeOpenningSpec}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField fullWidth
                        id="wed"
                        label="Wednesday"
                        margin="normal"
                        value={this.state.openningHoursSpec.wed}
                        name="wed"
                        onChange={this.handleChangeOpenningSpec}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField fullWidth
                        id="thu"
                        label="Thursday"
                        margin="normal"
                        value={this.state.openningHoursSpec.thu}
                        name="thu"
                        onChange={this.handleChangeOpenningSpec}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField fullWidth
                        id="fri"
                        label="Friday"
                        margin="normal"
                        value={this.state.openningHoursSpec.fri}
                        name="fri"
                        onChange={this.handleChangeOpenningSpec}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField fullWidth
                        id="sat"
                        label="Saturday"
                        margin="normal"
                        value={this.state.openningHoursSpec.sat}
                        name="sat"
                        onChange={this.handleChangeOpenningSpec}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField fullWidth
                        id="sun"
                        label="Sunday"
                        margin="normal"
                        value={this.state.openningHoursSpec.sun}
                        name="sun"
                        onChange={this.handleChangeOpenningSpec}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>Description</Typography>
                  <Quill value={this.state.description}
                    modules={modules}
                    format={format}
                    onChange={this.handleDescriptionEditorChange} />
                </Paper>
              </Grid>

              <Grid item xs={6}>
                <Paper className={classes.paper}>
                  <Typography type="title" gutterBottom>Event</Typography>
                  <Quill value={this.state.event}
                    modules={modules}
                    format={format}
                    onChange={this.handleEventEditorChange} />
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Grid container alignItems="center">
                    <Grid item xs={6}>
                      <Typography type="title">Menu</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <div className={classes.buttonContainer}>
                        <IconButton color="default" onClick={this.handleOpenAddMenuDialog}>
                          <AddCircleOutline />
                        </IconButton>
                      </div>
                    </Grid>
                  </Grid>

                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Index</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Hot</TableCell>
                        <TableCell>New</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        _.isEmpty(this.state.menu) ? (<TableRow></TableRow>)
                        : this.state.menu.map((item, index) => (
                          <TableRow hover key={index}
                            onClick={event => this.handleMenuRowClick(event, item, index)}
                          >
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.price}</TableCell>
                            <TableCell>{item.hot ? 'Yes' : 'No'}</TableCell>
                            <TableCell>{item.new ? 'Yes' : 'No'}</TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>

            <BusinessImagesModule
              id={this.state._id}
              handleUpload={this.props.uploadImages}
              handleDelete={this.props.deleteImage}
              thumbnailUri={this.state.thumbnailUri}
              imagesUri={this.state.imagesUri}
              updateBusinessImages={this.updateBusinessImages}
            />

            <Paper className={classes.paper}>
              <Grid container spacing={16} alignItems="center">
                <Grid item xs={12}>
                  <Typography type="title">Reviews List</Typography>
                </Grid>
                <Grid item xs={12}>

                </Grid>
              </Grid>
            </Paper>

            <Dialog fullWidth
              open={this.state.chainDialogOpen}
              onClose={this.handleCloseSubDepartmentsDialog}
              aria-labelledby="sd-dialog-title"
              aria-describedby="sd-dialog-description1"
            >
              <DialogTitle id="sd-dialog-title" >
                <Grid container justify="space-between" alignItems="center">
                  <Grid item xs={8}>
                    Chain
                  </Grid>
                  <Grid item xs={4}>
                    <form onSubmit={this.handleSearchBusiness}>
                      <FormControl fullWidth margin="none">
                        <InputLabel htmlFor="adornment-password">Search</InputLabel>
                        <Input
                          id="search"
                          type="text"
                          name="search"
                          onChange={this.handleChange}
                          onKeyPress={this.handleKeyPress}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="Toggle password visibility"
                                onClick={this.handleSearchBusiness}
                              >
                                <Search />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </form>
                  </Grid>
                </Grid>
              </DialogTitle>
              <DialogContent id="sd-dialog-description">
                <Grid container>
                  <Grid item xs={12}>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Index</TableCell>
                          <TableCell>한국어</TableCell>
                          <TableCell>中文名</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          _.isEmpty(this.props.businessList) ? (<TableRow></TableRow>)
                          : this.props.businessList.map((item, index) => (

                              <TableRow hover key={index}
                                onClick={event => this.handleChainRowClick(event, item)}
                              >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{item.krName}</TableCell>
                                <TableCell>{item.cnName}</TableCell>
                              </TableRow>

                          ))
                        }
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>

              </DialogContent>
              <DialogActions>
                <Button color="primary" onClick={this.handleCloseSubDepartmentsDialog}>
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog fullWidth
              open={this.state.addMenuDialogOpen}
              onClose={this.handleCloseAddMenuDialog}
              aria-labelledby="menu-dialog-title"
              aria-describedby="menu-dialog-description"
            >
              <DialogTitle id="menu-dialog-title">
                <Grid container>
                  <Grid item xs={6}>
                    New Menu
                  </Grid>
                  <Grid item xs={6}>
                    <div className={classes.buttonContainer}>
                      <Button color="secondary" disabled={!_.isNumber(this.state.menuIndex)} onClick={this.handleDeleteMenu}>
                        Delete
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </DialogTitle>
              <DialogContent id="menu-dialog-description">
                <Grid container spacing={40}>
                  <Grid item xs={6}>
                    <TextField fullWidth id="newMenuName" label="Name" margin="normal" name="newMenuName" onChange={this.handleChange} value={this.state.newMenuName} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField fullWidth id="newMenuPrice" label="Price" margin="normal" name="newMenuPrice" onChange={this.handleChange} value={this.state.newMenuPrice} />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth >
                      <FormLabel component="label">Hot</FormLabel>
                      <Switch
                        color="primary"
                        checked={this.state.newMenuIsHot}
                        onChange={this.handleMenuSwitch('newMenuIsHot')}
                        value="newMenuIsHot"
                        />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth >
                      <FormLabel component="label">New</FormLabel>
                        <Switch
                          color="primary"
                          checked={this.state.newMenuIsNew}
                          onChange={this.handleMenuSwitch('newMenuIsNew')}
                          value="newMenuIsNew"
                          />
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button color="primary" onClick={this.handleAddNewMenu} disabled={!(this.state.newMenuName && this.state.newMenuPrice)}>
                  Save
                </Button>
                <Button color="primary" onClick={this.handleCloseAddMenuDialog}>
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog fullWidth
              open={this.state.reportDialogOpen}
              onClose={this.handleCloseReportDialog}
              aria-labelledby="report-dialog-title"
              aria-describedby="report-dialog-description"
            >
              <DialogTitle id="report-dialog-title">
                <Grid container>
                  <Grid item xs={6}>
                    Report
                  </Grid>
                  <Grid item xs={6}>
                    <div className={classes.buttonContainer}>
                      <Button color="secondary" onClick={this.handleDeleteReport}>
                        Delete
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </DialogTitle>
              <DialogContent id="report-dialog-description">
                <Typography type="body1">
                  {this.state.reportContent}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button color="primary" >
                  Save
                </Button>
                <Button color="primary" onClick={this.handleCloseReportDialog}>
                  Close
                </Button>
              </DialogActions>
            </Dialog>

            <ConfirmationDialog
              open={this.state.confirmationDialogOpen}
              handleClose={this.handleCloseConfirmationDialog}
              operation={this.handleDeleteBusiness}
              title="Warning"
              content="Are your sure to delete the business?"
            />
          </div>)}
      </SettingContainer>
    );
  }
}

SingleBusinessPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "admin": PropTypes.object.isRequired,
  "businessList": PropTypes.array.isRequired,
  "categoriesList": PropTypes.array.isRequired,
  "tagsList": PropTypes.array.isRequired,
  "cities": PropTypes.array,
  "areas": PropTypes.array,
  "getBusinessList": PropTypes.func.isRequired,
  "getCategoriesList": PropTypes.func.isRequired,
  "getTagsList": PropTypes.func.isRequired,
  "getCities": PropTypes.func.isRequired,
  "getAreas": PropTypes.func.isRequired,
  "getSingleBusiness": PropTypes.func.isRequired,
  "addBusiness": PropTypes.func.isRequired,
  "updateBusiness": PropTypes.func.isRequired,
  "deleteBusiness": PropTypes.func.isRequired,
  "deleteImage": PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    "admin": state.userReducer.user,
    "categoriesList": state.categoryReducer.categoriesList,
    "tagsList": state.tagReducer.tagsList,
    "cities": state.pcaReducer.cities,
    "areas": state.pcaReducer.areas,
    "businessList": state.businessReducer.businessList,
    "isFetching": state.businessReducer.isFetching,
  };
};

export default connect(mapStateToProps, {
  getBusinessList,
  getCategoriesList,
  getTagsList,
  getCities,
  getAreas,
  getSingleBusiness,
  addBusiness,
  updateBusiness,
  deleteBusiness,
  uploadImages,
  deleteImage,
})(withStyles(styles)(SingleBusinessPage));
