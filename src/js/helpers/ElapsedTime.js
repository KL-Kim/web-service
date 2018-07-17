import ms from 'ms';

const calcauteElapsedTime = (time) => {
  const now = Date.now();
  const timestamp  = new Date(time);
  const diff = now - timestamp;

  if (diff < 60 * 1000) {
    return '1m ago'
  } else {
    return ms(diff) + ' ago';
  }
}

export default calcauteElapsedTime;
