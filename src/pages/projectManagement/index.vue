<template>
    <div class="page">
        <portal to="starget">
            <a-button type="primary" @click="modalOpen">+ 创建项目</a-button>
        </portal>
       
        <div class="table">
            <a-table :columns="columns" :dataSource="tableData" :pagination="false" :scroll="{ x: 1000 }">
              <template #bodyCell="{ column, text, record }">
                 <template v-if="column.key === 'app'">
                  <div v-for="ap in record.app">{{ap?.app?.app_name || '--'}}</div>
                  <div v-if="!record.app.length">--</div>
                </template>
                <template v-if="column.key === 'platform_secret'">
                  <span v-if="record.showSecret" >{{record.platform_secret}}</span>
                  <span v-else @click="record.showSecret = true"><a>查看</a></span>
                </template>
                <template v-if="column.key === 'statusRender'">
                  <a-switch checked-children="开" un-checked-children="关" v-model:checked="record.status" @change="statusChange($event, record)" />
                </template>
                <template v-if="column.key === 'operation'">
                    <a style="color: #1890FF" @click="editShow(record)">编辑</a>
                    <a style="color: #e34d59;margin-left: 16px;" @click="delRun(record)">删除</a>
                </template>
              </template>
            </a-table>
        </div>
        <div class="paginstion">
            <a-pagination
                :showTotal="total => `总共 ${total} 项`"
                :total="tableTotal"
                @change="pageChange"
                @showSizeChange="onShowSizeChange"
                show-size-changer
                show-quick-jumper
                v-model:current="current"
                v-model:pageSize="pageSize"
            />
        </div>

        <a-modal 
          @ok="handleOk" 
          :title="editType === EditType.CREATE ? '创建项目' : '编辑项目' " 
          v-model:visible="visible"
        >
            <a-form
              :label-col="{ span: 4 }"
              :model="formState"
              :wrapper-col="{ span: 20 }"
              @finish="onFinish"
              @finishFailed="onFinishFailed"
              ref="modalFormRef"
              autocomplete="off"
              name="basic"
            >
                <a-form-item :rules="[{ required: true, message: '请输入项目名称!' }]" label="项目名称" name="projectName">
                    <a-input v-model:value="formState.projectName" placeholder="请输入项目名称" maxlength="50" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, Ref, ref } from "vue";
import { http } from "@/utils/http";
import {
    ProjectReqParamsType,
    ProjectTableColumnsType,
    ProjectTableDataType,
} from "@/types/projectManagement";
import { FormInstance, message } from "ant-design-vue";
import { EditType } from "@/common/editType";
import { useConfirm } from "@/hooks/useConfirm";
import { useInfo } from "@/hooks/useInfo";

