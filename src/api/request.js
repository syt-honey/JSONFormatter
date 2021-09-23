import axios from "axios";
import { Loading, Message } from 'element-ui';

let reqMap = new Map();
let loading = null;

axios.interceptors.request.use(config => {
  // 暂时用 url 作为 key。若请求较为复杂（如：多个 post 请求，url 相同但参数不同），则 key 需要将 config.data 一起并入。
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
