<template>
  <div>
    <el-drawer v-model="drawerIsShow" title="复制用例集" size="40%">
      <el-form
          size="small"
          label-width="70px"
          ref="ruleFormRef"
          :model="formData"
          :rules="formRules">

        <el-form-item :label="`${testType === 'api' ? '服务' : testType === 'ui' ? '项目' : 'app'}`" size="small">
          <el-select
              v-model="formData.project_id"
              :placeholder="`选择${testType === 'api' ? '服务' : testType === 'ui' ? '项目' : 'app'}`"
              size="small"
              style="width: 100%"
              filterable
              default-first-option
              @change="getCaseSuiteList"
          >
            <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="选择归属" prop="parent" class="required" size="small">
          <el-cascader
              v-model="formData.parent"
              placeholder="选择用例集"
              filterable
              size="small"
              style="min-width: 100%"
              :options="suiteTreeData"
              :props="{ checkStrictly: true, value: 'id', label: 'name' }"
              clearable
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="drawerIsShow = false"> {{ '取消' }}</el-button>
          <el-button
              type="primary"
              size="small"
              :loading="submitButtonIsLoading"
              @click="submit"
          >保存</el-button>
        </div>
      </template>

    </el-drawer>
  </div>
</template>

<script lang="ts" setup>

import {onBeforeUnmount, onMounted, ref} from "vue";
import {bus, busEvent} from "@/utils/bus-events";
import {GetCaseSuiteList, CopyCaseSuite, ChangeCaseSuiteParent} from "@/api/autotest/case-suite";
import {arrayToTree} from "@/utils/parse-data";

const props = defineProps({
  testType: {
    default: '',
    type: String
  },
  projectId: {
    default: undefined,
    type: Number
  },
  projectList: {
    default: [],
    type: Array
  },
  caseSuiteTree: {
    default: [],
    type: Array
  }
})

onMounted(() => {
  bus.on(busEvent.treeIsDone, onTreeIsDone);
  bus.on(busEvent.drawerIsShow, onShowDrawerEvent);
})

onBeforeUnmount(() => {
  bus.off(busEvent.treeIsDone, onTreeIsDone);
  bus.off(busEvent.drawerIsShow, onShowDrawerEvent);
})

const onShowDrawerEvent = (message: any) => {
  if (message.eventType === 'case-suite-parent') {
    resetForm()
    formData.value.project_id = props.projectId
    formData.value.id = message.content.id
    formData.value.parent = message.content.parent
    drawerIsShow.value = true
  }
}

const onTreeIsDone = (message: any) => {
  if (message.eventType === 'case-suite') {
    suiteTreeData.value = message.content
  }
}

const drawerIsShow = ref(false)
const submitButtonIsLoading = ref(false)
const ruleFormRef = ref(null)
const suiteTreeData = ref([])
const formData = ref({
  project_id: undefined,
  id: undefined,
  parent: undefined
})
const formRules = {
  parent: [
    {required: true, message: '请选择复制后的用例集归属', trigger: 'blur'}
  ]
}
const resetForm = () => {
  formData.value = {
    project_id: undefined,
    id: undefined,
    parent: undefined
  }
  ruleFormRef.value && ruleFormRef.value.resetFields();
  submitButtonIsLoading.value = false
}

const sendEvent = () => {
  bus.emit(busEvent.drawerIsCommit, {eventType: 'case-editor'});
}

const getCaseSuiteList = (projectId: number) => {
  GetCaseSuiteList(props.testType, { 'project_id': projectId, page_no: 1, page_size: 99999 }).then(response => {
    const response_data = JSON.stringify(response.data) === '{}' ? [] : response.data.data;
    suiteTreeData.value = arrayToTree(response_data, null)
  })
}

const submit = () => {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      const parent = formData.value.parent.slice(-1)[0]
      submitButtonIsLoading.value = true
      CopyCaseSuite(props.testType, {parent: parent, id: formData.value.id}).then(response => {
        submitButtonIsLoading.value = false
        if (response) {
          sendEvent()
          drawerIsShow.value = false
        }
      })
    }
  })
}


</script>


<style scoped lang="scss">

</style>
