<template>
    <div class="page">
        <portal to="starget">
            <a-button @click="modalOpen" type="primary">+ 创建模板</a-button>
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
                            <a-form-item label="通道：" name="tag">
                                <a-select placeholder="全部" style="width: 240px" v-model:value="reqData.channel_id">
                                    <template v-for="item in channelOption">
                                        <a-select-option :value="item.value">{{item.label}}</a-select-option>
                                    </template>
                                </a-select>
                            </a-form-item>
                            <a-form-item label="模板名称" name="name">
                                <a-input placeholder="请输入模板名称" style="width: 240px" v-model:value="reqData.template_name" />
                            </a-form-item>
                            <a-form-item label="应用：" name="name">
                                <a-select
                                    allowClear
                                    placeholder="全部"
                                    style="width: 240px"
                                    v-model:value="reqData.app_id"
                                >
                                    <template v-for="item in appOption">
                                        <a-select-option :value="item.id">{{item.app_name}}</a-select-option>
                                    </template>
                                </a-select>
                            </a-form-item>
                             <a-form-item style="width: 540px;">
                                <a-button @click="searchRun" type="primary">搜索</a-button>
                                <a-button @click="initGetDataRun" style="margin-left: 8px;">重置</a-button>
                            </a-form-item>
                            
                            <a-form-item label="模板ID" name="id" style="margin-top: 15px;">
                                <a-input placeholder="请输入模板ID" style="width: 240px" v-model:value="reqData.id" />
                            </a-form-item>
                            <a-form-item label="模块：" name="app" style="margin-top: 15px;">
                                <a-select
                                    allowClear
                                    placeholder="全部"
                                    style="width: 240px"
                                    v-model:value="reqData.module_id"
                                >
                                    <template v-for="item in moduleOption">
                                        <a-select-option :value="item.id">{{item.module_name}}</a-select-option>
                                    </template>
                                </a-select>
                            </a-form-item>
                      
                           
                    </a-row>
                </a-form>
            </div>
        </portal>
        <div class="table">
            <a-table :columns="columns" :dataSource="tableData" :pagination="false" :scroll="{ x: 1000, y: 500 }">
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'statusRender'">
                        <a-switch checked-children="开" un-checked-children="关" @change="statusChange($event, record)" v-model:checked="record.status" />
                    </template>
                    <template v-if="column.key === 'app'">{{record.app?.app_name || '-'}}</template>
                    <template v-if="column.key === 'module'">{{record.module?.module_name || '-'}}</template>
                    <template v-if="column.key === 'channel_items'">
                        <div v-for="ch in record.channel_items">{{ch.label}}</div>
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a @click="sendRun(record.id)" style="color: #1890FF">发送消息</a>
                        <a @click="viewShow(record.id)" style="color: #1890FF;margin: 0 16px;">详情</a>
                        <a @click="editShow(record.id)" style="color: #1890FF">编辑</a>
                        <a @click="delRun(record.id)" style="color: #e34d59;margin-left: 16px;">删除</a>
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
          <TemplateView ref="templateViewRef" />

          <TemplateEdit ref="templateEditRef" :editType="editType" @muopsSuccess="initGetDataRun" />

          <ModulesSendMessage ref="modulesSendMessageRef" @sendSuccess="initGetDataRun" />
    </div>
</template>
 
<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { http } from "@/utils/http";
import {
    ModulesCauType,
} from "@/types/modulesManagement";
import TemplateView from "@/components/templateManagement/templateEdit.vue";
import TemplateEdit from "@/components/templateManagement/templateView.vue";
import ModulesSendMessage from "@/components/templateManagement/sendMessage.vue";
import { useConfirm } from "@/hooks/useConfirm";
import { message } from "ant-design-vue";
import { AppType } from "@/types/projectManagement";
import {
    templateReqParamsType,
    TemplateTableDataType,
    templateViewRef,
    TemplateEditRef,
    ModulesSendMessageRef,
} from "@/types/templateManagement";
import { EditType } from "@/common/editType";

