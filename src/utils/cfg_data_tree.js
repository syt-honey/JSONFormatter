"use strict";

function cfg_get_key_value(data_raw, key_url) {
  let key_list = key_url.split("/");
  let curNode = data_raw;
  for (let key of key_list) {
    if (key === "") {
      continue;
    }
    curNode = curNode[key];
  }
  return curNode;
}

function cfg_data2tree(data_raw, cur_node_key, cur_key_url) {
  let data_tree = {
    name: cur_node_key,
    data_tree: cur_key_url
  };

  if (
    Object.prototype.toString.call(data_raw) === "[object Object]" &&
    Object.keys(data_raw).length
  ) {
    let keys_list = Object.keys(data_raw);
    keys_list.sort();
    let children = [];
    for (let k of keys_list) {
      let k_url = cur_key_url + "/" + k;
      if (cur_key_url === "/") {
        k_url = "/" + k;
      }
      let item = cfg_data2tree(data_raw[k], k, k_url);
      children.push(item);
    }
    data_tree.children = children;
  }
  return data_tree;
}

const config = {
  cfg_get_key_value,
  cfg_data2tree
};

export { config };
