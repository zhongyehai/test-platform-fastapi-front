<template>
  <el-select
    v-model="tempCase"
    multiple
    placeholder="选择用例"
    value-key="id"
    :disabled="caseSelectorIsDisabled"
    style="min-width: 20%;padding-right:10px"
    size="small"
    @change="choiceCase"
  >
    <el-option v-for="item in tempCaseList" :key="item.id" :label="item.name" :value="item.id" />
  </el-select>
</template>

<script>
import { caseList } from '@/apis/apiTest/case'

export default {
  name: 'CaseSelector',
  props: [
    // eslint-disable-next-line vue/require-prop-types
    'moduleId', 'caseIds', 'busOnEventName', 'busEmitEventName'
  ],
  data() {
    return {
      caseSelectorIsDisabled: false,
      tempModuleId: '',
      tempCase: '',
      tempCaseList: []

    }
  },

  watch: {

    'caseIds': {
      handler(newVal, oldVal) {
        this.tempCase = newVal || []
      }
    },

    'moduleId': {
      handler(newVal, oldVal) {
        this.tempModuleId = newVal
        this.tempCase = [] // 模块变了，则把选中的用例清空掉
        this.getCaseList()
      }
    }
  },
  mounted() {
    if (this.busOnEventName) {
      this.$bus.$on(this.busOnEventName, (ModuleList) => {
        // 选中了多个模块，则清空选中的用例，并把用例选择框置为不可编辑
        if (ModuleList && ModuleList.length > 1) {
          this.caseSelectorIsDisabled = true
        } else {
          // 只选中了一个模块的时候，获取该用模块下的用例渲染到下拉框
          this.caseSelectorIsDisabled = false
          this.tempModuleId = ModuleList[0]
          this.getCaseList()
        }
        this.tempCase = []
      })
    }
  },

  // 页面销毁前，关闭bus监听服务选中事件
  beforeDestroy() {
    if (this.busOnEventName) {
      this.$bus.$off(this.busOnEventName)
    }
  },

  created() {
    this.tempModuleId = this.moduleId
    this.tempCase = this.caseIds

    if (this.tempModuleId) {
      this.getCaseList()
    }
  },
  methods: {
    getCaseList() {
      caseList({ moduleId: this.tempModuleId }).then(response => {
        this.tempCaseList = response.data.data
      })
    },

    choiceCase(caseId) {
      if (this.busEmitEventName) {
        this.$bus.$emit(this.busEmitEventName, caseId)
      }
    }
  }
}
</script>

<style scoped>

</style>
