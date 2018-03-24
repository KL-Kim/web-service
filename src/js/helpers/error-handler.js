/**
 * Fetch response Error Handler
 * @version 0.0.1
 */
const handleErrorResponse = (response, message) => {
  const error = new Error(response.statusText);
  error.status = response.status;

  switch (response.status) {
    case 400:
      error.message = "Bad JSON Request";
      break;

    case 401:
      error.message = "Unauthorized";
      break;

    case 403:
      error.message = "Forbidden";
      break;

    case 409:
      error.message = "Already exists";
      break;

    default:
      error.message = "Unknown Server Error";
  }

  return error;
}

export default handleErrorResponse;
