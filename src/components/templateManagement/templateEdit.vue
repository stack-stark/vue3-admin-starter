<template>
    <div>
        <a-drawer
            :closable="false"
            :maskClosable="false"
            :title="title"
            class="custom-chnnel"
            placement="right"
            v-model:visible="drawerVisibleEdit"
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
                        @finishFailed="onFinishFailed"
                    >
                        <a-form-item :rules="[{ required: true, message:'请输入模板名称,不超过50字符' }]" label="模板名称" name="template_name">
                            <a-input maxlength="50" placeholder="请输入模板名称" v-model:value="moduleForm.template_name" />
                        </a-form-item>
                        <a-form-item :rules="[{ required: true, message: '请选择应用名称' }]" label="应用" name="app_id">
                            <a-select
                                @change="appOptionChange"
                                placeholder="请选择应用名称"
                                style="width: 627px"
                                v-model:value="moduleForm.app_id"
                            >
                                <template v-for="item in appOption">
                                    <a-select-option :value="item.id">{{item.app_name}}</a-select-option>
                                </template>
                            </a-select>
                        </a-form-item>

                        <a-form-item :rules="[{ required: true, message: '请选择发送通道' }]" label="发送通道" name="channel_ids">
                            <a-checkbox-group
                                :options="channelOptions"
                                @change="channelChange"
                                name="channelCheckbox"
                                v-model:value="moduleForm.channel_ids"
                            />
                        </a-form-item>

                        <a-form-item :rules="[{ required: true, message: '请选择发送模块' }]" label="发送模块" name="app_id">
                            <a-select placeholder="请选择发送模块" style="width: 627px" v-model:value="moduleForm.module_id">
                                <template v-for="item in moduleOptions">
                                    <a-select-option :value="item.id">{{item.module_name}}</a-select-option>
                                </template>
                            </a-select>
                        </a-form-item>

                        <a-form-item label="发送条件" style="margin-bottom: 0;">
                            <a-form-item style="margin-bottom: 0;">
                                <div style="display: flex;justify-content: space-between;">
                                    <a-button @click="addModuleFields" type="primary">+ 发送条件</a-button>
                                    <a-form-item
                                        :label-col="{ span: 0 }"
                                        :wrapper-col="{ span: 10 }"
                                        label="条件关系"
                                        :name="['condition','join']"
                                    >
                                        <a-select
                                            placeholder="请选择条件关系"
                                            style="width: 108px"
                                            v-model:value="moduleForm.condition.join"
                                        >
                                            <template v-for="item in joinOptions">
                                                <a-select-option :value="item.value">{{item.label}}</a-select-option>
                                            </template>
                                        </a-select>
                                    </a-form-item>
                                </div>
                            </a-form-item>

                            <a-form-item>
                                <div style="display: flex;" v-for="(field, index) in moduleForm.condition.fields">
                                    <a-form-item>
                                        <a-select
                                            @select="fieldsOptionsChange($event,field)"
                                            placeholder="请选择"
                                            style="width: 127px"
                                            v-model:value="field.key"
                                        >
                                            <template v-for="item in ModuleFieldsOptions">
                                                <a-select-option :value="item.field">{{ item.name }}</a-select-option>
                                            </template>
                                        </a-select>
                                    </a-form-item>
                                    <a-form-item style="margin: 0 12px;">
                                        <a-select
                                            placeholder="请选择条件"
                                            style="width: 127px"
                                            v-model:value="field.condition"
                                        >
                                            <template v-for="item in conditionOptions">
                                                <a-select-option :value="item.value">{{item.label}}</a-select-option>
                                            </template>
                                        </a-select>
                                    </a-form-item>
                                    <a-form-item v-if="field.type === 'select'">
                                        <a-select placeholder="请选择值" style="width: 216px" v-model:value="field.value">
                                            <template v-for="item in field.options">
                                                <a-select-option :value="item.value">{{item.label}}</a-select-option>
                                            </template>
                                        </a-select>
                                    </a-form-item>
                                    <a-form-item v-else>
                                        <a-input placeholder="请输入值" style="width: 216px" v-model:value="field.value" />
                                    </a-form-item>
                                    <a-form-item>
                                        <span @click="delNowRow(index)" style="margin-left: 16px;cursor: pointer;">
                                            <i class="iconfont iconincrease_icon_cancel"></i>
                                        </span>
                                    </a-form-item>
                                </div>
                            </a-form-item>
                        </a-form-item>

                        <a-form-item label="附加字段" style="margin-bottom: 0;">
                            <a-form-item>
                                <a-button @click="addExtra" type="primary">+添加</a-button>
                            </a-form-item>
                            <a-form-item>
                                <div style="display: flex;" v-for="(ex, idx) in moduleForm.extra">
                                    <a-form-item :rules="[{ required: true, message: '请输入键（可设变量）' }]" :name="['extra',idx,'key']" >
                                        <a-input placeholder="键（可设变量）" style="width: 286px" v-model:value="ex.key" />
                                    </a-form-item>
                                    <a-form-item style="margin: 0 2px;">
                                        <span>:</span>
                                    </a-form-item>
                                    <a-form-item :rules="[{ required: true, message: '请输入值（可设变量）' }]" :name="['extra',idx,'value']">
                                        <a-input placeholder="值（可设变量）" style="width: 286px" v-model:value="ex.value" />
                                    </a-form-item>
                                    <a-form-item>
                                        <span @click="delexRow(index)" style="margin-left: 16px;cursor: pointer;">
                                            <i class="iconfont iconincrease_icon_cancel"></i>
                                        </span>
                                    </a-form-item>
                                </div>
                            </a-form-item>
                        </a-form-item>
                        <div class="chtitle">通道设置</div>
                        <a-tabs v-model:activeKey="activeKey">
                            <template :key="template.key" v-for="(template, tidx) in moduleForm.template">
                                <a-tab-pane :tab="template.label">
                                    <div style="margin-bottom: 20px;">{{fieldsTips}}</div>
                                    <template v-for="(item, index) in template.form">
                                        <a-form-item
                                            :label="item.label"
                                            :name="['template', tidx, 'form', index, 'value']"
                                            :rules="[{ required: item.require }]"
                                        >
                                            <a-input v-if="item.type === 'input' " v-model:value="item.value" />
                                            <a-textarea
                                                :auto-size="{ minRows: 8, maxRows: 12 }"
                                                placeholder="请输入"
                                                v-if="item.type === 'textarea'"
                                                v-model:value="item.value"
                                            />
                                            <a-radio-group
                                                :rules="[{ required: item.require }]"
                                                v-if="item.type === 'inputRadio' "
                                                v-model:value="item.value"
                                            >
                                                <a-radio :value="rad.value" v-for="rad in item.item">{{rad.label}}</a-radio>
                                            </a-radio-group>
                                            <a-checkbox-group
                                                :options="item.item"
                                                :rules="[{ required: item.require }]"
                                                v-if="item.type === 'checkbox' "
                                                v-model:value="item.value"
                                            />
                                        </a-form-item>
                                    </template>
                                </a-tab-pane>
                            </template>
                        </a-tabs>
                    </a-form>
                </div>
            </div>

            <template #footer>
                <div class="footer">
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
import {
    ModulesCauType,
    FieldType,
    ModuleListType,
} from "@/types/modulesManagement";
import { FormInstance, message } from "ant-design-vue";
import { AppType } from "@/types/projectManagement";
import { http } from "@/utils/http";
import {
    channelTemplateType,
    ModuleFieldsListType,
    TemplateDetailType,
    TemplateEditType,
} from "@/types/templateManagement";
import { joinOptions, conditionOptions } from "@/common/conditions";
import { JoinDataType } from "@/types/conditions";
import { cloneDeep } from "lodash";
import { useConfirm } from "@/hooks/useConfirm";

