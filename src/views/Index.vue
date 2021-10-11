<template>
  <div class="main__container">
    <aside>
      <el-input
        autofocus
        type="textarea"
        :rows="5"
        placeholder="输入需要格式化的JSON"
        v-model="textarea"
        prefix-icon="el-icon-search"
      >
      </el-input>
      <div class="main_container-scroll-resize">
        <div class="resize-bar"></div>
        <div class="resize-line"></div>
        <div
          class="resize-save"
          v-if="nodeList && nodeList.length"
        >
          <tree
            ref="tree"
            :nodes="nodeList"
            :setting="setting"
            @onClick="onClick"
            @onCreated="handleCreated"
          >
          </tree>
        </div>
      </div>
    </aside>
    <main>
      <div class="code-mirror">
        <codemirror
        style="font-size : 14px; line-height : 180%;"
          ref="jsonSchema"
          v-model="JSONSchema"
          :options="editorOptions"
        ></codemirror>
      </div>
    </main>
    <footer>
      <el-select filterable v-model="theme" placeholder="请选择主题">
        <el-option
          v-for="t in options"
          :key="t"
          :label="t"
          :value="t">
        </el-option>
      </el-select>
    </footer>
  </div>
</template>
<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/base16-light.css";
import "codemirror/mode/javascript/javascript";
import tree from "vue-giant-tree";
import { getItem, setItem } from "@/utils/storage.js"

export default {
  name: "Index",
  components: {
    codemirror,
    tree,
  },
  data() {
    return {
      rawList: [],
      textarea: "",
      options: ['default', '3024-day', '3024-night', 'abbott', 'abcdef', 'ambiance', 'ayu-dark', 'ayu-mirage', 'base16-dark', 'base16-light', 'bespin', 'blackboard', 'cobalt', 'colorforth', 'darcula', 'dracula', 'duotone-dark', 'duotone-light', 'eclipse', 'elegant', 'erlang-dark', 'gruvbox-dark', 'hopscotch', 'icecoder', 'idea', 'isotope', 'juejin', 'lesser-dark', 'liquibyte', 'lucario', 'material', 'material-darker', 'material-palenight', 'material-ocean', 'mbo', 'mdn-like', 'midnight', 'monokai', 'moxer', 'neat', 'neo', 'night', 'nord', 'oceanic-next', 'panda-syntax', 'paraiso-dark', 'paraiso-light', 'pastel-on-dark', 'railscasts', 'rubyblue', 'seti', 'shadowfox', 'solarized dark', 'solarized light', 'the-matrix', 'tomorrow-night-bright', 'tomorrow-night-eighties', 'ttcn', 'twilight', 'vibrant-ink', 'xq-dark', 'xq-light', 'yeti', 'yonce', 'zenburn'],
      theme: "",
      
      // tree 配置
      nodeList: null,
      setting: {
        view: {
          showIcon: false,
          showLine: false,
          filter: true,
          fontCss: (treeId, treeNode) => {
            return treeNode.searchNode
              ? { color: "#42b983", "font-weight": "bold" }
              : "";
          },
        },
      },
      zTree: null,
      expandNode: [],
      
      // JSON 配置
      JSONSchema: "{}",
      editorOptions: {
        viewportMargin: Infinity,
        mode: "application/json",
        lineNumbers: true,
        lineWrapping: true,
        indentWithTabs: false,
        tabSize: 2,
        theme: "",
      }
    };
  },
  created() {
    this.theme = getItem("theme") || 'base16-light';
    console.log(getItem('theme'))
  },
  watch: {
    theme(v) {
      if (v !== 'default') {
        require(`codemirror/theme/${v}.css`);
      }

      this.editorOptions.theme = v;
      setItem("theme", this.editorOptions.theme);
    },
    textarea() {
      this.getTreeNodeList();
    }
  },
  methods: {
    /**
     * 点击节点进行的操作
     */
    onClick(evt, treeId, treeNode) {
      // 点的不是第一个结点时，把第一个结点的 “点击” 样式 remove 掉
      if (!(treeNode.isFirstNode && treeNode.level === 0)) {
        this.$nextTick(() => {
          const treeDOM = document.getElementsByClassName("ztree")[0];
          const firstLi = treeDOM.firstElementChild;
          if (firstLi) {
            const firstAOfLi = firstLi.firstElementChild.nextElementSibling;
            firstAOfLi.classList.remove("curSelectedNode");
          }
        });
      }

      const content = this.$config.cfg_get_key_value(
        this.rawList,
        treeNode.data_tree
      );

      this.set(content);
    },

    /**
     * 创建时进行的一些 init 操作
     */
    handleCreated(ztreeObj) {
      // 初始化选中、展开的节点
      this.zTree = ztreeObj;
      ztreeObj.expandAll(true);
      this.$nextTick(() => {
        const treeDOM = document.getElementsByClassName("ztree")[0];
        const firstLi = treeDOM.firstElementChild;
        if (firstLi) {
          const firstAOfLi = firstLi.firstElementChild.nextElementSibling;
          firstAOfLi.classList.add("curSelectedNode");
        }
      });
      const content = this.$config.cfg_get_key_value(
        this.rawList,
        ztreeObj.getNodes()[0].data_tree
      );

      this.set(content);
    },

    /**
     * 获取 node 树
     */
    getTreeNodeList() {
      this.rawList = {INPUT_DATA: JSON.parse(this.textarea)};
      this.nodeList = this.$config.cfg_data2tree(
        this.rawList,
        "/",
        "/"
      ).children;
    },

    /**
     * 根据 content，设置 JSON
     */
    set(content) {
      this.JSONSchema = JSON.stringify(content, null, 2);
    },
  },
};
</script>

<style>
.CodeMirror {
  min-height: calc(100vh - 60px);
}
.CodeMirror-vscrollbar {
  height: auto !important;
}
</style>

<style lang="less" scoped>
@import "./index.less";
</style>
