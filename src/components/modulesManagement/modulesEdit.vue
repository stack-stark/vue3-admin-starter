<template>
    <div>
        <a-drawer
            :closable="false"
            :maskClosable="editType === EditType.TOVIEW"
            :title="title"
            class="custom-chnnel"
            placement="right"
            v-model:visible="drawerVisible"
            width="800px"
        >
            <div class="dwbox">
                <div class="appform">
                    <a-form
                        :label-col="{ span: 4 }"
                        :model="moduleForm"
                        :wrapper-col="{ span: 20 }"
                        autocomplete="off"
                        ref="moduleFormRef"
                    >
                        <template v-if="editType === EditType.CREATE || editType === EditType.UPDATE">
                            <a-form-item :rules="[{ required: true ,message: '请选择应用名称' }]" label="应用名称" name="app_id">
                                <a-select placeholder="请选择应用名称" style="width: 627px" v-model:value="moduleForm.app_id">
                                    <template v-for="item in appOption">
                                        <a-select-option :value="item.id">{{item.app_name}}</a-select-option>
                                    </template>
                                </a-select>
                            </a-form-item>
                            <a-form-item :rules="[{ required: true, message: '请输入模块标识，不超过50个字符' }]" label="模块名称" name="module_name">
                                <a-input placeholder="请输入模块名称" v-model:value="moduleForm.module_name" maxlength="50" />
                            </a-form-item>
                            <a-form-item :rules="[{ required: true, message: '请输入模块标识，不超过50个字符' }]" label="模块标识" name="module_key">
                                <a-input placeholder="请输入模块标识" v-model:value="moduleForm.module_key" maxlength="50" />
                            </a-form-item>
                        </template>
                        <template v-else>
                            <div class="viewm">
                                <div class="view-title">模块ID:</div>
                                <div class="view-con">{{moduleForm.id}}</div>
                            </div>
                            <div class="viewm">
                                <div class="view-title">应用名称:</div>
                                <div class="view-con">{{moduleForm.app?.app_name}}</div>
                            </div>
                            <div class="viewm">
                                <div class="view-title">模块名称:</div>
                                <div class="view-con">{{moduleForm.module_name}}</div>
                            </div>
                            <div class="viewm" style="margin-bottom: 32px;">
                                <div class="view-title">模块标识:</div>
                                <div class="view-con">{{moduleForm.module_key}}</div>
                            </div>
                        </template>
                        <div class="filed">
                            <div class="title">字段设置</div>
                            <div class="table-form" v-if="editType === EditType.CREATE || editType === EditType.UPDATE">
                                <div class="mock-title">
                                    <div class="name"><span style="color: red">*</span> 字段名称</div>
                                    <div class="code"><span style="color: red">*</span>字段code</div>
                                    <div class="value">值</div>
                                    <div class="ops"></div>
                                </div>
                                <div class="mock-title mocklist" v-for="(some, index) in moduleForm.module_fields">
                                    <div class="name">
                                        <a-form-item
                                            :name="['module_fields', index, 'name'  ]"
                                            :rules="[{ required: true, message: '请输入字段名称' }]"
                                            label
                                            style="margin-bottom: 0px;"
                                        >
                                            <a-input placeholder="备注字段含义" maxlength="50" v-model:value="some.name" />
                                        </a-form-item>
                                    </div>
                                    <div class="code">
                                        <a-form-item
                                            :name="['module_fields', index, 'field'  ]"
                                            :rules="[{ required: true, message: '请输入字段code' }]"
                                            label
                                            style="margin-bottom: 0px;"
                                        >
                                            <a-input placeholder="请输入字段code" maxlength="50" :disabled="some.disabled" v-model:value="some.field" />
                                        </a-form-item>
                                    </div>
                                    <div class="value">
                                        <a-form-item
                                            :name="['module_fields', index, 'value'  ]"
                                            label
                                            style="margin-bottom: 0px;"
                                        >
                                            <a-input placeholder="枚举字段值用','分割"  maxlength="300" v-model:value="some.value" />
                                        </a-form-item>
                                    </div>
                                    <div class="ops">
                                        <span @click="addModuleFields">
                                            <i class="iconfont iconincrease_icon_add"></i>
                                        </span>
                                        <span @click="delNowRow(index)" style="margin-left: 16px;" v-if="index !== 0">
                                            <i class="iconfont iconincrease_icon_cancel"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="table-form" v-else>
                                <a-table
                                    :columns="columnsView"
                                    :dataSource="moduleForm.module_fields"
                                    :pagination="false"
                                ></a-table>
                            </div>
                        </div>
                    </a-form>
                </div>
            </div>

            <template #footer>
                <div class="footer" v-if="editType === EditType.CREATE || editType === EditType.UPDATE">
                    <a-button @click="onClose" style="margin-right: 8px">取消</a-button>
                    <a-button @click="saveRun" class="save" type="primary">保存</a-button>
                </div>
            </template>
        </a-drawer>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref, watch } from "vue";
import { EditType } from "@/common/editType";
import { ModulesCauType, FieldType } from "@/types/modulesManagement";
import { FormInstance, message } from "ant-design-vue";
import { AppType } from "@/types/projectManagement";
import { http } from "@/utils/http";

