<template>
    <div>
        <a-drawer
            :closable="false"
            :maskClosable="false"
            class="custom-chnnel"
            placement="right"
            title="发送消息"
            v-model:visible="sendVisible"
            width="800px"
        >
            <div class="dwbox">
                <div class="appform">
                    <a-form
                        :label-col="{ span: 4 }"
                        :model="sendForm"
                        :wrapper-col="{ span: 20 }"
                        autocomplete="off"
                        ref="sendFormRef"
                    >
                        <a-form-item :rules="[{ required: true }]" label="模板名称" name="template_name">
                            <a-input disabled placeholder="请输入模板名称" v-model:value="sendForm.template_name" />
                        </a-form-item>
                        <a-form-item :rules="[{ required: true }]" label="应用名称" name="app_id">
                            <a-select
                                disabled
                                placeholder="请选择应用名称"
                                style="width: 627px"
                                v-model:value="sendForm.app_id"
                            >
                                <template v-for="item in appOption">
                                    <a-select-option :value="item.id">{{item.app_name}}</a-select-option>
                                </template>
                            </a-select>
                        </a-form-item>
                        <!-- <a-form-item label="发送通道" required>{{channelsString}}</a-form-item> -->
                       
                        <a-form-item :rules="[{ required: true }]" label="发送时间" name="atType">
                            <a-radio-group v-model:value="sendForm.atType">
                                <a-radio value="1">立即</a-radio>
                                <a-radio value="2">定时</a-radio>
                            </a-radio-group>
                            <a-form-item
                                :rules="[{ required: true, message: '请选择时间' }]"
                                name="at"
                                style="margin-top: 10px;margin-bottom: 0px;"
                                v-if="sendForm.atType == 2"
                            >
                                <a-date-picker placeholder="请选择时间" show-time v-model:value="sendForm.at" />
                            </a-form-item>
                        </a-form-item>
                        <a-form-item :rules="[{ required: true }]" label="目标用户角色" name="role">
                            <a-radio-group @change="clrearUser" v-model:value="sendForm.role">
                                <a-radio :value="ro.value" v-for="ro in roleRadio">{{ro.label}}</a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item :rules="[{ required: true }]" label="目标用户" name="role">
                            <a-radio-group v-model:value="sendForm.is_all">
                                <a-radio :value="0">指定用户</a-radio>
                                <a-radio :value="1">全部用户</a-radio>
                            </a-radio-group>
                            <a-form-item
                                :rules="[{ required: true, message: '搜索账号/昵称' }]"
                                name="user_ids"
                                style="margin-top: 10px;margin-bottom: 0px;"
                                v-if="sendForm.is_all == 0"
                            >
                                <a-select
                                    :filter-option="false"
                                    :not-found-content="fetching ? undefined : null"
                                    :options="userDataOptions"
                                    @search="fetchUser"
                                    label-in-value
                                    mode="multiple"
                                    placeholder="搜索账号/昵称"
                                    style="width: 100%"
                                    v-model:value="sendForm.user_ids"
                                >
                                    <template #option="{ value: val, label, account }">
                                        {{ label }}&nbsp;&nbsp;
                                        <span>账号:</span>
                                        {{ account }}
                                    </template>

                                    <template #tagRender="{ value: val, label, account, closable, onClose, option }">
                                        <a-tag
                                            :closable="closable"
                                            @close="onClose"
                                            style="margin-right: 3px"
                                        >{{ label }}</a-tag>
                                    </template>
                                </a-select>
                            </a-form-item>
                        </a-form-item>
                         <a-form-item label="附加字段">
                            <div v-for="item in exArray">{{item.keyString + ':'}}  {{item.value}}</div>
                        </a-form-item>

                        <div class="module_fields" v-if="sendForm.module_fields.length">变量传值</div>
                        <a-form-item
                            :label="field.name"
                            :name="['module_fields', index, 'value']"
                            :rules="[{ required: true }]"
                            v-for="(field, index) in sendForm.module_fields"
                        >
                            <a-select placeholder="请选择值" v-if="field.type === 'select'" v-model:value="field.value">
                                <template v-for="item in field.options">
                                    <a-select-option :value="item.value">{{item.label}}</a-select-option>
                                </template>
                            </a-select>
                            <a-input placeholder="请输入值" v-else v-model:value="field.value" />
                        </a-form-item>
                    </a-form>

                    <div class="showChan">
                        <a-tabs v-model:activeKey="activeKey">
                            <a-tab-pane :key="idx" :tab="channel.bigTitle" v-for="(channel, idx) in channels">
                                <div class="viewm" v-for="sm in channel.form">
                                    <div class="view-title">{{sm.label}}:</div>
                                    <div class="view-con">{{sm.value}}</div>
                                </div>
                            </a-tab-pane>
                        </a-tabs>
                    </div>
                </div>
            </div>

            <template #footer>
                <div class="footer">
                    <a-button @click="onClose" style="margin-right: 8px">取消</a-button>
                    <a-button @click="saveRun" class="save" type="primary">确定并发送</a-button>
                </div>
            </template>
        </a-drawer>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref, watch } from "vue";
