export const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw response.statusText;
};

export const parseJSON = response => response.json();
