<template>
    <div class="page">
        <portal to="starget">
            <a-button @click="associatedShow(EditType.CREATE, null)" type="primary">+ 创建模块</a-button>
        </portal>
        <portal to="searchBar">
            <div class="search-box">
                <a-form
                    :label-col="{ span: 8 }"
                    :model="reqData"
                    :wrapper-col="{ span: 16 }"
                    autocomplete="off"
                    layout="inline"
                    name="basic"
                >
                    <a-row :gutter="24" @keyup.enter.native="searchRun">
                        <a-form-item label="模块ID" name="id">
                            <a-input placeholder="请输入模块ID" style="width: 240px" v-model:value="reqData.id" />
                        </a-form-item>
                        <a-form-item label="模块名称" name="name">
                            <a-input placeholder="请输入模块名称" style="width: 240px" v-model:value="reqData.module_name" />
                        </a-form-item>
                        <a-form-item label="模块标识" name="tag">
                            <a-input placeholder="请输入模块标识" style="width: 240px" v-model:value="reqData.module_key" />
                        </a-form-item>
                        <a-form-item label="应用" name="app">
                               <a-select placeholder="请选择应用" style="width: 240px" allowClear v-model:value="reqData.app_id">
                                    <template v-for="item in appOption">
                                        <a-select-option :value="item.id">{{item.app_name}}</a-select-option>
                                    </template>
                                </a-select>
                        </a-form-item>
                        <a-form-item style="width: 240px">
                            <a-button @click="searchRun" type="primary">搜索</a-button>
                            <a-button @click="initGetDataRun" style="margin-left: 8px;">重置</a-button>
                        </a-form-item>
                    </a-row>
                </a-form>
            </div>
        </portal>
        <div class="table">
            <a-table :columns="columns" :dataSource="tableData" :pagination="false" :scroll="{ x: 1000 }">
                <template #bodyCell="{ column, text, record }">
                    <template v-if="column.key === 'app'">
                        {{record.app?.app_name || '-'}}
                    </template>
                    <template v-if="column.key === 'operation'">
                        <a @click="associatedShow(EditType.TOVIEW, record.id)" style="color: #1890FF;margin: 0 16px;">详细字段</a>
                        <a @click="associatedShow(EditType.UPDATE,record.id)" style="color: #1890FF">编辑</a>
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

        <ModulesEdit ref="modulesEditRef" :editType="editType" @opsSuccess="initGetDataRun" />
    </div>
</template>
 
<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { http } from "@/utils/http";
import {
    ModulesTableDataType,
    ModulesReqParamsType,
    ModulesEditInterface,
} from "@/types/modulesManagement";
import ModulesEdit from "@/components/modulesManagement/modulesEdit.vue";
import { useConfirm } from "@/hooks/useConfirm";
import { message } from "ant-design-vue";
import { EditType } from "@/common/editType";
import { AppType } from "@/types/projectManagement";

export default defineComponent({
    name: "ModulesManagement",
    components: {
        ModulesEdit,
    },
    setup() {
        const tableData: Ref<Array<ModulesTableDataType>> = ref([]);
        const pageSize: Ref<number> = ref(10);
        const current: Ref<number> = ref(1);
        const tableTotal: Ref<number> = ref(0);
        const modulesEditRef = ref<ModulesEditInterface>();
        const reqData: Ref<ModulesReqParamsType> = ref({
            module_name: "",
            id: "",
            module_key: "",
            app_id: undefined,
            page: 1,
            pageSize: 10,
        });
        const editType: Ref<EditType> = ref(EditType.CREATE);
        const reqDataInit = (): void => {
            reqData.value = {
                module_name: "",
                id: "",
                module_key: "",
                app_id: undefined,
                page: 1,
                pageSize: 10,
            };
        };
        const columns = ref([
            {
                title: "模块ID",
                key: "id",
                dataIndex: "id",
                width: 360,
            },
            {
                title: "模块名称",
                key: "module_name",
                dataIndex: "module_name",
                width: 300,
                ellipsis: true,
            },
            {
                title: "模块标识",
                key: "module_key",
                dataIndex: "module_key",
                width: 250,
                ellipsis: true,
            },
            {
                title: "应用",
                key: "app",
                dataIndex: "app",
                ellipsis: true,
                width: 500,
            },
            {
                title: "操作",
                key: "operation",
                dataIndex: "operation",
                width: 200,
                fixed: "right",
            },
        ]);
        const appOption: Ref<Array<AppType>> = ref([]);
        const getAppOption = () => {
            http.post("/api/app/list", {}).then((res) => {
                if (res) {
                    appOption.value = res.data.list;
                }
            });
        };
        getAppOption();
        const initGetDataRun = (notRef?: boolean): void => {
            reqDataInit();
             if (!notRef) {
              reqData.value.page = 1;
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
            http.post("/api/module/list", reqData.value).then((res) => {
                console.log(res);
                if (res && res.data) {
                   if(res.data.count && !res.data?.list?.length) {
                    initGetDataRun();
                  }
                    tableData.value = res.data.list;
                    tableTotal.value = res.data.count;
                }
            });
        };
        initGetDataRun();
        const pageChange = (page: number, size: number): void => {
            reqData.value.pageSize = size;
            reqData.value.page = page;
            getData();
        };
        const onShowSizeChange = (page: number, size: number): void => {
            reqData.value.pageSize = size;
        };
        const delRunReq = (id: string | number): void => {
            http.post(`/api/module/delete/${id}`, {}).then((res: any) => {
                if (res.errCode === 0) {
                    message.success("删除成功");
                    initGetDataRun(true);
                }
            });
        };
        const delRun = (id: string | number): void => {
            useConfirm(
                "确定删除该模块吗？",
                "删除后无法恢复",
                () => {
                    console.log("ok");
                    delRunReq(id);
                },
                () => {
                    console.log("clc");
                }
            );
        };
        const associatedShow = ( typeCode: EditType, id?: string | number) => {
          editType.value = typeCode;
          console.log(editType);
          modulesEditRef.value?.showDrawer(id);
        };
        return {
            tableData,
            pageSize,
            current,
            tableTotal,
            reqData,
            columns,
            modulesEditRef,
            EditType,
            editType,
            appOption,
            pageChange,
            onShowSizeChange,
            searchRun,
            initGetDataRun,
            delRun,
            associatedShow,
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
</style>