import { FormInstance, message } from "ant-design-vue";
import { AppType } from "@/types/projectManagement";
import { http } from "@/utils/http";
import {
    ModuleFieldsListType,
    SendCauType,
    TemplateDetailType,
    userType,
} from "@/types/templateManagement";
import { conditionOptions } from "@/common/conditions";
import { JoinDataType } from "@/types/conditions";
import { debounce, cloneDeep } from "lodash";

export default defineComponent({
    name: "ModulesSendMessage",
    emits: ["sendSuccess"],
    setup(props, context) {
        const sendVisible: Ref<boolean> = ref(false);
        const sendForm: Ref<SendCauType> = ref({
            template_name: "",
            module_key: "",
            app_id: "",
            app_name: "",
            at: null,
            atType: "1",
            role: 2,
            user_ids: [],
            template: [],
            is_all: 0,
            module_fields: [],
        });
        const suid: Ref<number | string> = ref("");
        const sendFormRef = ref<FormInstance>();
        const activeKey = ref(0);
        const appOption: Ref<Array<AppType>> = ref([]);
        const getAppOption = () => {
            http.post("/api/app/list", {}).then((res) => {
                console.log(res);
                if (res) {
                    appOption.value = res.data.list;
                }
            });
        };
        const templateViewData: Ref<TemplateDetailType | any> = ref({});
        const getDetailById = (id: string | number) => {
            http.post(`/api/template/detail/${id}`, {}).then((res) => {
                console.log(res);
                if (res && res.data) {
                    templateViewData.value = res.data;
                    sendForm.value.template_name = res.data.template_name;
                    sendForm.value.app_name = res.data.app.app_name;
                    sendForm.value.app_id = res.data.app_id;
                    channelChange(id);
                    getFieldsOptionsByAppId(res.data.module_id);
                    exArrayDisp();
                }
            });
        };
           const exArray: Ref<Array<any>> = ref([]);
        const exArrayDisp = () => {
                    exArray.value=[];
                    for(const key in templateViewData.value.extra) {
                        if(Object.prototype.hasOwnProperty.call(
                            templateViewData.value.extra,
                            key
                        )) {
                            const element = templateViewData.value.extra[key];
                            exArray.value.push({
                                keyString: key,
                                value: element,
                            });
                        }
                    }
                }
        const getChannelTemplate = async (
            channelId: string | number,
            templateId: string | number
        ) => {
            return http.post(`/api/channel/template`, {
                channel_id: channelId,
                template_id: templateId,
            });
        };
        const channels: Ref<Array<{ bigTitle: string; form: Array<any> }>> =
            ref([]);
        const channelsString: Ref<string> = ref("");
        const channelChange = async (suid: string | number) => {
            const config = templateViewData.value.channel_config;
            channels.value = [];
            const nameTemp = [];
            for (const key in config) {
                if (Object.prototype.hasOwnProperty.call(config, key)) {
                    const element = config[key];
                    const tempConfig = await getChannelTemplate(key, suid);
                    channels.value.push({
                        bigTitle: element.name,
                        form: tempConfig.data,
                    });
                    nameTemp.push(element.name);
                }
                channelsString.value = nameTemp.toString();
            }
        };
        const fields: Ref<Array<ModuleFieldsListType>> = ref([]);
        const getConditionLabel = (code: string): string => {
            return conditionOptions.filter((item) => item.value === code)[0]
                .label;
        };
        const getopValue = (
            code: string | number | undefined,
            options: Array<{ label: string; value: string }> | undefined
        ): string => {
            return options!.filter((item) => item.value === code)[0].label;
        };
        const setFields = (data: Array<any>) => {
            fields.value = data;
            for (const fe of fields.value) {
                fe.condition = getConditionLabel(fe.condition);
                if (fe.type === "select") {
                    fe.value = getopValue(fe.value, fe.options);
                }
            }
        };
        const roleRadio: Ref<Array<JoinDataType>> = ref([]);
        const geRoleRadio = () => {
            http.post("/api/user/types", {}).then((res) => {
                if (res) {
                    roleRadio.value = res.data;
                }
            });
        };
        const userDataOptions: Ref<Array<userType>> = ref([]);
        const fetchUser = debounce((value) => {
            http.post(`api/user/list/${sendForm.value.role}`, {
                keyword: value,
            }).then((res) => {
                if (res.data) {
                    const data = res.data.list.map(
                        (user: {
                            nickname: any;
                            id: any;
                            account: string;
                        }) => ({
                            label: user.nickname,
                            account: user.account,
                            value: user.id,
                        })
                    );
                    userDataOptions.value = data;
                }
            });
        });
        const getFieldsOptionsByAppId = (id: string | number) => {
            http.post(`/api/module/fields/${id}`, {}).then((res) => {
                console.log(res);
                sendForm.value.module_fields = [];
                if (res && res.data) {
                    for (const item of res.data) {
                        sendForm.value.module_fields.push({
                            field: item.field,
                            value: undefined,
                            type: item.type,
                            name: `${item.name}(${item.field})`,
                            options: item.options || [],
                        });
                    }
                }
            });
        };
        const showSendDrawer = (id: string | number): void => {
            sendFormRef.value?.resetFields();
            getAppOption();
            geRoleRadio();
            fetchUser(undefined);
            suid.value = id;
            getDetailById(id);
            sendVisible.value = true;
        };
        const extraDisp = (fields: Array<any>) => {
            const keyv: any = {};
            for (const kv of fields) {
                keyv[kv.field] = kv.value;
            }
            return keyv;
        };
        const useridDisp = (
            userList: Array<{ label: string; value: number }>
        ): string => {
            const temp = [];
            for (const user of userList) {
                temp.push(user.value);
            }
            return temp.toString();
        };
        const postParams = (data: SendCauType) => {
            data.at =
                data.atType === "2" ? data.at.format("YYYY-MM-DD HH:mm:ss") : 0;
            data.user_ids = useridDisp(
                data.user_ids as Array<{ label: string; value: number }>
            );
            data.extra = extraDisp(data.module_fields);
            return data;
        };
        const addOrEditRunReq = () => {
            const params = postParams(cloneDeep(sendForm.value));
            http.post(`/api/message/push/${suid.value}`, params).then(
                (res: any) => {
                    if (res.errCode === 0) {
                        message.success("操作成功");
                        context.emit("sendSuccess", true);
                        sendVisible.value = false;
                    }
                }
            );
        };
        const saveRun = () => {
            sendFormRef.value?.validateFields().then(() => {
                addOrEditRunReq();
            });
        };
        const delNowRow = (index: number) => {
            sendForm.value.module_fields.splice(index, 1);
        };
        const addModuleFields = () => {
            sendForm.value.module_fields.push({
                field: "",
                name: "",
                value: "",
            });
        };
        const onClose = () => {
            sendVisible.value = false;
        };
        const clrearUser = () => {
            userDataOptions.value = [];
            sendForm.value.user_ids = [];
            fetchUser(undefined);
        };
        return {
            sendForm,
            sendVisible,
            sendFormRef,
            appOption,
            templateViewData,
            channels,
            channelsString,
            fields,
            roleRadio,
            fetchUser,
            userDataOptions,
            activeKey,
            saveRun,
            onClose,
            showSendDrawer,
            delNowRow,
            addModuleFields,
            clrearUser,
            exArray,
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
            width: 626px;
            margin-left: 10px;
            font-size: 14px;
            font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: rgba(2, 14, 26, 0.65);
        }
    }
}
.viewm {
    display: flex;
    margin-bottom: 12px;
    .view-title {
        font-size: 14px;
        font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
        font-weight: 400;
        text-align: left;
        color: rgba(2, 14, 26, 0.45);
    }
    .view-con {
        width: 650px;
        margin-left: 10px;
        font-size: 14px;
        font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
        font-weight: 400;
        text-align: left;
        color: rgba(2, 14, 26, 0.65);
    }
}
.module_fields {
    font-size: 14px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
    font-weight: 700;
    text-align: left;
    color: rgba(2, 14, 26, 0.85);
}
</style>