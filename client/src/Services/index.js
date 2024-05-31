import axios from 'axios';


axios.defaults.headers.common = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};


const httpAPICall = async ({
  method,
  url,
  params,
  payload,
  headers
}) => {
  try {
    // const authorization = `Bearer ${token || store.getState().user.token}`;
    const token = localStorage.getItem('token');
    const contentType = 'application/json';

    const response = await axios.request({
      method,
      url,
      headers: headers || {
        Authorization: `Bearer ${token}`,
        'Content-Type': contentType,
      },
      params: params,
      data: payload,
    });

    return response?.data;
  } catch (error) {

    return error?.response?.data;
  }
};

export default httpAPICall