export default defineComponent({
    name: "ModulesEdit",
    props: {
        editType: {
            type: Number,
            default: null,
        },
    },
    emits: ["opsSuccess"],
    setup(props, context) {
        console.log("props.editType", props.editType);
        const editType: Ref<number> = ref(props.editType);
        const drawerVisible: Ref<boolean> = ref(false);
        const moduleForm: Ref<ModulesCauType> = ref({
            module_name: "",
            module_key: "",
            app_id: undefined,
            module_fields: [
                {
                    field: "",
                    name: "",
                    value: "",
                    disabled: false
                },
            ],
        });
        watch(
            () => props.editType,
            (newValue, oldValue) => {
                editType.value = newValue;
            }
        );
        const suid: Ref<number | string> = ref("");
        const moduleFormRef = ref<FormInstance>();
        const title = computed(() => {
            return ["详细信息", "创建模块", "编辑模块"][editType.value];
        });
        const appOption: Ref<Array<AppType>> = ref([]);
        const getAppOption = () => {
            http.post("/api/app/list", {}).then((res) => {
                console.log(res);
                if (res) {
                    appOption.value = res.data.list;
                }
            });
        };
        const getDetailById = (id: string | number) => {
            http.post(`/api/module/detail/${id}`, {}).then((res) => {
                console.log(res);
                if (res && res.data) {
                    moduleForm.value = res.data;
                    for (const fields of moduleForm.value.module_fields) {
                      fields.disabled = true
                    }
                }
            });
        };
        const showDrawer = (id?: string | number): void => {
            drawerVisible.value = true;
            moduleForm.value = {
            module_name: "",
            module_key: "",
            app_id: undefined,
            module_fields: [
                {
                    field: "",
                    name: "",
                    value: "",
                    disabled: false
                },
            ],
        };
         moduleFormRef.value?.clearValidate()
            getAppOption();
            if (id) {
                suid.value = id;
                getDetailById(id);
            }
        };
        const filedData: Ref<Array<FieldType>> = ref([
            {
                field: "",
                name: "",
                value: "",
            },
        ]);
        const columnsView = ref([
            {
                title: "字段名称",
                key: "name",
                width: 216,
                dataIndex: "name",
            },
            {
                title: "字段Code",
                key: "field",
                width: 216,
                dataIndex: "field",
            },
            {
                title: "值",
                key: "value",
                width: 304,
                dataIndex: "value",
            },
        ]);
        const addOrEditRunReq = () => {
            const params = moduleForm.value;
            const url: string =
                editType.value === EditType.UPDATE
                    ? "/api/module/modify"
                    : "/api/module/create";
            http.post(url, params).then((res: any) => {
                if(res.errCode === 0) {
                    message.success("操作成功");
                    context.emit("opsSuccess", true);
                    drawerVisible.value = false;
                }
            });
        };
        const saveRun = () => {
            moduleFormRef.value?.validateFields().then(() => {
                addOrEditRunReq();
            });
        };
        const delNowRow = (index: number) => {
            moduleForm.value.module_fields.splice(index, 1);
        };
        const addModuleFields = () => {
            moduleForm.value.module_fields.push({
                field: "",
                name: "",
                value: "",
                disabled: false
            });
        };
        const onClose = () => {
            drawerVisible.value = false;
        };
        return {
            EditType,
            editType,
            moduleForm,
            drawerVisible,
            title,
            filedData,
            columnsView,
            moduleFormRef,
            appOption,
            saveRun,
            onClose,
            showDrawer,
            delNowRow,
            addModuleFields,
        };
    },
});
</script>

<style lang="less" scoped>
.custom-chnnel {
    .dwbox {
        background: #ffffff;
        overflow-y: auto;
        height: 100%;
    }
    .footer {
        display: flex;
        justify-content: flex-end;
        .save {
        }
    }
    .filed {
        padding: 0 8px;
        margin: 0 8px;
        .title {
            font-size: 16px;
            font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
            font-weight: 700;
            text-align: left;
            color: rgba(2, 14, 26, 0.85);
        }
        .table-form {
            margin-top: 24px;
            .mock-title {
                display: flex;
                font-size: 14px;
                width: 736px;
                font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
                font-weight: 700;
                text-align: left;
                color: rgba(2, 14, 26, 0.85);
                .name {
                    width: 216px;
                    height: 54px;
                    background: #f5f8ff;
                    padding: 16px;
                    box-shadow: 0px -1px 0px 0px rgba(2, 14, 26, 0.15) inset;
                }
                .code {
                    width: 216px;
                    height: 54px;
                    padding: 16px;
                    background: #f5f8ff;
                    box-shadow: 0px -1px 0px 0px rgba(2, 14, 26, 0.15) inset;
                }
                .value {
                    width: 216px;
                    height: 54px;
                    padding: 16px;
                    background: #f5f8ff;
                    box-shadow: 0px -1px 0px 0px rgba(2, 14, 26, 0.15) inset;
                }
                .ops {
                    width: 88px;
                    height: 54px;
                    box-shadow: 0px -1px 0px 0px rgba(2, 14, 26, 0.15) inset;
                    padding: 16px;
                    background: #f5f8ff;
                }
            }
            .mocklist {
                .name,
                .code,
                .value,
                .ops {
                    background: #fff;
                    min-height: 64px;
                }
            }
        }
    }
    .iconincrease_icon_add {
        color: #1890ff;
    }
    .iconincrease_icon_cancel {
        color: red;
    }
    .ant-table-thead > tr > th {
        background: #f5f8ff !important;
    }
    .viewm {
        display: flex;
        margin-left: 16px;
        margin-bottom: 12px;
        .view-title {
            font-size: 14px;
            font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: rgba(2, 14, 26, 0.45);
        }
        .view-con {
            width: 666px;
            margin-left: 10px;
            font-size: 14px;
            font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: rgba(2, 14, 26, 0.65);
        }
    }
}
</style>