export default defineComponent({
    name: "TemplateManagement",
    components: {
        TemplateView,
        TemplateEdit,
        ModulesSendMessage,
    },
    setup() {
        const tableData: Ref<Array<TemplateTableDataType>> = ref([]);
        const pageSize: Ref<number> = ref(10);
        const current: Ref<number> = ref(1);
        const tableTotal: Ref<number> = ref(0);
        const templateViewRef = ref<templateViewRef>();
        const templateEditRef = ref<TemplateEditRef>();
        const modulesSendMessageRef = ref<ModulesSendMessageRef>();
        const editType: Ref<EditType> = ref(EditType.CREATE);
        const reqData: Ref<templateReqParamsType> = ref({
            template_name: "",
            module_id: undefined,
            module_key: "",
            channel_id: undefined,
            app_id: undefined,
            id: undefined,
            page: 1,
            pageSize: 10,
        });
        const reqDataInit = (): void => {
            reqData.value = {
                template_name: "",
                channel_id: undefined,
                module_id: undefined,
                module_key: "",
                app_id: undefined,
                id: undefined,
                page: 1,
                pageSize: 10,
            };
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
        getChannelOption();
        const columns = ref([
            {
                title: "模板ID",
                key: "id",
                dataIndex: "id",
                width: 160,
                ellipsis: true,
            },
            {
                title: "模板名称",
                key: "template_name",
                dataIndex: "template_name",
                width: 344,
                ellipsis: true,
            },
            {
                title: "应用",
                key: "app",
                dataIndex: "app",
                ellipsis: true,
                width: 240,
            },
            {
                title: "通道",
                key: "channel_items",
                dataIndex: "channel_items",
                ellipsis: "",
                width: 240,
            },
            {
                title: "模块",
                key: "module",
                dataIndex: "module",
                ellipsis: "",
                width: 240,
            },
            {
                title: "模板状态",
                dataIndex: "statusRender",
                key: "statusRender",
                width: 160,
            },
            {
                title: "操作",
                dataIndex: "operation",
                key: "operation",
                width: 230,
            },
        ]);
        const initGetDataRun = (notRef?: boolean): void => {
            reqDataInit();
             if (!notRef) {
              current.value = 1;
              pageSize.value = 10;
            }
            getData();
        };
        const searchRun = (): void => {
            reqData.value.page = 1;
            reqData.value.pageSize = 10;
            getData();
        };
        const getData = (): void => {
            http.post("/api/template/list", reqData.value).then((res) => {
                console.log(res);
                 if(res.data.count && !res.data?.list?.length) {
                    initGetDataRun();
                }
                tableData.value = res.data.list;
                tableTotal.value = res.data.count;
                for (const sime of tableData.value) {
                    sime.status = sime.status === 1;
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
        const delRunReq = (id: number): void => {
            http.post(`/api/template/delete/${id}`, {}).then((res) => {
                if (res) {
                    message.success("删除成功");
                    initGetDataRun(true);
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
            templateViewRef.value?.showDrawer(id);
        };
         const sendRun = (id: string | number) => {
            modulesSendMessageRef.value?.showSendDrawer(id);
        };
        const modalOpen = () => {
            editType.value = EditType.CREATE
            templateEditRef.value?.showDrawerEdit(undefined);
        };
        const editShow = (id: string | number) => {
            editType.value = EditType.UPDATE
            templateEditRef.value?.showDrawerEdit(id);
        };
        const statusChangeReq = (record: TemplateTableDataType): void => {
            const params = {
                id: record.id,
                status: record.status ? 1 : 0,
            };
            http.post("/api/template/status", params).then((res) => {
                if (res) {
                    message.success("状态更新成功");
                    initGetDataRun(true);
                }
            });
        };
        const statusChange = (
            e: Event,
            record: TemplateTableDataType
        ): void => {

            useConfirm(
                `确定${!e ? "关闭" : "开启"}该应用吗？`,
                !e
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
            templateViewRef,
            templateEditRef,
            modulesSendMessageRef,
            appOption,
            moduleOption,
            channelOption,
            editType,
            EditType,
            sendRun,
            statusChange,
            pageChange,
            onShowSizeChange,
            searchRun,
            initGetDataRun,
            delRun,
            viewShow,
            modalOpen,
            editShow,
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
        bottom: 0px;
        right: 0;
    }
}
:deep(.ant-form-item-label) {
    width: 70px;
}
</style>
