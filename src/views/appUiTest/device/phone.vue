<template>
  <div class="app-container">

    <el-table
      ref="taskTable"
      v-loading="tableLoadingIsShow"
      element-loading-text="正在排序中"
      element-loading-spinner="el-icon-loading"
      size="mini"
      :data="dataList"
      row-key="id"
      stripe
      @cell-dblclick="cellDblclick"
    >
      <el-table-column prop="id" label="序号" align="center" min-width="10%">
        <template slot-scope="scope">
          <span> {{ (page_num - 1) * page_size + scope.$index + 1 }} </span>
        </template>
      </el-table-column>

      <el-table-column prop="name" align="center" label="设备名称" min-width="25%">
        <template slot-scope="scope">
          <span> {{ scope.row.name }} </span>
        </template>
      </el-table-column>

      <el-table-column prop="os" align="center" label="系统类型" min-width="10%">
        <template slot-scope="scope">
          <span> {{ scope.row.os }} </span>
        </template>
      </el-table-column>

      <el-table-column prop="os_version" align="center" label="系统版本" min-width="10%">
        <template slot-scope="scope">
          <span> {{ scope.row.os_version }} </span>
        </template>
      </el-table-column>

      <el-table-column prop="device_id" align="center" min-width="20%">
        <template slot="header">
          <span> 设备id </span>
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              <div>使用adb devices查看</div>
            </div>
            <span><i style="color: #409EFF" class="el-icon-question" /></span>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <span> {{ scope.row.device_id }} </span>
        </template>
      </el-table-column>

      <el-table-column prop="screen" align="center" label="分辨率" min-width="10%">
        <template slot-scope="scope">
          <span> {{ scope.row.screen }} </span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" min-width="10%">
        <template slot-scope="scope">

          <!-- 修改设备 -->
          <el-button
            type="text"
            size="mini"
            style="margin-right: 10px"
            @click.native="showDrawer(scope.row)"
          >修改</el-button>

          <!-- 复制设备 -->
          <el-popover
            :ref="scope.row.id"
            v-model="scope.row.copyPopoverIsShow"
            placement="top"
            style="margin-right: 10px"
            popper-class="down-popover"
          >
            <p>复制此设备并生成新的设备?</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="cancelCopyServerPopover(scope.row)">取消</el-button>
              <el-button type="primary" size="mini" @click="serverCopy(scope.row)">确定</el-button>
            </div>
            <el-button
              slot="reference"
              type="text"
              size="mini"
              :loading="scope.row.copyButtonIsLoading"
            >复制</el-button>
          </el-popover>

          <!-- 删除设备 -->
          <!--          <el-popover-->
          <!--            :ref="scope.row.id"-->
          <!--            v-model="scope.row.deletePopoverIsShow"-->
          <!--            placement="top"-->
          <!--            popper-class="down-popover"-->
          <!--          >-->
          <!--            <p>确定删除【{{ scope.row.name }}】?</p>-->
          <!--            <div style="text-align: right; margin: 0">-->
          <!--              <el-button size="mini" type="text" @click="cancelDeleteServerPopover(scope.row)">取消</el-button>-->
          <!--              <el-button type="primary" size="mini" @click="removeServer(scope.row)">确定</el-button>-->
          <!--            </div>-->
          <!--            <el-button-->
          <!--              slot="reference"-->
          <!--              style="color: red"-->
          <!--              type="text"-->
          <!--              size="mini"-->
          <!--              :loading="scope.row.deleteLoadingIsShow"-->
          <!--            >删除</el-button>-->
          <!--          </el-popover>-->

        </template>
      </el-table-column>
    </el-table>

    <el-drawer
      :title="tempData.id ? '修改设备' : '新增设备'"
      size="65%"
      :visible.sync="drawerIsShow"
      :direction="direction"
    >

      <el-form label-width="100px" style="margin-left: 20px;margin-right: 20px">

        <el-form-item label="别名" class="is-required" size="mini">
          <el-input v-model="tempData.name" size="mini" placeholder="设备名字" />
        </el-form-item>

        <el-form-item label="系统类型" class="is-required" size="mini">
          <el-select
            v-model="tempData.os"
            filterable
            default-first-option
            clearable
            size="mini"
            style="width:100%"
            placeholder="请选择执行app自动化的设备的系统类型"
            class="filter-item"
          >
            <el-option
              v-for="osType in phoneOsMapping"
              :key="osType"
              :label="osType"
              :value="osType"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="系统版本" class="is-required" size="mini">
          <el-input v-model="tempData.os_version" size="mini" placeholder="系统版本" />
        </el-form-item>

        <el-form-item label="设备id" class="is-required" size="mini">
          <el-input v-model="tempData.device_id" size="mini" style="width: 98%" placeholder="设备id" />
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              <div>使用 adb devices 命令查看</div>
            </div>
            <span><i style="color: #409EFF" class="el-icon-question" /></span>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="设备分辨率" class="is-required" size="mini">
          <el-input
            v-model="tempData.screen"
            size="mini"
            style="width: 98%"
            placeholder="设备分辨率, 使用 adb shell dumpsys window displays 命令查看，用于坐标定位时计算元素的具体位置"
          />
          <el-tooltip class="item" effect="dark" placement="top-start">
            <div slot="content">
              <div style="margin-bottom: 20px; color: white; font-size: 18px">使用 adb shell dumpsys window displays | findstr app= 命令查看</div>
              <el-image
                style="width: 1000px; height: 150px"
                :src="require('../../../assets/showScreen.png')"
              />
            </div>
            <span><i style="color: #409EFF" class="el-icon-question" /></span>
          </el-tooltip>
        </el-form-item>

        <el-form-item label="扩展字段" size="mini">
          <extendsEditorView
            ref="extendsEditorView"
            :data-json="tempData.extends"
          />
        </el-form-item>

      </el-form>

      <div class="demo-drawer__footer">
        <el-button size="mini" @click="drawerIsShow = false">取 消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="submitButtonIsLoading"
          @click.native="tempData.id ? changeServer() : addServer()"
        >保存
        </el-button>
      </div>

    </el-drawer>

    <pagination
      v-show="dataTotal>0"
      :total="dataTotal"
      :page.sync="page_num"
      :limit.sync="page_size"
      @pagination="gePhoneList"
    />
  </div>
