<template>
  <div>
    <el-drawer v-model="drawerIsShow" title="修改页面" size="85%">

      <el-tabs v-model="dataActiveName" >

        <el-tab-pane label="页面信息" name="pageInfo">
          <el-form ref="ruleFormRef" :model="formData" :rules="formRules" label-width="90px">

            <el-form-item label="页面名称" prop="name" class="is-required" >
              <el-input v-model="formData.name" placeholder="页面名称" size="small" />
            </el-form-item>

            <el-form-item label="页面描述" prop="desc">
              <el-input v-model="formData.desc" type="textarea" :rows="5" placeholder="页面描述" size="small" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane name="elementList">
          <template #label>
            <span> 元素列表 </span>
            <el-popover class="el_popover_class" placement="top-start" trigger="hover" content="点击添加元素">
              <template #reference>
                <el-button
                    v-show="dataActiveName === 'elementList'"
                    type="text"
                    style="margin: 0; padding: 5px"
                    @click="showAddElement()"
                ><Plus></Plus></el-button>
              </template>
            </el-popover>
            <el-popover class="el_popover_class" placement="top-start" trigger="hover" content="点击导入元素">
              <template #reference>
                <el-button
                    v-show="dataActiveName === 'elementList'"
                    type="text"
                    style="margin: 0; padding: 5px"
                    @click="showUploadDrawer()"
                ><upload></upload></el-button>
              </template>
            </el-popover>
          </template>

          <elementIndexView :test-type="testType" :page-id="formData.id"></elementIndexView>
        </el-tab-pane>

      </el-tabs>

      <template #footer>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="drawerIsShow = false"> {{ '取消' }}</el-button>
          <el-button
              type="primary"
              size="small"
              :loading="submitButtonIsLoading"
              @click="changeData"
          >保存</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>

import {onBeforeUnmount, onMounted, ref} from "vue";
import {Plus, Upload} from "@icon-park/vue-next";
import {GetPage, PutPage} from "@/api/autotest/page";
import elementIndexView from "../element/index.vue";
import {bus, busEvent} from "@/utils/bus-events";

const props = defineProps({
  testType: {
    default: '',
    type: String
  }
})

onMounted(() => {
  bus.on(busEvent.drawerIsShow, onShowDrawerEvent);
})

onBeforeUnmount(() => {
  bus.off(busEvent.drawerIsShow, onShowDrawerEvent);
})

const onShowDrawerEvent = (message: any) => {
  if (message.eventType === 'edit-page') {
    dataActiveName.value = message.command === 'edit' ? 'pageInfo' : 'elementList'
    resetForm()
    getData(message.content.id)
    drawerIsShow.value = true
  }
}

const drawerIsShow = ref(false)
const dataActiveName = ref('pageInfo')
const submitButtonIsLoading = ref(false)
const ruleFormRef = ref(null)
const formData = ref({
  id: undefined,
  name: undefined,
  desc: undefined,
  addr: undefined,
  module_id: undefined,
  project_id: undefined
})
const formRules = {
  name: [
    {required: true, message: '请输入页面名字', trigger: 'blur'}
  ]
}
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: undefined,
    desc: undefined,
    addr: undefined,
    module_id: undefined,
    project_id: undefined
  }
  ruleFormRef.value && ruleFormRef.value.resetFields();
  submitButtonIsLoading.value = false
}
const sendEvent = () => {
  bus.emit(busEvent.drawerIsCommit, {eventType: 'page-editor'});
}

const getData = (dataId: any) => {
  GetPage(props.testType, {id: dataId}).then(response => {
    formData.value = response.data
  })
}

const changeData = () => {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      submitButtonIsLoading.value = true
      PutPage(props.testType, formData.value).then(response => {
        submitButtonIsLoading.value = false
        if (response) {
          sendEvent()
          drawerIsShow.value = false
        }
      })
    }
  })
}

const showAddElement = () => {
  bus.emit(busEvent.drawerIsShow, {
    eventType: 'add-element',
    project_id: formData.value.project_id,
    module_id: formData.value.module_id,
    page_id: formData.value.id
  });
}

const showUploadDrawer = () => {
  bus.emit(busEvent.drawerIsShow, {eventType: 'upload-element', content: formData.value.id})
}

</script>


<style scoped lang="scss">

</style>
