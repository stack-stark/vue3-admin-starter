<template>
    <div class="page">
        <portal to="starget">
            <a-button @click="modalOpen" type="primary">+ 发送消息</a-button>
        </portal>
        <portal to="searchBar">
            <div class="search-box">
                <a-form
                    :label-col="{ span: 7 }"
                    :model="reqData"
                    :wrapper-col="{ span: 17 }"
                    autocomplete="off"
                    labelAlign="right"
                    layout="inline"
                    name="basic"
                >
                    <a-row :gutter="24" @keyup.enter.native="searchRun">
                        <a-col :span="6">
                            <a-form-item label="消息标题：" name="id">
                                <a-input placeholder="请输入关键词" style="width: 100%" v-model:value="reqData.title" />
                            </a-form-item>
                        </a-col>

                        <a-col :span="6">
                            <a-form-item label="消息 ID：" name="name">
                                <a-input placeholder="请输入关键词" style="width: 100%" v-model:value="reqData.id" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="应用：" name="name">
                                <a-select
                                    allowClear
                                    placeholder="全部"
                                    style="width: 100%"
                                    v-model:value="reqData.app_id"
                                >
                                    <template v-for="item in appOption">
                                        <a-select-option :value="item.id">{{item.app_name}}</a-select-option>
                                    </template>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6">
                            <a-form-item label="项目：" name="tag">
                                <a-select placeholder="全部" style="width: 100%" v-model:value="reqData.platform_id">
                                    <template v-for="item in platformOption">
                                        <a-select-option :value="item.id">{{item.platform_name}}</a-select-option>
                                    </template>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6" style="margin-top: 15px;">
                            <a-form-item label="目标用户：" name="name">
                                <a-input placeholder="请输入关键词" style="width: 100%" v-model:value="reqData.user_name" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6" style="margin-top: 15px;">
                            <a-form-item label="发送时间" name="app">
                                <a-range-picker
                                    :show-time="{ format: 'HH:mm' }"
                                    @change="onRangeChange"
                                    @ok="onRangeOk"
                                    format="YYYY-MM-DD HH:mm"
                                    v-model:value="reqData.created_atinit"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="6" style="margin-top: 15px;">
                            <a-form-item label="通道：" name="app">
                                <a-select
                                    allowClear
                                    placeholder="全部"
                                    style="width: 100%;"
                                    v-model:value="reqData.channel_id"
                                >
                                    <template v-for="item in channelOption">
                                        <a-select-option :value="item.value">{{item.label}}</a-select-option>
                                    </template>
                                </a-select>
                            </a-form-item>
                        </a-col>

                        <a-col :span="6" style="margin-top: 15px;">
                            <a-form-item label="发送状态" name="app">
                                <a-select
                                    allowClear
                                    placeholder="全部"
                                    style="width: 100%;"
                                    v-model:value="reqData.status"
                                >
                                    <a-select-option value="0">处理中</a-select-option>
                                    <a-select-option value="1">发送完成</a-select-option>
                                    <a-select-option value="-1">发送失败</a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6" style="margin-top: 15px;">
                            <a-form-item label="用户角色：" name="app">
                                <a-select allowClear placeholder="全部" style="width: 100%;" v-model:value="reqData.role">
                                    <template v-for="item in roleOption">
                                        <a-select-option :value="item.value">{{item.label}}</a-select-option>
                                    </template>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="6" style="margin-top: 15px;">
                            <a-form-item style="width: 100%;">
                                <a-button @click="searchRun" type="primary">搜索</a-button>
                                <a-button @click="initGetDataRun" style="margin-left: 8px;">重置</a-button>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-form>
            </div>
        </portal>
        <div class="table">
            <a-table :columns="columns" :dataSource="tableData" :pagination="false" :scroll="{ x: 1000, y: 450 }">
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'statusRender'">
                        <div class="tag0" v-if="record.status == 0">处理中</div>
                        <div class="tag" v-if="record.status == 1">发送完成</div>
                        <div class="tag2" v-if="record.status == -1">发送失败</div>
                    </template>
                    <template v-if="column.key === 'app'">{{record.app?.app_name || '-'}}</template>
                    <template v-if="column.key === 'user_name'">{{record.user_name || '-'}}</template>
                    <template v-if="column.key === 'platform_name'">{{record.platform?.platform_name || '-'}}</template>

                    <template v-if="column.key === 'operation'">
                        <a @click="viewShow(record.id)" style="color: #1890FF;">详情</a>
                    </template>
                </template>
            </a-table>
        </div>
        <div class="paginstion">
            <a-pagination
                :showTotal="total => `总共 ${total} 项`"
                :total="tableTotal"
                show-quick-jumper
                @change="pageChange"
                @showSizeChange="onShowSizeChange"
                show-size-changer
                v-model:current="reqData.page"
                v-model:pageSize="reqData.pageSize"
            />
        </div>
        <MessageDetail ref="messageViewRef" />
        <SendMessageSuper ref="sendMessageSuperRef" @sendSuccess="initGetDataRun" />
    </div>
