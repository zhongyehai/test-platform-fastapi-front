<template>
  <el-select
    v-model="tempEmailServer"
    filterable
    default-first-option
    placeholder="选择邮箱服务器"
    value-key="id"
    style="min-width: 100%"
    size="mini"
  >
    <el-option v-for="item in configEmailServerList" :key="item.id" :label="item.name" :value="item.value" />
  </el-select>
</template>

<script>
import { configList } from '@/apis/config/config'
import { configTypeList } from '@/apis/config/configType'

export default {
  name: 'Email',
  props: [
    // eslint-disable-next-line vue/require-prop-types
    'oldEmailServer'
  ],
  data() {
    return {
      tempEmailServer: '',
      configEmailServerList: ''
    }
  },

  watch: {
    'oldEmailServer': {
      handler(newVal, oldVal) {
        this.tempEmailServer = newVal
      }
    }
  },

  mounted() {
    this.getConfigTypeList()
  },

  created() {
    this.tempEmailServer = this.oldEmailServer
  },
  methods: {
    // 获取配置类型
    getConfigTypeList() {
      configTypeList({ page_num: 1, page_size: 99999 }).then(response => {
        let configTypeData = 0
        response.data.data.forEach(configType => {
          if (configType.name === '邮箱') {
            configTypeData = configType.id
          }
        })

        // 获取对应的配置
        configList({ 'type': configTypeData }).then(response => {
          this.configEmailServerList = response.data.data
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
