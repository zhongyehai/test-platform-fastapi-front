<template>
  <div>
    <el-drawer v-model="drawerIsShow" title="新增用例" size="95%">

      <el-table ref="dataTable" :data="formData.case_list" stripe size="small" row-key="id">

        <el-table-column label="排序" width="40" align="center">
          <template #header>
            <el-tooltip class="item" effect="dark" placement="top-start">
              <template #content>
                <div>可拖拽数据前的图标进行自定义排序</div>
              </template>
              <span style="color: #409EFF"><Help></Help></span>
            </el-tooltip>
          </template>
          <template #default="scope">
            <el-button
                text
                style="text-align: center"
                @dragstart="handleDragStart($event, scope.row, scope.$index)"
                @dragover="handleDragOver($event, scope.$index)"
                @drop="handleDrop($event, scope.$index)"
                @dragend="handleDragEnd"
                draggable="true"
                class="drag-button"
                :data-index="scope.$index"
            >
              <SortThree></SortThree>
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="序号" header-align="center" width="40">
          <template #default="scope">
            <div>{{ scope.$index + 1 }}</div>
          </template>
        </el-table-column>

        <el-table-column header-align="center" min-width="20%">
          <template #header>
            <span><span style="color: red">*</span>用例名字</span>
          </template>
          <template #default="scope">
            <el-input v-model="scope.row.name" size="small" type="textarea" :rows="1" />
          </template>
        </el-table-column>

        <el-table-column header-align="center" min-width="30%">
          <template #header>
            <span><span style="color: red">*</span>用例描述</span>
          </template>
          <template #default="scope">
            <el-input v-model="scope.row.desc" size="small" type="textarea" :rows="1" />
          </template>
        </el-table-column>

        <el-table-column fixed="right"  align="center" label="操作" width="90">
          <template #default="scope">
            <el-tooltip class="item" effect="dark" placement="top-end" content="添加一行">
              <el-button
                  v-show="scope.$index === 0 || scope.$index === formData.case_list.length - 1"
                  type="text"
                  size="small"
                  style="margin: 2px; padding: 0"
                  @click.native="addRow"
              ><Plus></Plus></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" placement="top-end" content="复制当前行">
              <el-button
                  type="text"
                  size="small"
                  style="margin: 2px; padding: 0"
                  @click.native="copyRow(scope.row)"
              ><Copy></Copy></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" placement="top-end" content="删除当前行">
              <el-button
                  v-show="isShowDelButton(scope.$index)"
                  type="text"
                  size="small"
                  style="color: red;margin: 2px; padding: 0"
                  @click.native="delRow(scope.$index)"
              ><Minus></Minus></el-button>
            </el-tooltip>

            <el-tooltip class="item" effect="dark" placement="top-end" content="清除数据">
              <el-button
                  v-show="formData.case_list.length === 1"
                  type="text"
                  size="small"
                  style="color: red;margin: 2px; padding: 0"
                  @click.native="clearData()"
              ><Clear></Clear></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>

      <template #footer>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="drawerIsShow = false"> {{ '取消' }}</el-button>
          <el-button
              type="primary"
              size="small"
              :loading="submitButtonIsLoading"
              @click="addData"
          >保存</el-button>
        </div>
      </template>

    </el-drawer>
  </div>
</template>

<script lang="ts" setup>

import {onBeforeUnmount, onMounted, ref} from "vue";
import {bus, busEvent} from "@/utils/bus-events";
import {ElMessage} from "element-plus";
import {Clear, Copy, Help, Minus, Plus, SortThree} from "@icon-park/vue-next";
import {PostCase} from "@/api/autotest/case";

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
  if (message.eventType === 'add-case') {
    resetForm()
    formData.value.suite_id = message.suite_id
    drawerIsShow.value = true
  }
}

const drawerIsShow = ref(false)
const submitButtonIsLoading = ref(false)
const ruleFormRef = ref(null)
const formData = ref({
  suite_id: undefined,
  case_list: [{id: `${Date.now()}`, name: null, desc: null}]
})
const oldIndex = ref(); // 当前拖拽项的索引
const dragRow = ref();   // 当前拖拽的行数据
const resetForm = () => {
  formData.value = {
    suite_id: undefined,
    case_list: [{id: `${Date.now()}`, name: null, desc: null}]
  }
  ruleFormRef.value && ruleFormRef.value.resetFields();
  submitButtonIsLoading.value = false
}

const getNewData = () => {
  return { id: `${Date.now()}`, name: null, desc: null }
}

const addRow = () => {
  formData.value.case_list.push(getNewData())
}

const copyRow = (row: {id: string, key: null, value: null, remark: null, data_type: null}) => {
  let newData = JSON.parse(JSON.stringify(row))
  newData.id = `${Date.now()}`
  formData.value.case_list.push(newData)
}

const isShowDelButton = (index: number) => {
  return !(formData.value.case_list.length === 1 && index === 0)
}

// 删除一行
const delRow = (index: number) => {
  formData.value.case_list.splice(index, 1)
}

const clearData = () => {
  formData.value.case_list[0] = getNewData()
}

const validateDataList = () => {
  if (formData.value.case_list.length < 1){
    ElMessage.warning('请填写用例信息')
    throw new Error('请填写用例信息')
  }
  formData.value.case_list.forEach((item, index) => {
    if (!item.name|| !item.desc){
      ElMessage.warning(`第 ${index + 1} 行, 请完善数据`)
      throw new Error(`第 ${index + 1} 行, 请完善数据`);
    }
  })
}


const addData = () => {
  validateDataList()
  submitButtonIsLoading.value = true
  PostCase(props.testType, formData.value).then(response => {
    submitButtonIsLoading.value = false
    if (response) {
      bus.emit(busEvent.drawerIsCommit, {eventType: 'case-editor', data: response});
      drawerIsShow.value = false
    }
  })
}

// 记录拖拽前的数据顺序
const handleDragStart = (event, row, index) => {
  oldIndex.value = index;
  dragRow.value = row;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/html", event.target);
  event.target.classList.add('drag-dragging');
};

const handleDragOver = (event, index) => {
  event.preventDefault();  // 必须调用这个方法才能使 drop 生效
};

const handleDragEnd = (event) => {
  // 恢复拖拽操作的样式
  event.target.classList.remove('drag-dragging');
};

const handleDrop = (event, newIndex) => {
  event.preventDefault();
  const updatedData = [...formData.value.case_list];
  // 移除当前拖拽的行数据
  updatedData.splice(oldIndex.value, 1);
  // 插入拖拽的行数据到目标索引位置
  updatedData.splice(newIndex, 0, dragRow.value);
  formData.value.case_list = updatedData;
  // 恢复样式
  event.target.classList.remove('drag-dragging');
};

</script>


<style scoped lang="scss">

</style>
