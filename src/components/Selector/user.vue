<template>
  <el-select
    v-model="tempData"
    style="width:100%"
    filterable
    default-first-option
    clearable
    placeholder="请选择用户"
  >
    <el-option
      v-for="user in userList"
      :key="user.name"
      :label="user.name"
      :value="user.id"
    />
  </el-select>
</template>

<script>
import { userList } from '@/apis/system/user'

export default {
  name: 'User',
  props: ['currentUserList', 'user'],
  data() {
    return {
      userList: [],
      tempData: ''
    }
  },

  watch: {
    'user': {
      handler(newVal, oldVal) {
        this.tempData = newVal
      }
    },
    'currentUserList': {
      handler(newVal, oldVal) {
        this.userList = newVal
      }
    }
  },

  mounted() {
    if (!this.currentUserList || this.currentUserList.length === 0){
      this.getUserList()
    }

  },

  created() {
    this.tempData = this.user
    this.userList = this.currentUserList
  },

  methods: {
    // 请求用户信息
    getUserList() {
      userList().then(response => {
        this.userList = response.data.data
      })
    }
  }
}
</script>

<style scoped>

</style>