</template>

<script>
import Sortable from 'sortablejs'
import Pagination from '@/components/Pagination'

import { copyPhone, deletePhone, phoneList, postPhone, putPhone, sortPhone } from '@/apis/appTest/device'
import { getConfigByCode } from '@/apis/config/config'
import extendsEditorView from '@/components/jsonView.vue'
import { assertStrIsJson } from '@/utils/validate'

export default {
  name: 'Index',
  components: { extendsEditorView, Pagination },
  data() {
    return {
      tableLoadingIsShow: false,
      dataList: [],
      dataTotal: 0,
      page_num: 0,
      page_size: 20,

      // 拖拽排序参数
      sortable: null,
      oldList: [],
      newList: [],

      tempData: {
        id: '',
        num: '',
        name: '',
        os: '',
        screen: '1440x3040',
        device_id: '',
        os_version: '',
        extends: {}
      },

      device_extends: {},
      direction: 'rtl', // 抽屉打开方式
      submitButtonIsLoading: false,
      drawerIsShow: false,

      phoneOsMapping: []
    }
  },

  mounted() {
    this.$bus.$on(this.$busEvents.drawerIsShow, (_type) => {
      if (_type === 'appPhone') {
        this.showDrawer()
      }
    })

    getConfigByCode({ code: 'phone_os_mapping' }).then(response => {
      this.phoneOsMapping = response.data
    })

    if (Object.keys(this.device_extends).length < 1) {
      getConfigByCode({ code: 'device_extends' }).then(response => {
        this.device_extends = response.data
      })
    }

    this.gePhoneList()
  },

  created() {
    this.oldList = this.dataList.map(v => v.id)
    this.newList = this.oldList.slice()
    this.$nextTick(() => {
      this.setSort()
    })
  },

  // 组件销毁前，关闭bus监听事件
  beforeDestroy() {
    this.$bus.$off(this.$busEvents.drawerIsShow)
  },

  methods: {

    // 双击单元格复制
    cellDblclick(row, column, cell, event) {
      const that = this
      const data = row[column.property]
      this.$copyText(typeof (data) === 'string' ? data : JSON.stringify(data)).then(
        function(e) {
          that.$message.success('复制成功')
        }
      )
    },

    // 获取设备列表
    gePhoneList() {
      phoneList({
        page_num: this.page_num,
        page_size: this.page_size
      }).then(response => {
        this.dataList = response.data.data
        this.dataTotal = response.data.total

        this.oldList = this.dataList.map(v => v.id)
        this.newList = this.oldList.slice()
      })
    },

    // 打开编辑框
    showDrawer(row) {
      this.drawerIsShow = true
      this.initTempData(row)
    },

    // 初始化编辑框数据
    initTempData(row) {
      if (row) {
        this.tempData = JSON.parse(JSON.stringify(row))
      } else {
        this.tempData.id = ''
        this.tempData.num = ''
        this.tempData.name = ''
        this.tempData.os = ''
        this.tempData.device_id = ''
        this.tempData.screen = '1440x3040'
        this.tempData.extends = this.device_extends
        this.tempData.os_version = ''
      }
    },

    // 新增服务
    addServer() {
      const row = JSON.parse(JSON.stringify(this.tempData))
      const json_data = this.$refs.extendsEditorView.$refs.dataJsonView.tempDataJson
      row['extends'] = assertStrIsJson(json_data, '扩展字段格式错误')
      this.submitButtonIsLoading = true
      postPhone(row).then(response => {
        this.submitButtonIsLoading = false
        if (this.showMessage(this, response)) {
          this.drawerIsShow = false
          this.gePhoneList()
        }
      })
    },

    // 编辑服务
    changeServer() {
      const row = JSON.parse(JSON.stringify(this.tempData))
      const json_data = this.$refs.extendsEditorView.$refs.dataJsonView.tempDataJson
      row['extends'] = assertStrIsJson(json_data, '扩展字段格式错误')
      this.submitButtonIsLoading = true
      putPhone(row).then(response => {
        this.submitButtonIsLoading = false
        if (this.showMessage(this, response)) {
          this.drawerIsShow = false
          this.gePhoneList()
        }
      })
    },

    // 删除服务
    removeServer(row) {
      deletePhone().then(response => {
        this.$set(row, 'deletePopoverIsShow', false)
        this.$set(row, 'deleteLoadingIsShow', true)
        deletePhone({ id: row.id }).then(response => {
          this.$set(row, 'deleteLoadingIsShow', false)
          if (this.showMessage(this, response)) {
            this.gePhoneList()
          }
        })
      })
    },

    // 复制服务
    serverCopy(row) {
      this.$set(row, 'copyPopoverIsShow', false)
      this.$set(row, 'copyButtonIsLoading', true)
      copyPhone({ 'id': row.id }).then(response => {
        this.$set(row, 'copyButtonIsLoading', false)
        if (this.showMessage(this, response)) {
          this.dataList.push(response.data)
          this.showDrawer(response.data)
        }
      })
    },

    cancelCopyServerPopover(task) {
      this.$set(task, 'copyPopoverIsShow', false)
    },

    cancelDeleteServerPopover(task) {
      this.$set(task, 'deletePopoverIsShow', false)
    },

    // 拖拽排序
    setSort() {
      const el = this.$refs.taskTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.dataList.splice(evt.oldIndex, 1)[0]
          this.dataList.splice(evt.newIndex, 0, targetRow)

          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)

          // 发送请求，改变排序
          this.tableLoadingIsShow = true
          sortPhone({
            id_list: this.newList,
            page_num: this.page_num,
            page_size: this.page_size
          }).then(response => {
            this.showMessage(this, response)
            this.tableLoadingIsShow = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
