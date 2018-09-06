import React from 'react';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

export default function LoadingComponent(props) {
    if (props.error) {
      // When the loader has errored
      return <div>Error! <Button onClick={ props.retry }>Retry</Button></div>;
    } else if (props.timedOut) {
      // When the loader has taken longer than the timeout
      return <div>Taking a long time... <Button onClick={ props.retry }>Retry</Button></div>;
    } else if (props.pastDelay) {
      // When the loader has taken longer than the delay
      return <div><LinearProgress /></div>;
    } else {
      // When the loader has just started
      return null;
    }
}