export default defineComponent({
    name: "ProjectManagement",
    setup() {
        const tableData: Ref<Array<ProjectTableDataType>> = ref([]);
        const pageSize: Ref<number> = ref(10);
        const current: Ref<number> = ref(1);
        const tableTotal: Ref<number> = ref(0);
        const visible: Ref<boolean> = ref(false);
        const modifyTemp: Ref<ProjectTableDataType | null> = ref(null);
        const modalFormRef = ref<FormInstance>();
        const onFinish = (values: any): void => {
            console.log("Success:", values);
        };
        const editType: Ref<EditType> = ref(EditType.CREATE)
        const formState = reactive({
          projectName: '',
        });
        const onFinishFailed = (errorInfo: any): void => {
            console.log("Failed:", errorInfo);
        };
        
        const columns: Ref<Array<ProjectTableColumnsType>> = ref([
            {
                title: "项目名称",
                dataIndex: "platform_name",
                width: 424,
                ellipsis: true,
            },
            {
                title: "关联应用",
                key: "app",
                ellipsis: true,
                width: 424,
            },
            {
                title: "项目KEY",
                dataIndex: "platform_key",
                width: 256,
            },
            {
                title: "项目密钥",
                key: "platform_secret",
                ellipsis: true,
                width: 256,
            },
            {
                title: "使用状态",
                key: "statusRender",
                dataIndex: "statusRender",
                width: 120,
            },
            {
                title: "操作",
                key: "operation",
                dataIndex: "operation",
                fixed: 'right',
                width: 144,
            },
        ]);
        const initGetDataRun = (notRef?: boolean): void => {
             if (!notRef) {
              current.value = 1;
              pageSize.value = 10;
            }
            getData();
        };
        const getData = (): void => {
            const params: ProjectReqParamsType = {
                page: current.value,
                pageSize: pageSize.value,
            };
            http.post("/api/platform/list", params).then((res) => {
                console.log(res);
               if(res?.data) {
                 if(res.data.count && !res.data?.list?.length) {
                    initGetDataRun();
                  }
                 tableData.value = res.data.list;
                  for (const sime of tableData.value) {
                    sime.status = sime.status === 1
                    sime.showSecret = false
                  }
                  tableTotal.value = res.data.count;
                }
            });
        };
        initGetDataRun()
        const pageChange = (page: number, size: number): void => {
            pageSize.value = size;
            current.value = page;
            getData();
        };
        const onShowSizeChange = (page: number, size: number): void => {
            pageSize.value = size;
        };
        const modalOpen = (): void => {
          formState.projectName = '';
          editType.value = EditType.CREATE
          modalFormRef.value?.clearValidate();
          visible.value = true;
        };
        const editShow = (data: ProjectTableDataType): void => {
          editType.value = EditType.UPDATE
          modalFormRef.value?.clearValidate();
          formState.projectName = data.platform_name;
          modifyTemp.value = data
          visible.value = true;
        };
        const addRunReq = (platformName: string): void => {
            http.post("/api/platform/create", { platform_name: platformName }).then((res: any) => {
                if(res.errCode === 0) {
                  message.success('创建成功');
                  visible.value = false
                  initGetDataRun();
                }
            });
        };
        const editRunReq = (platformName: string): void => {
            http.post("/api/platform/modify", { platform_name: platformName, id: modifyTemp.value?.id }).then((res: any) => {
                if(res.errCode === 0) {
                  message.success('编辑成功');
                  visible.value = false
                  initGetDataRun(true);
                }
            });
        };
        const handleOk = (): void => {
           modalFormRef.value?.validateFields().then(() => {
            console.log(formState);
            if(editType.value === EditType.CREATE) {
              addRunReq(formState.projectName)
            }else{
              editRunReq(formState.projectName)
            }
          });
        };
        const delRunReq = (id: number): void => {
            http.post(`/api/platform/delete/${id}`, {}).then((res) => {
                if(res) {
                  message.success('删除成功');
                  initGetDataRun(true);
                }
            });
        };
        const delRun = (data: ProjectTableDataType) => {
          if(data.app.length) {
             useInfo('提示', '该项目已关联应用，无法删除！');
            return false
          }
          const id = data.id
           useConfirm('确定删除该项目吗？', '删除后无法恢复', () => {
              console.log('ok');
              delRunReq(id)
            }, () => {
              console.log('clc');
            })
        };
        const viewKey = (record: ProjectTableDataType): void => {
          console.log(record);
        };
         const statusChangeReq = (record: ProjectTableDataType): void => {
           const params = {
            id: record.id,
            status: record.status ? 1 : 0,
           }
            http.post("/api/platform/status", params).then((res) => {
                if(res) {
                  message.success('更新状态成功');
                  initGetDataRun(true);
                }
            });
        };
        const statusChange = (e: Event, record: ProjectTableDataType): void => {
           useConfirm(
            `确定${ !e ?'关闭' : '开启' }该项目吗？`,
            !e ? '关闭后，该项目下的消息模板均失效' : '开启后，该项目下发送规则将同步生效', 
            () => {
              console.log('ok');
              statusChangeReq(record)
            }, () => {
              record.status = ! record.status
              console.log('clc');
            })
        };
        return {
            tableData,
            pageSize,
            current,
            tableTotal,
            columns,
            visible,
            formState,
            modalFormRef,
            editType,
            EditType,
            modifyTemp,
            onShowSizeChange,
            pageChange,
            handleOk,
            modalOpen,
            onFinish,
            onFinishFailed,
            delRun,
            viewKey,
            statusChange,
            editShow,
        };
    },
});
</script>

<style lang="less" scoped>
.page {
    height: 100%;
    position: relative;
    padding-bottom: 40px;
    .table {
    }
    .paginstion {
        position: absolute;
        bottom: 0px;
        right: 0;
    }
}
.test{
  width: 100%;
  height: 80px;
  background: #ffffff;
}
.test2{
  width: 100%;
  height: 16px;
  background: #f0f5ff;
}
</style> 