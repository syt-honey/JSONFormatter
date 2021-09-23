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
          ref="jsonSchema"
          v-model="JSONSchema"
          :options="editorOptions"
        ></codemirror>
      </div>
    </main>
  </div>
</template>
<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import tree from "vue-giant-tree";

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
        mode: { name: "javascript", json: true },
        lineNumbers: true,
        lineWrapping: true,
        indentWithTabs: false,
        tabSize: 2,
      }
    };
  },
  watch: {
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
      this.rawList = JSON.parse(this.textarea);
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
