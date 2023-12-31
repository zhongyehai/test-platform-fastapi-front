<template>
  <div>

    <!-- 新增/修改页面表单 -->
    <el-drawer
      title="修改页面"
      size="80%"
      :visible.sync="drawerIsShow"
      :direction="direction"
    >

      <!-- 结构树/页面列表 -->
      <el-tabs
        v-model="showTab"
        class="table_padding table_api"
        style="margin-left: 20px;margin-right: 20px"
      >

        <!--页面管理 -->
        <el-tab-pane label="页面信息" name="pageInfo">

          <!-- 页面所属信息 -->
          <el-form label-width="80px">

            <el-form-item label="页面名称" class="is-required" style="margin-bottom: 5px">
              <el-input v-model="tempPage.name" placeholder="页面名称" size="mini" />
            </el-form-item>

            <el-form-item label="所属模块" class="is-required" style="margin-bottom: 5px">
              <el-select v-model="moduleLabel" placeholder="请选择模块" size="mini" style="width: 100%">
                <el-option :value="[]" style="height: auto">
                  <el-tree
                    ref="moduleTree"
                    :data="moduleTree"
                    show-checkbox
                    node-key="id"
                    check-strictly
                    highlight-current
                    :props="defaultProps"
                    @check-change="handleNodeClick"
                  />
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="页面描述" style="margin-bottom: 5px">
              <el-input v-model="tempPage.desc" size="mini" type="textarea" :rows="5" :placeholder="'页面描述'" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 页面元素 -->
        <el-tab-pane name="elementInfo">
          <template slot="label">
            <span> 元素列表 </span>
            <el-popover class="el_popover_class" placement="top-start" trigger="hover">
              <div>点击添加元素</div>
              <el-button
                v-show="showTab === 'elementInfo'"
                slot="reference"
                type="text"
                style="margin-left: 10px"
                icon="el-icon-plus"
                @click="addElement()"
              />
            </el-popover>
          </template>

          <elementManage
            :data-type="dataType"
            :current-project="currentProject"
            :current-page-id="tempPage.id"
            :current-module-id="tempPage.module_id"
            :current-project-id="tempPage.project_id"
          />
        </el-tab-pane>

      </el-tabs>

      <div class="demo-drawer__footer">
        <!--        <el-button-->
        <!--          v-show="showTab === 'elementInfo'"-->
        <!--          size="mini"-->
        <!--          type="primary"-->
        <!--          style="float: left"-->
        <!--          @click="addElement()"-->
        <!--        > {{ '新增元素' }}-->
        <!--        </el-button>-->

        <el-button size="mini" @click=" drawerIsShow = false"> {{ '取消' }}</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="isShowSubmitLoading"
          @click="changPage()"
        >
          {{ '保存页面' }}
        </el-button>

      </div>
    </el-drawer>

  </div>

</template>

<script>
import elementManage from '@/components/business/element/index.vue'

import { getModule as appUiGetModule } from '@/apis/appTest/module'
import { putPage as appUiPutPage, copyPage as appUiCopyPage } from '@/apis/appTest/page'

import { getModule as webUiGetModule } from '@/apis/uiTest/module'
import { putPage as webUiPutPage, copyPage as webUiCopyPage } from '@/apis/uiTest/page'

export default {
  name: 'Drawer',
  components: {
    elementManage
  },
  props: [
    // eslint-disable-next-line vue/require-prop-types
    'dataType', 'currentProject', 'currentProjectId', 'currentModuleId'
  ],
  data() {
    return {
      drawerIsShow: false, // 抽屉是否打开
      direction: 'rtl', // 抽屉打开方式
      showTab: 'pageInfo', // 默认展示的tab页
      moduleTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      moduleLabel: '',
      isShowSubmitLoading: false,

      // 页面新增/编辑临时数据
      tempPage: {
        id: '',
        name: '',
        desc: '',
        module_id: '',
        project_id: ''
      },

      getModuleUrl: '',
      putPageUrl: '',
      copyPageUrl: ''
    }
  },

  watch: {

    // 监控父组件选中的服务, 实时获取对应的模块列表
    'currentProjectId': {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        this.tempPage.project_id = newVal
      }
    },

    // 监控父组件选中的模块
    'currentModuleId': {
      deep: true, // 深度监听
      handler(newVal, oldVal) {
        this.tempPage.module_id = newVal
      }
    },

    'drawerIsShow': {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.getModuleUrl({ 'id': this.tempPage.module_id }).then(response => {
            this.moduleLabel = response.data.name
            this.$refs.moduleTree.setCheckedKeys([this.tempPage.module_id])
          })
        }
      }
    }
  },

  created() {
    if (this.dataType === 'webUi') {
      this.getModuleUrl = webUiGetModule
      this.putPageUrl = webUiPutPage
      this.copyPageUrl = webUiCopyPage
    } else {
      this.getModuleUrl = appUiGetModule
      this.putPageUrl = appUiPutPage
      this.copyPageUrl = appUiCopyPage
    }
  },

  mounted() {
    // 监听、接收模块树
    this.$bus.$on(this.$busEvents.treeIsDone, (_type, moduleTree) => {
      if (_type === 'module') {
        this.moduleTree = moduleTree
      }
    })

    // 监听 页面编辑框命令事件
    this.$bus.$on(this.$busEvents.drawerIsShow, (_type, command, page) => {
      if (_type === 'pageInfo') {
        this.showTab = 'pageInfo'
        if (command === 'edit') {
          this.initUpdateTempPage(page) // 修改
          this.$bus.$emit(this.$busEvents.drawerIsOpen, 'pageInfo', page.id)
        } else if (command === 'copy') {
          this.copyPageUrl({ id: page.id }).then(response => {
            if (this.showMessage(this, response)) {
              this.tempPage = response.data
              this.drawerIsShow = true
              this.$bus.$emit(this.$busEvents.drawerIsCommit, 'pageInfo')
            }
          }
          )
        }
        this.isShowSubmitLoading = false
      }
    })
  },

  // 组件销毁前，关闭bus监听事件
  beforeDestroy() {
    this.$bus.$off(this.$busEvents.drawerIsShow)
    this.$bus.$off(this.$busEvents.treeIsDone)
  },

  methods: {

    // 勾选树事件
    handleNodeClick(data, checked, node) {
      if (checked && [data.id] !== this.$refs.moduleTree.getCheckedKeys()) {
        this.$refs.moduleTree.setCheckedKeys([data.id]) // 选中
        this.moduleLabel = data.name
      }
    },

    // 提交修改页面
    changPage() {
      this.isShowSubmitLoading = true
      this.putPageUrl(this.getTempPage()).then(response => {
        this.isShowSubmitLoading = false
        if (this.showMessage(this, response)) {
          this.drawerIsCommit()
        }
      })
    },

    drawerIsCommit() {
      this.drawerIsShow = false
      this.$bus.$emit(this.$busEvents.drawerIsCommit, 'pageInfo')
    },

    // 点击修改页面时，初始化 dialog 数据
    initUpdateTempPage(page) {
      this.tempPage = page
      this.drawerIsShow = true
    },

    // 获取 tempPage 用于提交数据
    getTempPage() {
      return {
        id: this.tempPage.id,
        name: this.tempPage.name,
        desc: this.tempPage.desc,
        module_id: this.$refs.moduleTree.getCheckedKeys()[0],
        project_id: this.tempPage.project_id
      }
    },

    // 点击新增元素
    addElement() {
      this.$bus.$emit(this.$busEvents.drawerIsShow, 'elementInfo', 'add', this.tempPage.id)
    }
  }
}
</script>

<style scoped>

</style>