</template>
 
<script lang="ts">
import { defineComponent, ref, Ref } from "vue";  
import { http } from "@/utils/http";
import { ModulesCauType } from "@/types/modulesManagement";
import MessageDetail from "@/components/messageRecord/messageRecordView.vue";
import SendMessageSuper from "@/components/messageRecord/sendMessageSuper.vue";
import { useConfirm } from "@/hooks/useConfirm";
import { message } from "ant-design-vue";
import { AppType } from "@/types/projectManagement";
import {
    TemplateTableDataType,
} from "@/types/templateManagement";
import { EditType } from "@/common/editType";

import { MessageReqParamsType, MessageViewRef, SendMessageSuperRefType } from "@/types/messageRecord";
import dayjs from 'dayjs';
export default defineComponent({
    name: "MessageRecord",
    components: {
        MessageDetail,
        SendMessageSuper,
    },
    setup() {
        const tableData: Ref<Array<TemplateTableDataType>> = ref([]);
        const pageSize: Ref<number> = ref(10);
        const current: Ref<number> = ref(1);
        const tableTotal: Ref<number> = ref(0);
        const messageViewRef = ref<MessageViewRef>();
        const sendMessageSuperRef = ref<SendMessageSuperRefType>();
        const editType: Ref<EditType> = ref(EditType.CREATE);
        const reqData: Ref<MessageReqParamsType> = ref({
            module_id: undefined,
            module_key: "",
            channel: undefined,
            app_id: undefined,
            page: 1,
            title: "",
            id: "",
            user_name: "",
            created_at: [],
            status: undefined,
            platform_id: undefined,
            channel_id: undefined,
            created_atinit: "",
            role: undefined,
            pageSize: 10,
        });
         const setDefDate = () => {
          const start = dayjs().subtract(7, 'days').hour(0).minute(0);
          const end = dayjs().hour(23).minute(59);
          reqData.value.created_atinit = [start, end];
        };
        const reqDataInit = (): void => {
            reqData.value = {
                module_id: undefined,
                module_key: "",
                channel: undefined,
                app_id: undefined,
                page: 1,
                title: "",
                id: "",
                user_name: "",
                created_atinit: "",
                created_at: [],
                status: undefined,
                platform_id: undefined,
                channel_id: undefined,
                role: undefined,
                pageSize: 10,
            };
            setDefDate();
        };
        const appOption: Ref<Array<AppType>> = ref([]);
        const getAppOption = () => {
            http.post("/api/app/list", {}).then((res) => {
                if (res) {
                    appOption.value = res.data.list;
                }
            });
        };
        getAppOption();
        const moduleOption: Ref<Array<ModulesCauType>> = ref([]);
        const getModuleOption = () => {
            http.post("/api/module/list", {}).then((res) => {
                if (res) {
                    moduleOption.value = res.data.list;
                }
            });
        };
        getModuleOption();
        const channelOption: Ref<Array<ModulesCauType>> = ref([]);
        const getChannelOption = () => {
            http.post("/api/channel/list", {}).then((res) => {
                if (res) {
                    channelOption.value = res.data;
                }
            });
        };
        const platformOption: Ref<Array<ModulesCauType>> = ref([]);
        const getPlatformOption = () => {
            http.post("/api/platform/list/simple", {}).then((res) => {
                if (res) {
                    platformOption.value = res.data;
                }
            });
        };
        const roleOption: Ref<Array<ModulesCauType>> = ref([]);
        const getRoleOption = () => {
            http.post("/api/user/types", {}).then((res) => {
                if (res) {
                    roleOption.value = res.data;
                }
            });
        };
        getChannelOption();
        getPlatformOption();
        getRoleOption();
        const columns = ref([
            {
                title: "消息ID",
                key: "id",
                dataIndex: "id",
                width: 120,
                ellipsis: true,
            },
            {
                title: "消息标题",
                key: "title",
                dataIndex: "title",
                width: 300,
                ellipsis: true,
            },
            {
                title: "目标用户",
                key: "user_name",
                dataIndex: "user_name",
                ellipsis: "",
                width: 240,
            },
            {
                title: "应用",
                key: "app",
                dataIndex: "app",
                ellipsis: true,
                width: 200,
            },
             {
                title: "项目",
                key: "platform_name",
                dataIndex: "platform_name",
                ellipsis: "",
                width: 140,
            },
            {
                title: "通道",
                key: "channel_name",
                dataIndex: "channel_name",
                ellipsis: "",
                width: 200,
            },
            {
                title: "发送状态",
                dataIndex: "statusRender",
                key: "statusRender",
                width: 168,
            },
            {
                title: "发送时间",
                dataIndex: "updated_at",
                key: "updated_at",
                width: 132,
            },
            {
                title: "操作",
                dataIndex: "operation",
                key: "operation",
                width: 80,
            },
        ]);
        const initGetDataRun = (): void => {
            reqDataInit();
            current.value = 1;
            pageSize.value = 10;
            getData();
        };
        const searchRun = (): void => {
            reqData.value.page = 1;
            reqData.value.pageSize = 10;
            getData();
        };
        const getData = (): void => {
            if (reqData.value.created_atinit[0]) {
                reqData.value.created_at[0] =
                    reqData.value.created_atinit[0].format(
                        "YYYY-MM-DD HH:mm:ss"
                    );
                reqData.value.created_at[1] =
                    reqData.value.created_atinit[1].format(
                        "YYYY-MM-DD HH:mm:ss"
                    );
            }
            http.post("/api/message/list", reqData.value).then((res) => {
                console.log(res);
                tableData.value = res.data.list;
                tableTotal.value = res.data.count;
               
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
        const delRunReq = (id: number): void => {
            http.post(`/api/platform/delete/${id}`, {}).then((res) => {
                if (res) {
                    message.success("删除成功");
                    initGetDataRun();
                }
            });
        };
        const delRun = (id: number): void => {
            useConfirm(
                "确定删除该模板吗？",
                "删除后无法恢复",
                () => {
                    delRunReq(id);
                },
                () => {
                    console.log("clc");
                }
            );
        };
        const viewShow = (id: string | number) => {
            messageViewRef.value?.showDrawer(id);
        };
        const modalOpen = () => {
            sendMessageSuperRef.value?.showSendDrawer();
        };
        const statusChangeReq = (record: TemplateTableDataType): void => {
            const params = {
                id: record.id,
                status: record.status ? 1 : 0,
            };
            http.post("/api/template/status", params).then((res) => {
                if (res) {
                    message.success("状态更新成功");
                    initGetDataRun();
                }
            });
        };
        const statusChange = (
            e: Event,
            record: TemplateTableDataType
        ): void => {
            useConfirm(
                `确定${record.id === 1 ? "关闭" : "开启"}该应用吗？`,
                record.id === 1
                    ? "关闭后，该模板立即失效"
                    : "开启后，该模板立即生效",
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
        return {
            tableData,
            pageSize,
            current,
            tableTotal,
            reqData,
            columns,
            messageViewRef,
            appOption,
            moduleOption,
            channelOption,
            platformOption,
            editType,
            EditType,
            roleOption,
            sendMessageSuperRef,
            getRoleOption,
            statusChange,
            pageChange,
            onShowSizeChange,
            searchRun,
            initGetDataRun,
            delRun,
            viewShow,
            modalOpen,
        };
    },
});
</script>

<style scoped lang="less" >
.search-box {
    min-height: 80px;
    background: #ffffff;
    border: 1px solid rgba(2, 14, 26, 0.08);
    margin: 16px;
    margin-bottom: 0px;
    padding: 24px 32px;
}
.page {
    height: 100%;
    position: relative;
    padding-bottom: 40px;
    .table {
    }
    .paginstion {
        position: absolute;
        margin-top: 20px;
        bottom: 0px;
        right: 0;
    }
}
.tag0 {
    width: 72px;
    height: 22px;
    background: #ffebd9;
    border-radius: 4px;
    font-size: 14px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
    font-weight: 400;
    text-align: left;
    color: #FF7A00;
    text-align: center;
}
.tag {
    width: 72px;
    height: 22px;
    background: #d9f2ea;
    border-radius: 4px;
    font-size: 14px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
    font-weight: 400;
    text-align: left;
    color: #00a870;
    text-align: center;
}
.tag2 {
    width: 72px;
    height: 22px;
    background: #fbe5e6;
    border-radius: 4px;
    font-size: 14px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
    font-weight: 400;
    text-align: left;
    color: #E34D59;
    text-align: center;
}
:deep(.ant-form-item-label) {
    width: 70px;
}
</style>
