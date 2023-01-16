<template>
    <div class="page">
        <portal to="starget">
            <a-button @click="modalOpen" type="primary">+ 创建应用</a-button>
        </portal>

        <div class="table">
            <a-table :columns="columns" :dataSource="tableData" :pagination="false" :scroll="{ x: 1000 }">
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'platform'">
                        <div class="ovdiv" v-for="ap in record.platform">{{ap?.platform?.platform_name}}</div>
                        <div class="ovdiv" v-if="!record.platform?.length">--</div>
                    </template>
                    <template v-if="column.key === 'channel'">
                        <div v-for="ch in record.channel_items">{{ch.label}}</div>
                        <div class="ovdiv" v-if="!record.channel_items?.length">--</div>
                    </template>
                    <template v-if="column.key === 'statusRender'">
                        <a-switch
                            @change="statusChange($event, record)"
                            checked-children="开"
                            un-checked-children="关"
                            v-model:checked="record.status"
                        />
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a @click="configRun(record.id)" style="color: #1890FF">配置通道</a>
                        <a @click="associatedShow(record.id)" style="color: #1890FF;margin: 0 16px;">关联项目</a>
                        <a @click="editShow(record)" style="color: #1890FF">编辑</a>
                        <a @click="delRun(record)" style="color: #e34d59;margin-left: 16px;">删除</a>
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
                show-quick-jumper
                show-size-changer
                v-model:current="current"
                v-model:pageSize="pageSize"
            />
        </div>

        <a-modal :title="editType === EditType.CREATE ? '创建应用' : '编辑应用' " @ok="handleOk" v-model:visible="visible">
            <a-form
                :label-col="{ span: 4 }"
                :model="formState"
                :wrapper-col="{ span: 20 }"
                @finish="onFinish"
                @finishFailed="onFinishFailed"
                autocomplete="off"
                name="basic"
                ref="modalFormRef"
            >
                <a-form-item :rules="[{ required: true, message: '请输入应用名称!' }]" label="应用名称" name="projectName">
                    <a-input maxlength="50" placeholder="请输入应用名称" v-model:value="formState.projectName" />
                </a-form-item>
            </a-form>
        </a-modal>

        <!-- 关联项目 -->
        <associatedProject @associatedSucc="initGetDataRun" ref="associatedRef" />
        <!-- 关联项目 -->

        <!-- 配置通道 -->
        <channel @channelUpdateSucc="initGetDataRun" ref="channelRef" />
        <!-- 配置通道 -->
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, Ref, ref } from "vue";
import { http } from "@/utils/http";
import {
    AppReqParamsType,
    AppTableDataType,
    AssociatedProject,
    ChannelInterface,
} from "@/types/applicationManagement";
import { FormInstance, message } from "ant-design-vue";
import { EditType } from "@/common/editType";
import { useConfirm } from "@/hooks/useConfirm";
import associatedProject from "@/components/applicationManagement/associatedProject.vue";
import channel from "@/components/applicationManagement/channel.vue";
import { useInfo } from "@/hooks/useInfo";

