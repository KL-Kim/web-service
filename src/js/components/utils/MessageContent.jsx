import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// Material UI Components
import Typography from '@material-ui/core/Typography';

class MessageContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      "dialogOpen": false,
      "review": {},
      "message": '',
    }

    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    const { type, event, subjectTitle } = this.props;

    switch (type) {
      case "BUSINESS":
        switch (event) {
          case "START_EVENT":
            this.setState({
              message: subjectTitle + "started new event",
            });
            break;

          default:
            return ;
        }
        break;

      case "REVIEW":
        switch (event) {
          case "UPVOTE":
            this.setState({
              message: "likes your review about " + subjectTitle,
            });
            break;

          default:
            return ;
        }
        break;

      case "COMMENT":
        switch (event) {
          case "UPVOTE":
            this.setState({
              message: "upvotes your comment",
            });
            break;

          case "DOWNVOTE":
            this.setState({
              message: "downvotes your comment",
            });
            break;

          case "REPLY":
            this.setState({
              message: "replyed to your comment",
            });

            break;
          default:
            return ;
        }
        break;

      default:
        return ;
    }
  }

  handleClose() {
    this.setState({
      dialogOpen: false,
    });
  }

  render() {
    return (
      <div>
        <div>
          <span>
            <strong>
              {
                isEmpty(this.props.sender) ? null : this.props.sender.username
              }
            </strong>
          </span>
          <span>
            {' ' + this.state.message}
          </span>
        </div>
      
        {
          this.props.commentContent.length > 100
            ? <Typography variant="caption">{this.props.commentContent.substr(0, 100)}...</Typography>
            : <Typography variant="caption">{this.props.commentContent}</Typography>
        }
      </div>
    )
  }
}

MessageContent.propTypes = {
  "type": PropTypes.string.isRequired,
  "content": PropTypes.string,
};

export default MessageContent;
