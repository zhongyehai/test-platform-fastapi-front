<template>
  <div>
    <el-drawer v-model="drawerIsShow" title="新增页面" size="85%">

      <el-form ref="ruleFormRef" :model="formData" :rules="formRules" label-width="90px">
        <el-form-item label="所属模块" class="is-required" style="margin-bottom: 5px">
        <!--          <el-select v-model="formData.module_name" placeholder="请选择模块" size="small" style="width: 100%">-->
        <!--            <el-option :value="[]" style="height: auto">-->
        <!--              <el-tree-->
        <!--                  :data="moduleTree"-->
        <!--                  show-checkbox-->
        <!--                  default-expand-all-->
        <!--                  node-key="id"-->
        <!--                  check-strictly-->
        <!--                  highlight-current-->
        <!--                  :default-checked-keys="[formData.module_id]"-->
        <!--                  :props="defaultProps"-->
        <!--              />-->
        <!--            </el-option>-->
        <!--          </el-select>-->
          <el-input v-model="moduleName" size="small" disabled/>
        </el-form-item>

        <el-table ref="dataTable" :data="formData.page_list" stripe size="small" row-key="id">

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
                <span><span style="color: red">*</span>页面名称</span>
              </template>
              <template #default="scope">
                <el-input v-model="scope.row.name" size="small" type="textarea" :rows="1" />
              </template>
            </el-table-column>

            <el-table-column header-align="center" min-width="30%">
              <template #header>
                <span>页面描述</span>
              </template>
              <template #default="scope">
                <el-input v-model="scope.row.desc" size="small" type="textarea" :rows="1" />
              </template>
            </el-table-column>

            <el-table-column fixed="right"  align="center" label="操作" width="90">
              <template #default="scope">
                <el-tooltip class="item" effect="dark" placement="top-end" content="添加一行">
                  <el-button
                      v-show="scope.$index === 0 || scope.$index === formData.page_list.length - 1"
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
                      v-show="formData.page_list.length === 1"
                      type="text"
                      size="small"
                      style="color: red;margin: 2px; padding: 0"
                      @click.native="clearData()"
                  ><Clear></Clear></el-button>
                </el-tooltip>
              </template>
            </el-table-column>

          </el-table>

      </el-form>

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
import {Clear, Copy, Help, Minus, Plus, SortThree} from "@icon-park/vue-next";
import {PostPage} from "@/api/autotest/page";
import {bus, busEvent} from "@/utils/bus-events";
import {ElMessage, ElTree} from "element-plus";

const props = defineProps({
  testType: {
    default: '',
    type: String
  }
})

onMounted(() => {
  bus.on(busEvent.treeIsChoice, onTreeIsChoiceEvent);
  bus.on(busEvent.treeIsDone, onTreeIsDoneEvent);
  bus.on(busEvent.drawerIsShow, onShowDrawerEvent);
})

onBeforeUnmount(() => {
  bus.off(busEvent.treeIsChoice, onTreeIsChoiceEvent);
  bus.off(busEvent.treeIsDone, onTreeIsDoneEvent);
  bus.off(busEvent.drawerIsShow, onShowDrawerEvent);
})

const onShowDrawerEvent = (message: any) => {
  if (message.eventType === 'add-page') {
    resetForm()
    formData.value.project_id = message.project_id
    formData.value.module_id = message.module_id
    drawerIsShow.value = true
  }
}

const onTreeIsDoneEvent = (message: any) => {
  if (message.eventType === 'module') {
    moduleTree.value = message.content
  }
}

const onTreeIsChoiceEvent = (message: any) => {
  if (message.eventType === 'module') {
    moduleName.value = message.content.data.name
  }
}

const drawerIsShow = ref(false)
const moduleName = ref('')
const moduleTree = ref([])
const oldIndex = ref(); // 当前拖拽项的索引
const dragRow = ref();   // 当前拖拽的行数据
const defaultProps = {children: 'children', label: 'name'}
const submitButtonIsLoading = ref(false)
const ruleFormRef = ref(null)
const formData = ref({
  project_id: undefined,
  module_id: undefined,
  page_list: [{ id: `${Date.now()}`, name: null, desc: null }]
})
const formRules = {
  name: [
    {required: true, message: '请输入页面名字', trigger: 'blur'}
  ]
}
const resetForm = () => {
  formData.value = {
    project_id: undefined,
    module_id: undefined,
    page_list: [{ id: `${Date.now()}`, name: null, desc: null }]
  }
  ruleFormRef.value && ruleFormRef.value.resetFields();
  submitButtonIsLoading.value = false
}

const sendEvent = () => {
  bus.emit(busEvent.drawerIsCommit, {eventType: 'page-editor'});
}

const getNewData = () => {
  return { id: `${Date.now()}`, name: null, desc: null }
}

const addRow = () => {
  formData.value.page_list.push(getNewData())
}

const copyRow = (row: {id: string, key: null, value: null, remark: null, data_type: null}) => {
  let newData = JSON.parse(JSON.stringify(row))
  newData.id = `${Date.now()}`
  formData.value.page_list.push(newData)
}

const isShowDelButton = (index: number) => {
  return !(formData.value.page_list.length === 1 && index === 0)
}

// 删除一行
const delRow = (index: number) => {
  formData.value.page_list.splice(index, 1)
}

const clearData = () => {
  formData.value.page_list[0] = getNewData()
}

const validatePageList = () => {
  if (formData.value.page_list.length < 1){
    ElMessage.warning('请填写页面信息')
    throw new Error('请填写页面信息')
  }
  formData.value.page_list.forEach((item, index) => {
    if (!item.name){
      ElMessage.warning(`第 ${index + 1} 行, 请填完善数据`)
      throw new Error(`第 ${index + 1} 行, 请填完善数据`);
    }
  })
}

const addData = () => {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      validatePageList()
      submitButtonIsLoading.value = true
      PostPage(props.testType, formData.value).then(response => {
        submitButtonIsLoading.value = false
        if (response) {
          sendEvent()
          drawerIsShow.value = false
        }
      })
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
  const updatedData = [...formData.value.page_list];
  // // 移除当前拖拽的行数据
  updatedData.splice(oldIndex.value, 1);
  // // 插入拖拽的行数据到目标索引位置
  updatedData.splice(newIndex, 0, dragRow.value);
  formData.value.page_list = updatedData;
  // 恢复样式
  event.target.classList.remove('drag-dragging');
};

</script>


<style scoped lang="scss">

</style>
