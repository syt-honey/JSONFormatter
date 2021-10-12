<template>
  <div class="main__container">
    <aside>
      <el-input
        type="textarea"
        :rows="5"
        placeholder="Input the raw JSON..."
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

      <footer>
        <el-select filterable v-model="theme" placeholder="select theme">
          <el-option
            v-for="t in options"
            :key="t"
            :label="t"
            :value="t">
          </el-option>
        </el-select>
      </footer>
    </main>
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
      
      // tree config
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
      
      // JSON config
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
     * click the node to execute
     */
    onClick(evt, treeId, treeNode) {
      // if the clicked node is not the first node, remove the clicked class of the first node
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
     * some init operation
     */
    handleCreated(ztreeObj) {
      // init selected、expanded node
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
     * get node tree
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
     * config JSON by content
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
@media screen and (max-width: 580px) {
  .CodeMirror {
    height: calc(100vh - 390px) !important;
    min-height: calc(100vh - 390px) !important;
  }
}
</style>

<style lang="less" scoped>
@import "./index.less";
</style>
