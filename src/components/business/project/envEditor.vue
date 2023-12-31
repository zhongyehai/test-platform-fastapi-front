<template>
  <el-drawer
    :title="temp_env.id ? '修改环境' : '新增环境'"
    size="90%"
    :visible.sync="drawerIsShow"
    :direction="direction"
  >
    <div class="demo-drawer__content">

      <el-row>
        <el-row>
          <el-col :span="3">
            <div style="margin-left: 10px">
              <el-tabs v-model="envListTabActiveName">
                <el-tab-pane label="环境列表" name="envList">
                  <el-scrollbar class="aside_scroll" :style="{height: `${envTabHeight}px`}">
                    <el-tree
                      ref="pTree"
                      class="filter-tree project-tree"
                      highlight-current
                      default-expand-all
                      node-key="id"
                      :data="envList"
                      :props="defaultProps"
                      @node-click="clickTable"
                    >
                      <span slot-scope="{ node, data }" class="custom-tree-node">
                        <span> {{ data.name }} </span>
                      </span>
                    </el-tree>
                  </el-scrollbar>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-col>

          <el-col :span="21">
            <el-tabs v-model="envDetailTabActiveName">
              <el-tab-pane name="envDetail">
                <span slot="label" style="float: right">环境属性</span>
                <el-scrollbar class="aside_scroll" :style="{height: `${envTabHeight}px`}">
                  <el-form v-show="dataType !== 'appUi'" label-width="120px">
                    <el-form-item :label="'环境域名'" class="is-required" size="mini">
                      <el-input v-model="temp_env.host" placeholder="域名" style="width: 98%" />
                      <el-popover
                        class="el_popover_class"
                        placement="top-start"
                        trigger="hover"
                      >
                        <div>当前服务在当前环境的域名</div>
                        <el-button slot="reference" type="text" icon="el-icon-question" />
                      </el-popover>
                    </el-form-item>
                  </el-form>

                  <el-tabs style="margin-left: 10px">
                    <!-- 公用变量 -->
                    <el-tab-pane label="自定义变量">
                      <template slot="label">
                        <span> 自定义变量 </span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          placement="top-start"
                        >
                          <div slot="content">
                            1、可用此功能设置一些预设值，比如token、账号信息 <br>
                            2、在此处设置的值，对于此服务下的接口、用例均可直接引用 <br>
                            3、若此处设置的值key为a，value为1，则只需要在要使用时使用“$a”即可获取到“1” <br>
                            4、此处的value可以使用自定义函数处理/获取数据，比如用自定义函数取数据库获取对应的数据 <br>
                            5、若在用例的公用变量处设置了与此处同样的key，则会以用例处定义的变量覆盖此处的变量
                          </div>
                          <span><i style="color: #409EFF" class="el-icon-question" /></span>
                        </el-tooltip>
                      </template>
                      <variablesView
                        ref="variablesView"
                        :current-data="temp_env.variables"
                        :placeholder-key="'key'"
                        :placeholder-value="'value'"
                        :placeholder-desc="'备注'"
                      />
                    </el-tab-pane>

                    <!-- 头部信息 -->
                    <el-tab-pane v-if="dataType === 'api'" label="头部信息">
                      <template slot="label">
                        <span> 头部信息 </span>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          placement="top-start"
                        >
                          <div slot="content">
                            1、可用此功能设置当前服务的固定的头部参数，比如token、cookie <br>
                            2、在此处设置的值，在运行此服务下的接口、用例的时候，会自动加到对应的接口/步骤的头部参数上 <br>
                            3、此处的value可以使用自定义函数处理/获取数据，比如用自定义函数取数据库获取对应的数据 <br>
                            4、若在用例的头部参数处设置了与此处同样的key，则会以用例处定义的参数覆盖此处的参数
                          </div>
                          <span><i style="color: #409EFF" class="el-icon-question" /></span>
                        </el-tooltip>
                      </template>
                      <headersView
                        ref="headersView"
                        :current-data="temp_env.headers"
                        :placeholder-key="'key'"
                        :placeholder-value="'value'"
                        :placeholder-desc="'备注'"
                      />
                    </el-tab-pane>

                    <!-- Python脚本 -->
                    <el-tab-pane label="python脚本">
                      <template slot="label">
                        <span> Python脚本 </span>
                        <el-tooltip class="item" effect="dark" placement="top-start">
                          <div slot="content">
                            1、Python脚本管理，为了方便查找和修改，在此处可进行处理 <br>
                            2、脚本本身不与环境进行关联，若需要脚本逻辑根据环境变化，请在脚本中编写内容
                          </div>
                          <span><i style="color: #409EFF" class="el-icon-question" /></span>
                        </el-tooltip>
                      </template>
                      <pythonScriptIndex />
                    </el-tab-pane>
                  </el-tabs>
                </el-scrollbar>
              </el-tab-pane>
            </el-tabs>

          </el-col>
        </el-row>
      </el-row>

      <div class="demo-drawer__footer">
        <!-- 同步环境信息 -->
        <el-button
          v-if="dataType !== 'appUi'"
          v-show="envList.length > 1"
          style="float: left"
          type="primary"
          size="mini"
          @click="showEnvSynchronizer()"
        >{{ '同步环境信息' }}
        </el-button>

        <el-button
          type="primary"
          size="mini"
          :loading="submitButtonIsLoading"
          @click="saveEnv(false)"
        >保存并继续填写
        </el-button>

        <el-button
          type="primary"
          size="mini"
          :loading="submitButtonIsLoading"
          @click="saveEnv(true)"
        >保存并关闭抽屉
        </el-button>

        <el-popover
          class="el_popover_class"
          placement="top-start"
          trigger="hover"
        >
          <div>
            <div>1、保存时，会遍历当环境变量的key和value同步到其他环境</div>
            <div>2、若其他环境没有当前的key，则会自动将变量的key和value同步到该环境</div>
            <div>3、若其他环境已有当前的key，则不会同步当前key的信息到该环境</div>
          </div>
          <el-button slot="reference" type="text" icon="el-icon-question" />
        </el-popover>
      </div>
    </div>

    <!-- 同步环境 -->
    <envSynchronizer
      :data-type="dataType"
    />

  </el-drawer>
