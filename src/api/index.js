import request from "./request";

const trackMap = {
  dev: ""
};

const routerMap = {
  getTreeNode: ""
};

let api = {};

for (let i in routerMap) {
  api[i] = async (type, data) => {
    if (!["post", "get"].includes(type)) {
      type = "post";
    }
    return request[type](trackMap.dev + routerMap[i], data || {});
  };
}

export default api;
