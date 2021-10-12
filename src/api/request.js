import axios from "axios";
import { Loading, Message } from 'element-ui';

let reqMap = new Map();
let loading = null;

axios.interceptors.request.use(config => {
  // use url as the key。If the request is complex, pls use config.data.
  reqMap.set(config.url, config.data);
  if (reqMap.size > 0) {
    loading = Loading.service({ fullscreen: true });
  }
  return config;
});

axios.interceptors.response.use(
  res => {
    reqMap.delete(res.config.url);
    if (reqMap.size === 0) {
      loading.close();
    }
    return res.data;
  },
  error => {
    reqMap.clear();
    loading.close();
    Message.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return error;
  }
);

export default axios;