</template>

<script>
import headersView from '@/components/Inputs/changeRow.vue'
import variablesView from '@/components/Inputs/variables.vue'
import envSynchronizer from '@/components/business/project/synchronizer.vue'
import pythonScriptIndex from '@/views/assist/script/index.vue'

import { getProjectEnv as apiGetProjectEnv, putProjectEnv as apiPutProjectEnv } from '@/apis/apiTest/project'
import { getProjectEnv as webUiGetProjectEnv, putProjectEnv as webUiPutProjectEnv } from '@/apis/uiTest/project'
import { getProjectEnv as appGetProjectEnv, putProjectEnv as appPutProjectEnv } from '@/apis/appTest/project'
import { runEnvList } from '@/apis/config/runEnv'
import { getLoading } from '@/utils/getLoading'

export default {
  name: 'EnvEditor',
  components: {
    headersView,
    variablesView,
    envSynchronizer,
    pythonScriptIndex
  },
  props: [
    // eslint-disable-next-line vue/require-prop-types
    'dataType', 'dataTypeMapping'
  ],
  data() {
    return {
      drawerIsShow: false, // 抽屉的显示状态
      direction: 'rtl', // 抽屉打开方式
      tabPosition: 'left',
      defaultProps: { children: 'children', label: 'name' }, // 树的显示规则详见element-ui
      envListTabActiveName: 'envList',
      envDetailTabActiveName: 'envDetail',
      envTabHeight: window.innerHeight * 0.75,
      getProjectEnvUrl: '',
      putProjectEnvUrl: '',
      // 临时数据
      temp_env: {
        id: '',
        host: '',
        project_id: '',
        env_id: '',
        headers: [{ 'key': '', 'value': '', 'remark': '' }],
        variables: [{ 'key': '', 'value': '', 'remark': '' }]
      },
      envList: [],
      submitButtonIsLoading: false // 提交按钮的loading状态
    }
  },

  mounted() {
    if (this.dataType === 'api') {
      this.getProjectEnvUrl = apiGetProjectEnv
      this.putProjectEnvUrl = apiPutProjectEnv
    } else if (this.dataType === 'appUi') {
      this.getProjectEnvUrl = appGetProjectEnv
      this.putProjectEnvUrl = appPutProjectEnv
    } else {
      this.getProjectEnvUrl = webUiGetProjectEnv
      this.putProjectEnvUrl = webUiPutProjectEnv
    }

    // 监听打开环境编辑抽屉
    this.$bus.$on(this.$busEvents.drawerIsShow, (_type, project) => {
      if (_type === 'env') {
        this.envList = []
        this.temp_env.project_id = project.id
        this.temp_env.env_id = undefined
        this.envTabHeight = window.innerHeight * 0.72
        this.submitButtonIsLoading = false
        this.drawerIsShow = true

        // 获取环境配置
        runEnvList({ business_id: project.business_id, page_num: 1, page_size: 99999 }).then(response => {
          this.envList = response.data.data
          if (this.envList.length > 0) {
            this.$nextTick(() => {
              document.querySelector('.el-tree-node__content').click()
            })
          }
        })
      }
    })

    // 监听 环境同步是否完成 的状态
    this.$bus.$on(this.$busEvents.drawerIsCommit, (_type, envData) => {
      if (_type === 'envSynchronizer') {
        this.getEnv(this.temp_env.env_id, this.temp_env.project_id)
      }
    })
  },

  // 组件销毁前，关闭bus监听事件
  beforeDestroy() {
    this.$bus.$off(this.$busEvents.drawerIsShow)
    this.$bus.$off(this.$busEvents.drawerIsCommit)
  },

  methods: {

    // 切换环境
    clickTable(env) {
      this.temp_env.env_id = env.id
      this.getEnv(env.id, this.temp_env.project_id)
    },

    // 保存环境设置
    saveEnv(isClose) {
      this.submitButtonIsLoading = true
      this.temp_env.variables = this.$refs.variablesView.tempData
      if (this.dataType === 'api') {
        this.temp_env.headers = this.$refs.headersView.tempData
      }
      this.putProjectEnvUrl(this.temp_env).then(response => {
        this.submitButtonIsLoading = false
        if (this.showMessage(this, response) && isClose) {
          this.drawerIsShow = false
        }
      })
    },

    // 获取环境信息
    getEnv(envId, projectId) {
      const loading = getLoading(this, '获取环境数据中...')
      this.getProjectEnvUrl({ env_id: parseInt(envId), project_id: projectId }).then(response => {
        loading.close()
        this.temp_env.id = response.data.id
        this.temp_env.env_id = response.data.env_id
        this.temp_env.host = response.data.host
        this.temp_env.headers = response.data.headers
        this.temp_env.variables = response.data.variables
        this.temp_env.project_id = response.data.project_id
      })
    },

    // 点击同步信息
    showEnvSynchronizer() {
      this.$bus.$emit(this.$busEvents.drawerIsShow, 'envSynchronizer', this.temp_env.project_id, this.envList)
    }
  }
}
</script>

<style scoped>
.project-tree {
  width: 100%;
  height: 80%;
  /*overflow: scroll;*/
}

.project-tree > .el-tree-node {
  display: inline-block;
  min-width: 100%;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
