<template>
  <div class="app-container">

    <div class="filter-container">
      <el-form label-width="65px" :inline="true">

        <el-form-item :label="'类型'" size="mini">
          <el-select
            v-model="listQuery.type"
            :placeholder="'选择配置类型'"
            clearable
            filterable
            default-first-option
            style="margin-left: 10px; width: 100%"
            size="mini"
            class="filter-item"
          >
            <el-option v-for="type in currentConfigTypeList" :key="type.id" :label="type.name" :value="type.id" />
          </el-select>
        </el-form-item>

        <el-form-item :label="'配置名'" size="mini">
          <el-input
            v-model="listQuery.name"
            class="input-with-select"
            placeholder="配置名，支持模糊搜索"
            size="mini"
            clearable
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item :label="'配置值'" size="mini">
          <el-input
            v-model="listQuery.value"
            class="input-with-select"
            placeholder="配置值，支持模糊搜索"
            size="mini"
            clearable
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item :label="'创建人'" size="mini">
          <el-select
            v-model="listQuery.create_user"
            :placeholder="'选择创建人'"
            filterable
            default-first-option
            clearable
            size="mini"
            class="filter-item"
          >
            <el-option v-for="user in currentUserList" :key="user.name" :label="user.name" :value="user.id" />
          </el-select>
        </el-form-item>

        <el-button
          type="primary"
          size="mini"
          @click="getConfigList()"
        >
          搜索
        </el-button>

        <el-button class="filter-item" style="margin-left: 10px;" type="primary" size="mini" @click="addConfig">
          {{ '添加' }}
        </el-button>

      </el-form>
    </div>

    <el-table
      ref="apiTree"
      v-loading="listLoading"
      :header-cell-style="{'text-align':'center'}"
      size="mini"
      :data="mailService.list"
      stripe
    >
      <el-table-column prop="id" label="编号" align="left" min-width="5%">
        <template slot-scope="scope">
          <span> {{ (listQuery.page_num - 1) * listQuery.page_size + scope.$index + 1 }} </span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip prop="name" align="left" label="配置名称" min-width="20%">
        <template slot-scope="scope">
          <span> {{ scope.row.name }} </span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip prop="value" align="left" label="配置值" min-width="30%">
        <template slot-scope="scope">
          <span> {{ scope.row.value }} </span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip prop="desc" align="left" label="备注" min-width="20%">
        <template slot-scope="scope">
          <span> {{ scope.row.desc }} </span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip prop="type" align="center" label="配置类型" min-width="10%">
        <template slot-scope="scope">
          <span> {{ parseConfigType(scope.row.type) }} </span>
        </template>
      </el-table-column>

      <!--      <el-table-column :show-overflow-tooltip=true prop="create_user" align="center" label="创建者" min-width="8%">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ parseUser(scope.row.create_user) }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->

      <el-table-column show-overflow-tooltip prop="create_user" align="center" label="最后修改人" min-width="8%">
        <template slot-scope="scope">
          <span>{{ parseUser(scope.row.update_user) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" min-width="7%">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click.native="editConfig(scope.row)"
          >修改</el-button>
        </template>
      </el-table-column>

    </el-table>

    <pagination
      v-show="mailService.total>0"
      :total="mailService.total"
      :page.sync="listQuery.page_num"
      :limit.sync="listQuery.page_size"
      @pagination="getConfigList"
    />

    <configDialog
      :config-type-list="currentConfigTypeList"
      :config-type-dict="currentConfigTypeDict"
    />
  </div>
</template>

<script>

import Pagination from '@/components/Pagination'
import configDialog from '@/views/config/configs/drawer'

import { configList, deleteConfig } from '@/apis/config/config'
import { userList } from '@/apis/system/user'
import { configTypeList } from '@/apis/config/configType'

export default {
  name: 'Config',
  components: {
    Pagination,
    configDialog
  },
  data() {
    return {

      listQuery: {
        page_num: 1,
        page_size: 20,
        type: '',
        create_user: '',
        name: '',
        value: ''
      },

      // 请求列表等待响应的状态
      listLoading: false,

      mailService: {
        total: 0,
        list: [],
        currentPage: undefined,
        currentService: undefined
      },

      // 配置类型列表
      currentConfigTypeList: [],
      currentConfigTypeDict: {},

      // 用户权限
      roles: localStorage.getItem('roles'),
      currentUserList: [],
      userDict: {}
    }
  },

  mounted() {
    this.getUserList(this.getConfigTypeList)

    this.$bus.$on(this.$busEvents.drawerIsCommit, (_type) => {
      if (_type === 'configInfo') {
        this.getConfigList()
      }
    })
  },

  // 页面销毁前，关闭bus监听服务选中事件
  beforeDestroy() {
    this.$bus.$off(this.$busEvents.drawerIsCommit)
  },
  methods: {
    // 获取用户信息，同步请求
    getUserList(func) {
      userList({ page_num: 1, page_size: 99999 }).then(response => {
        this.currentUserList = response.data.data
        response.data.data.forEach(user => {
          this.userDict[user.id] = user
        })
        if (func) {
          func()
        }
      })
    },

    // 解析用户
    parseUser(userId) {
      return this.userDict[userId].name
    },

    // 解析配置类型
    parseConfigType(configTypeId) {
      return this.currentConfigTypeDict[configTypeId].name
    },

    // 获取配置类型列表
    getConfigTypeList() {
      configTypeList({ page_num: 1, page_size: 99999 }).then(response => {
        this.currentConfigTypeList = response.data.data

        response.data.data.forEach(configType => {
          this.currentConfigTypeDict[configType.id] = configType
        })

        this.getConfigList()
      })
    },

    // 点击编辑参数，把被点击的用例信息赋值给临时模板
    editConfig(row) {
      this.$bus.$emit(this.$busEvents.drawerIsShow, 'configInfo', 'edit', JSON.parse(JSON.stringify(row)))
    },

    // 添加参数
    addConfig() {
      this.$bus.$emit(this.$busEvents.drawerIsShow, 'configInfo', 'add')
    },

    getConfigList() {
      configList(this.listQuery).then(response => {
        this.mailService.list = response.data.data
        this.mailService.total = response.data.total
      })
    },

    // 删除配置
    delConfig(congfigId) {
      deleteConfig({ 'id': congfigId }).then(response => {
        if (this.showMessage(this, response)) {
          this.getConfigList()
        }
      })
    }
  }
}
</script>

<style scoped>

</style>

