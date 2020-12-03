const apiUrl = (isLocal = true) => {
  if (isLocal) {
    return "http://localhost:3007";
  } else {
    return "https://dry-ridge-59689.herokuapp.com";
  }
};

export default apiUrl;
