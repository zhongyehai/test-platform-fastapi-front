<template>
  <div>

    <el-drawer
      title="拉取swagger记录"
      size="60%"
      :append-to-body="true"
      :visible.sync="drawerIsShow"
      :direction="direction"
    >
      <el-table ref="swaggerPullLogTable" :data="pullLogList" size="mini" stripe>
        <el-table-column prop="num" align="center" label="序号" min-width="5%">
          <template slot-scope="scope">
            <span> {{ scope.$index + 1 }} </span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="name" label="状态" align="center" min-width="12%">
          <template slot-scope="scope">
            <el-tag :type="pullStatusTagType[scope.row.status]">
              {{ pullStatusContent[scope.row.status] }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="name" align="center" label="操作时间" min-width="15%">
          <template slot-scope="scope">
            <span> {{ formatDate(scope.row.create_time) }} </span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="name" align="center" label="拉取参数" min-width="48%">
          <template slot-scope="scope">
            <span> {{ scope.row.pull_args }} </span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="name" align="center" label="操作人员" min-width="15%">
          <template slot-scope="scope">
            <span> {{ userDict[scope.row.create_user].name }} </span>
          </template>
        </el-table-column>

      </el-table>

    </el-drawer>
  </div>
</template>

<script>

import { swaggerPullList } from '@/apis/assist/swagger'
import { swaggerPullStatusMappingContent, swaggerPullStatusMappingTagType } from '@/utils/mapping'
import { formatDate } from '@/utils/parseData'

export default {
  name: 'ShowSwaggerPullLog',
  components: {},
  data() {
    return {
      drawerIsShow: false,
      direction: 'rtl', // 抽屉打开方式
      pullStatusContent: swaggerPullStatusMappingContent,
      pullStatusTagType: swaggerPullStatusMappingTagType,
      pullLogList: [],
      userDict: {}
    }
  },

  mounted() {
    this.$bus.$on(this.$busEvents.drawerIsShow, (_type, project, userDict) => {
      if (_type === 'showSwaggerPullLog') {
        this.userDict = userDict
        swaggerPullList({ project_id: project.id }).then(response => {
          if (this.showMessage(this, response)) {
            this.pullLogList = response.data.data
            this.drawerIsShow = true
          }
        })
      }
    })
  },

  // 页面销毁的时候，关闭bus监听选中事件
  beforeDestroy() {
    this.$bus.$off(this.$busEvents.drawerIsShow)
  },
  methods: { formatDate }

}
</script>

<style scoped>

</style>