export default defineComponent({
    name: "ProjectManagement",
    components: {
        associatedProject,
        channel,
    },
    setup() {
        const tableData: Ref<Array<AppTableDataType>> = ref([]);
        const modifyTemp: Ref<AppTableDataType | null> = ref(null);
        const pageSize: Ref<number> = ref(10);
        const current: Ref<number> = ref(1);
        const tableTotal: Ref<number> = ref(0);
        const visible: Ref<boolean> = ref(false);
        const associatedRef = ref<AssociatedProject>();
        const channelRef = ref<ChannelInterface>();
        const modalFormRef = ref<FormInstance>();
        const onFinish = (values: any): void => {
            console.log("Success:", values);
        };
        const editType: Ref<EditType> = ref(EditType.CREATE);
        const formState = reactive({
            projectName: "",
        });
        const onFinishFailed = (errorInfo: any): void => {
            console.log("Failed:", errorInfo);
        };
        const columns = ref([
            {
                title: "应用ID",
                key: "app_key",
                dataIndex: "app_key",
                width: 200,
            },
            {
                title: "应用名称",
                key: "app_name",
                dataIndex: "app_name",
                width: 420,
                ellipsis: true,
            },
            {
                title: "关联项目",
                key: "platform",
                dataIndex: "platform",
                ellipsis: true,
                width: 344,
            },
            {
                title: "发送通道",
                key: "channel",
                dataIndex: "channel",
                ellipsis: true,
                width: 240,
            },
            {
                title: "使用状态",
                key: "statusRender",
                dataIndex: "statusRender",
                width: 160,
            },
            {
                title: "操作",
                key: "operation",
                dataIndex: "operation",
                fixed: "right",
                width: 256,
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
            const params: AppReqParamsType = {
                page: current.value,
                pageSize: pageSize.value,
            };
            http.post("/api/app/list", params).then((res) => {
                console.log(res);
                if (res.data) {
                  if(res.data.count && !res.data?.list?.length) {
                    initGetDataRun();
                  }
                  tableData.value = res.data.list;
                  tableTotal.value = res.data.count;
                  for (const sime of tableData.value) {
                      sime.status = sime.status === 1;
                  }
                }
            });
        };
        initGetDataRun();
        const pageChange = (page: number, size: number): void => {
            pageSize.value = size;
            current.value = page;
            getData();
        };
        const onShowSizeChange = (page: number, size: number): void => {
            pageSize.value = size;
        };
        const modalOpen = (): void => {
            formState.projectName = "";
            editType.value = EditType.CREATE;
            modalFormRef.value?.clearValidate();
            visible.value = true;
        };
        const editShow = (data: AppTableDataType): void => {
            editType.value = EditType.UPDATE;
            modalFormRef.value?.clearValidate();
            formState.projectName = data.app_name;
            modifyTemp.value = data;
            visible.value = true;
        };
        const addRunReq = (appName: string): void => {
            http.post("/api/app/create", { app_name: appName }).then(
                (res: any) => {
                    if (res.errCode === 0) {
                        message.success("创建成功");
                        visible.value = false;
                        initGetDataRun();
                    }
                }
            );
        };
        const editRunReq = (appName: string): void => {
            http.post("/api/app/modify", {
                app_name: appName,
                id: modifyTemp.value?.id,
            }).then((res: any) => {
                if (res.errCode === 0) {
                    message.success("编辑成功");
                    visible.value = false;
                    initGetDataRun(true);
                }
            });
        };
        const handleOk = (): void => {
            modalFormRef.value?.validateFields().then(() => {
                console.log(formState);
                if (editType.value === EditType.CREATE) {
                    addRunReq(formState.projectName);
                } else {
                    editRunReq(formState.projectName);
                }
            });
        };
        const delRunReq = (id: string | number): void => {
            http.post(`/api/app/delete/${id}`, {}).then((res) => {
                if (res) {
                    message.success("删除成功");
                    initGetDataRun(true);
                }
            });
        };
        const delRun = (data: any) => {
            if (data?.channel_items?.length) {
                useInfo("提示", "该应用已配置通道，无法删除！");
                return false;
            }
            useConfirm(
                "确定删除该应用吗？",
                "删除后无法恢复",
                () => {
                    console.log("ok");
                    delRunReq(data.id);
                },
                () => {
                    console.log("clc");
                }
            );
        };
        const viewKey = (record: AppTableDataType): void => {
            console.log(record);
        };
        const statusChangeReq = (record: AppTableDataType): void => {
            const params = {
                id: record.id,
                status: record.status ? 1 : 0,
            };
            http.post("/api/app/status", params).then((res) => {
                if (res) {
                    message.success("状态更新成功");
                    initGetDataRun(true);
                }
            });
        };
        const statusChange = (e: Event, record: AppTableDataType): void => {
            console.log(e);
            console.log(record);
            useConfirm(
                `确定${!e ? "关闭" : "开启"}该应用吗？`,
                !e
                    ? "关闭后，该应用下的消息模板均失效"
                    : "开启后，该应用下发送规则将同步生效",
                () => {
                    console.log("ok");
                    statusChangeReq(record);
                },
                () => {
                    record.status = !record.status;
                    console.log("clc");
                }
            );
        };
        const associatedShow = (id: string | number) => {
            associatedRef.value?.associatedShow(id);
        };
        const configRun = (id: string | number) => {
            channelRef.value?.onShow(id);
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
            associatedRef,
            channelRef,
            configRun,
            editShow,
            onShowSizeChange,
            pageChange,
            handleOk,
            modalOpen,
            onFinish,
            onFinishFailed,
            delRun,
            viewKey,
            statusChange,
            associatedShow,
            initGetDataRun,
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
    .ovdiv {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-break: keep-all;
    }
}
</style> 