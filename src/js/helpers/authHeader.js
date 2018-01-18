const authHeader = () => {
  const token = JSON.parse(sessionStorage.getItem('token'));

  if (token) {
    return {'Authoriztion': 'Bearer ' + token}
  } else {
    return {};
  }
}

export default authHeader;
