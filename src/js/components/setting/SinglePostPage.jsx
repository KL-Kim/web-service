import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Quill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Material UI Components
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { FormControl, FormControlLabel, FormLabel } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import Radio, { RadioGroup } from 'material-ui/Radio';
import Button from 'material-ui/Button';

// Custom Components
import SettingContainer from './SettingContainer';
import ConfirmationDialog from '../utils/ConfirmationDialog';

// Actions
import { addNewPost, getSinglePost, updatePost, deletePost } from '../../actions/blog.actions';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline','strike', 'blockquote', 'code', ],
    [{'color': []}, {'background': []}],
    [{ 'align': [] }, {'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ]
};

const format = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote', 'code',
  'color', 'background',
  'list', 'bullet', 'indent',
  'link', 'image',
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

class SinglePostPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      confirmationDialogOpen: false,
      deleteDialogOpen: false,
      status: 'DRAFT',
      title: '',
      summary: '',
      content: '',
      keywords: [],
    };

    this.state.id = props.match.params.id === 'new' ? '' : props.match.params.id;

    this.handleChange = this.handleChange.bind(this);
    this.handleContentEditorChange = this.handleContentEditorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleOpenConfirmationDialog =  this.handleOpenConfirmationDialog.bind(this);
    this.handleCloseConfirmationDialog = this.handleCloseConfirmationDialog.bind(this);
    this.handleDeleteConfirmationDialogOpen = this.handleDeleteConfirmationDialogOpen.bind(this);
    this.handleDeleteConfirmationDialogClose = this.handleDeleteConfirmationDialogClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    if (this.state.id) {
      this.props.getSinglePost(this.state.id)
        .then(response => {
          if (response) {
            this.setState({
              title: response.post.title,
              summary: response.post.summary,
              content: response.post.content,
              status: response.post.status,
              keywords: response.post.keywords.slice(),
            })
          }
        })
    }
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value
    });
  }

  handleContentEditorChange = (editorState) => this.setState({ content: editorState });

  handleSubmit() {
    if (this.props.user && this.state.id === '') {
      this.props.addNewPost({
        title: this.state.title,
        summary: this.state.summary,
        content: this.state.content,
        authorId: this.props.user._id,
        status: this.state.status,
      });
    } else if (this.props.user && this.state.id !== '') {
      this.props.updatePost(this.state.id, {
        title: this.state.title,
        summary: this.state.summary,
        content: this.state.content,
        authorId: this.props.user._id,
        status: this.state.status,
      })
    }
  }

  handleDelete() {
    if (this.state.id) {
      this.props.deletePost(this.state.id, {
        authorId: this.props.user._id
      }).then(response => {
        this.props.history.goBack();
      });
    }
  }

  handleCancel() {
    this.props.history.goBack();
  }

  handleOpenConfirmationDialog() {
    this.setState({
      confirmationDialogOpen: true
    });
  }

  handleCloseConfirmationDialog() {
    this.setState({
      confirmationDialogOpen: false
    });
  }

  handleDeleteConfirmationDialogOpen() {
    this.setState({
      deleteDialogOpen: true
    });
  }

  handleDeleteConfirmationDialogClose() {
    this.setState({
      deleteDialogOpen: false
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <SettingContainer>
        <div>
          <Typography type="display1" gutterBottom className={classes.title}>New Post</Typography>
          <Grid container>
            <Grid item xs={4}>
              <Paper className={classes.paper}>
                <FormControl fullWidth >
                  <FormLabel component="label" required>State</FormLabel>
                  <RadioGroup
                    row
                    aria-label="status"
                    name="status"
                    value={this.state.status}
                    onChange={this.handleChange}
                  >
                    <FormControlLabel value="DRAFT" control={<Radio />} label="Draft" />
                    <FormControlLabel value="PUBLISHED" control={<Radio />} label="Published" />
                    <FormControlLabel value="TRASH" control={<Radio />} label="Trash" />
                  </RadioGroup>
                </FormControl>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="title" required>Title</InputLabel>
                    <Input type="text"
                      id="title"
                      name="title"
                      value={this.state.title}
                      onChange={this.handleChange}
                    />
                </FormControl>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="keywords">Keywords</InputLabel>
                    <Input type="text"
                      id="keywords"
                      name="keywords"
                      value={this.state.keywords}
                      onChange={this.handleChange}
                    />
                </FormControl>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="summary">Summary</InputLabel>
                    <Input type="text"
                      id="summary"
                      name="summary"
                      value={this.state.summary}
                      onChange={this.handleChange}
                    />
                </FormControl>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Quill
                  value={this.state.content}
                  modules={modules}
                  format={format}
                  onChange={this.handleContentEditorChange} />
              </Paper>
            </Grid>

            <Grid item xs={6}>
              <div>
                <Button
                  color="secondary"
                  disabled={this.state.id ? false : true}
                  className={classes.button}
                  onClick={this.handleDeleteConfirmationDialogOpen}
                >
                  Delete
                </Button>
              </div>
            </Grid>

            <Grid item xs={6}>
              <div className={classes.buttonContainer}>
                <Button raised color="primary" className={classes.button} onClick={this.handleSubmit}>Save</Button>
                <Button className={classes.button} onClick={this.handleOpenConfirmationDialog}>Cancel</Button>
              </div>
            </Grid>
          </Grid>

          <div>
            <ConfirmationDialog
              open={this.state.confirmationDialogOpen}
              handleClose={this.handleCloseConfirmationDialog}
              operation={this.handleCancel}
              title="Warning"
              content="Are your sure to leave?"
            />
            <ConfirmationDialog
              open={this.state.deleteDialogOpen}
              handleClose={this.handleDeleteConfirmationDialogClose}
              operation={this.handleDelete}
              title="Warning"
              content="Are your sure to delete?"
            />

          </div>
        </div>
      </SettingContainer>
    );
  }
}

SinglePostPage.propTypes = {
  "classes": PropTypes.object.isRequired,
  "addNewPost": PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  return {
    "user": state.userReducer.user,
  };
};

export default connect(mapStateToProps, {
  addNewPost,
  getSinglePost,
  updatePost,
  deletePost,
})(withStyles(styles)(SinglePostPage));
