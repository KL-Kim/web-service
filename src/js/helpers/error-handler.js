/**
 * Fetch response Error Handler
 * @version 0.0.1
 */
const handleErrorResponse = (response, message) => {
  const error = new Error(response.statusText);
  error.status = response.status;

  switch (response.status) {
    case 400:
      error.message = "Server: Bad JSON Request";
      break;

    case 401:
      error.message = "Server Error: Unauthorized";
      break;

    case 403:
      error.message = "Server Error: Forbidden";
      break;

    case 404:
      error.message = "Server Error: Not found";
      break;

    case 409:
      error.message = "Server Error: Already exists";
      break;

    default:
      error.message = "Server Error: Unknown Server Error";
  }

  return error;
}

export default handleErrorResponse;