export default defineComponent({
    name: "TemplateEdit",
    props: {
        editType: {
            type: Number,
            default: EditType.CREATE,
        },
    },
    emits: ["muopsSuccess"],
    setup(props, context) {
        const editType: Ref<number> = ref(props.editType);
        const drawerVisibleEdit: Ref<boolean> = ref(false);
        const channel_ids: any = ref([]);
        const moduleForm: Ref<TemplateEditType> = ref({
            template_name: "",
            channel_ids: "",
            module_id: "",
            app_id: undefined,
            condition: {
                fields: [],
                join: "or",
            },
            extra: [],
            template: [],
        });
        const initModuleForm = () => {
            moduleForm.value = {
                template_name: "",
                channel_ids: "",
                module_id: "",
                app_id: undefined,
                condition: {
                    fields: [],
                    join: "or",
                },
                extra: [],
                template: [],
            };
        };
        watch(
            () => props.editType,
            (newValue, oldValue) => {
                editType.value = newValue;
            }
        );
        const fieldsTips: Ref<string> = ref("");
        const activeKey: Ref<number | string> = ref(0);
        const suid: Ref<number | string> = ref("");
        const moduleFormRef = ref<FormInstance>();
        const title = computed(() => {
            return ["详细信息", "创建模板", "编辑模板"][editType.value];
        });
        const appOption: Ref<Array<AppType>> = ref([]);
        const getAppOption = (id?: number | string) => {
            http.post("/api/app/list", {}).then((res) => {
                console.log(res);
                if (res) {
                    appOption.value = res.data.list;
                    // const defid = appOption.value[0]?.id;
                    // moduleForm.value.app_id = defid;
                    // if (!id) {
                    //     getChannelById(defid);
                    //     getModuleByAppId(defid);
                    // }
                }
            });
        };
        const detailData: any = ref({});
        const appOptionChange = async (
            e: string | number,
            notRef?: boolean
        ) => {
            console.log("appOptionChange");
            console.log(e);
            await getChannelById(e, notRef);
            await getModuleByAppId(e, false);
        };
        const extraReduction = (extra: {
            [key: string]: string | number;
        }): Array<{ key: string; value: string | number }> => {
            const temp = [];
            for (const keyword in extra) {
                if (Object.prototype.hasOwnProperty.call(extra, keyword)) {
                    const element = extra[keyword];
                    temp.push({
                        key: keyword,
                        value: element,
                    });
                }
            }
            return temp;
        };
        const getChannelItemFromDetail = (id: string | number, data: any) => {
            const item = detailData.value?.channel_config[id].template_content;
            for (const some of data) {
                some.value = item[some.name];
            }
        };
        const getChannelItemById2 = async (val: string | number) => {
            const channelData: { data: Array<any> } = await http.post(
                `/api/app/channel/${detailData.value.app_id}`,
                {}
            );
            return channelData.data.filter((item) => item.value === val)[0];
        };
        const templateReduction = async (ids: Array<string | number>) => {
            for (const some of ids) {
                const item = await getChannelItemById2(some);
                const tempConfig = await getChannelTemplate(some, suid.value);
                if (tempConfig?.data) {
                    moduleForm.value.template.push({
                        label: item.label,
                        key: item.key,
                        value: item.value,
                        form: tempConfig.data,
                    });
                }
            }
            activeKey.value = channelOptions.value[0].key;
        };
        const editSetForm = async (data: TemplateDetailType) => {
            console.log(data.condition.fields, "data.condition.fields");
            channel_ids.value = data.channel_ids
                .split(",")
                .map((item) => Number(item));
            moduleForm.value = {
                template_name: data.template_name,
                id: data.id,
                channel_ids: data.channel_ids
                    .split(",")
                    .map((item) => Number(item)),
                module_id: data.module_id,
                app_id: data.app_id,
                condition: {
                    fields: [],
                    join: data.condition.join,
                },
                extra: extraReduction(data.extra),
                template: [],
            };
            await appOptionChange(data.app_id, true);
            await templateReduction(
                data.channel_ids.split(",").map((item) => Number(item))
            );
            moduleForm.value.condition.fields = data.condition.fields;
            console.log(moduleForm.value);
            for (const some of moduleForm.value.condition.fields) {
                some.key = some.field;
            }
        };
        const getDetailById = (id: string | number) => {
            http.post(`/api/template/detail/${id}`, {}).then((res) => {
                console.log(res);
                if (res && res.data) {
                    detailData.value = res.data;
                    editSetForm(res.data);
                }
            });
        };
        const channelOptions: Ref<Array<JoinDataType>> = ref([]);
        const getChannelById = async (
            id: string | number,
            notRef?: boolean
        ) => {
            http.post(`/api/app/channel/${id}`, {}).then((res) => {
                console.log(res);
                if (res && res.data) {
                    channelOptions.value = res.data;
                    if (!notRef) {
                        moduleForm.value.template = [];
                    }
                }
            });
        };
        const channelTemplate: Ref<Array<channelTemplateType>> = ref([]);
        const getChannelTemplate = async (
            channelId: string | number,
            templateId: string | number
        ) => {
            return http.post(`/api/channel/template`, {
                channel_id: channelId,
                template_id: templateId,
            });
        };
        const moduleOptions: Ref<Array<ModuleListType>> = ref([]);
        const getModuleByAppId = (id: string | number, notRef?: boolean) => {
            http.post(`/api/module/list`, { app_id: id }).then((res) => {
                console.log(res);
                if (res && res.data) {
                    moduleOptions.value = res.data.list;
                    moduleForm.value.module_id = moduleOptions.value[0]?.id;
                    if (!notRef) {
                        conditionInit();
                        // setDefFields();
                    }
                    if (moduleOptions.value[0]) {
                        getFieldsOptionsByAppId(
                            moduleOptions.value[0]?.id,
                            notRef
                        );
                    } else {
                        message.error("所选应用未配置模块，请先配置模块！");
                    }
                }
            });
        };
        const setDefFields = () => {
            const first = ModuleFieldsOptions.value[0];
            if (!first) {
                message.error("请先选择应用！");
                return false;
            }
            moduleForm.value.condition.fields.push({
                key: first.field,
                value: first.value,
                type: first.type,
                options: first.options || [],
                condition: "==",
            });
        };
        const conditionInit = () => {
            moduleForm.value.condition = {
                fields: [],
                join: "or",
            };
        };
        const ModuleFieldsOptions: Ref<Array<ModuleFieldsListType>> = ref([]);
        const getFieldsOptionsByAppId = (
            id: string | number,
            notRef?: boolean
        ) => {
            http.post(`/api/module/fields/${id}`, {}).then((res) => {
                console.log(res);
                if (res && res.data) {
                    ModuleFieldsOptions.value = res.data;
                    fieldsTips.value = "可用字段：";
                    for (const tip of ModuleFieldsOptions.value) {
                        fieldsTips.value += `${tip.name}{${tip.field}}、`;
                    }
                }
            });
        };
        const showDrawerEdit = (id?: string | number): void => {
            initModuleForm();
            getAppOption(id);
            if (id) {
                suid.value = id;
                getDetailById(id);
            }
            console.log(editType);
            drawerVisibleEdit.value = true;
        };
        const filedData: Ref<Array<FieldType>> = ref([
            {
                field: "",
                name: "",
                value: "",
            },
        ]);
        const extraDisp = () => {
            const keyv: any = {};
            for (const kv of moduleForm.value.extra) {
                keyv[kv.key] = kv.value;
            }
            return keyv;
        };
        const fieldsDisp = () => {
            const keyv: any = {};
            for (const kv of moduleForm.value.condition.fields) {
                keyv[kv.key] = {
                    condition: kv.condition,
                    value: kv.value,
                };
            }
            return keyv;
        };
        const templateContentDisp = (
            form: Array<{ name: string; value: string | number }>
        ): {} => {
            const keyv: any = {};
            for (const kv of form) {
                keyv[kv.name] = kv.value;
            }
            return keyv;
        };
        const updateChannelTemplateReq = async (
            templateId: string | number
        ) => {
            const task = [];
            for (const temp of moduleForm.value.template) {
                const tempReq = {
                    channel_id: temp.value,
                    template_id: templateId,
                    template_content: templateContentDisp(temp.form),
                };
                task.push(http.post(`/api/channel/template/update`, tempReq));
            }
            Promise.all(task).then((res) => {
                console.log(res);
                if (res) {
                    opSucc();
                }
            });
        };
        const addOrEditReqDataDisp = () => {
            const params = moduleForm.value;
            const temp = {
                app_id: params.app_id,
                id: suid.value,
                template_name: params.template_name,
                module_id: params.module_id,
                channel_ids: params.channel_ids.toString(),
                condition: {
                    fields: fieldsDisp(),
                    join: params.condition.join,
                },
                extra: extraDisp(),
            };
            console.log(temp);
            return temp;
        };
        const addOrEditRunReq = () => {
            const params = addOrEditReqDataDisp();
            const url: string =
                editType.value === EditType.UPDATE
                    ? "/api/template/modify"
                    : "/api/template/create";
            http.post(url, params).then((res: any) => {
                console.log(res);
                if (res.errCode === 0) {
                    const id: string | number =
                        editType.value === EditType.UPDATE
                            ? suid.value
                            : res.data.id;
                    updateChannelTemplateReq(id);
                }
            });
        };
        const opSucc = () => {
            message.success("操作成功");
            context.emit("muopsSuccess", true);
            drawerVisibleEdit.value = false;
        };
        const checkConfigKeyValue = () => {
          console.log('checkConfigKeyValue');
          
          for (const con of moduleForm.value.template) { 
            for (const keyitem of con.form) {
              if((!keyitem.value || !keyitem.value.length) && keyitem.require) {
                activeKey.value = con.key
              }
            }
          }
        }
        const saveRun = () => {
            checkConfigKeyValue()
            moduleFormRef.value?.validateFields().then(() => {
              addOrEditRunReq();
            });
        };
         const onFinishFailed = (errorInfo: any) => {
          console.log('errorInfo',errorInfo);
          checkConfigKeyValue()
         };
        const delNowRow = (index: number) => {
            moduleForm.value.condition.fields.splice(index, 1);
        };
        const delexRow = (index: number) => {
            moduleForm.value.extra.splice(index, 1);
        };
        const addModuleFields = () => {
            setDefFields();
        };
        const addExtra = () => {
            moduleForm.value.extra.push({
                key: "",
                value: "",
            });
        };
        const onClose = () => {
            drawerVisibleEdit.value = false;
        };
        const getOrgFieldsItem = (value: string | number) => {
            const temp: any = {
                type: "input",
                options: [],
            };
            for (const some of ModuleFieldsOptions.value) {
                if (some.field === value) {
                    temp.type = some.type;
                    temp.options = some.options || [];
                }
            }
            return temp;
        };
        const fieldsOptionsChange = (
            e: string | number,
            filed: ModuleFieldsListType
        ) => {
            console.log(e);
            console.log(filed);
            const item = getOrgFieldsItem(e);
            filed.type = item.type;
            filed.options = item.options;
        };
        const getChannelItemById = async (val: string | number) => {
            return channelOptions.value.filter((item) => item.value === val)[0];
        };
        const clearNotExist = () => {
            const ids = moduleForm.value.channel_ids;
            moduleForm.value.template = moduleForm.value.template.filter(
                (item) => !ids.includes(item.value)
            );
        };
        const channelChangeRun = async (e: Array<string | number>) => {
            if (e.length) {
                clearNotExist();
                for (const some of e) {
                    const item = await getChannelItemById(some);
                    const templateId =
                        editType.value === EditType.CREATE ? 0 : suid.value;
                    const tempConfig = await getChannelTemplate(
                        some,
                        templateId
                    );
                    if (tempConfig?.data) {
                        moduleForm.value.template.push({
                            label: item.label,
                            key: item.key,
                            value: item.value,
                            form: tempConfig.data,
                        });
                        activeKey.value = item.key;
                    }
                }
            } else {
                moduleForm.value.template = [];
            }
        };
        const channelChange = async (e: Array<string | number>) => {
            if (
                moduleForm.value.channel_ids.length < channel_ids.value.length
            ) {
                useConfirm(
                    "确定取消该通道吗？",
                    "取消后，已填写数据无法恢复",
                    () => {
                        console.log("ok");
                        channelChangeRun(e);
                        channel_ids.value = cloneDeep(
                            moduleForm.value.channel_ids
                        );
                    },
                    () => {
                        moduleForm.value.channel_ids = cloneDeep(
                            channel_ids.value
                        );
                    }
                );
            } else {
                channelChangeRun(e);
                channel_ids.value = cloneDeep(moduleForm.value.channel_ids);
            }
        };
        return {
            EditType,
            editType,
            moduleForm,
            drawerVisibleEdit,
            title,
            filedData,
            moduleFormRef,
            appOption,
            channelOptions,
            moduleOptions,
            ModuleFieldsOptions,
            saveRun,
            onClose,
            showDrawerEdit,
            fieldsOptionsChange,
            joinOptions,
            conditionOptions,
            channelTemplate,
            delNowRow,
            delexRow,
            addExtra,
            addModuleFields,
            appOptionChange,
            channelChange,
            activeKey,
            fieldsTips,
            onFinishFailed,
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
        overflow-x: hidden;
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
.chtitle {
    font-size: 16px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
    font-weight: 700;
    text-align: left;
    color: rgba(2, 14, 26, 0.85);
}
</style>