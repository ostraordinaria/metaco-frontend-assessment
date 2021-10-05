const apiURL = process.env.REACT_APP_API_URL;

async function client(
  endpoint,
  { data, method = 'GET', ...customConfig } = {}
) {
  const config = {
    method,
    body: data ? JSON.stringify(data) : undefined,
    ...customConfig,
  };

  return fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      return Promise.reject(data);
    }
  });
}

export { client };
