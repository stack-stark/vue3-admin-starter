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
                     <a-form-item :rules="[{ required: true, message: '请选择项目' }]" label="项目" name="platform_id">
                            <a-select
                                placeholder="请选择项目"
                                style="width: 627px"
                                v-model:value="sendForm.platform_id"
                                @change="platformChange"
                            >
                                <template v-for="item in platformOption">
                                    <a-select-option :value="item.id">{{item.platform_name}}</a-select-option>
                                </template>
                            </a-select>
                        </a-form-item>
                      
                        <a-form-item :rules="[{ required: true }]" label="应用名称" name="app_id">
                            <a-select
                                @change="appOptionChange"
                                placeholder="请选择应用名称"
                                style="width: 627px"
                                v-model:value="sendForm.app_id"
                            >
                                <template v-for="item in appOption">
                                    <a-select-option :value="item.id">{{item.app_name}}</a-select-option>
                                </template>
                            </a-select>
                        </a-form-item>
                        <a-form-item :rules="[{ required: true }]" label="发送通道" name="channel_ids">
                            <a-checkbox-group
                                @change="channelChange"
                                :options="channelOptions"
                                name="channelCheckbox"
                                v-model:value="sendForm.channel_ids"
                            />
                        </a-form-item>
                       
                        <a-form-item :rules="[{ required: true }]" label="发送时间" name="atType">
                            <a-radio-group v-model:value="sendForm.atType">
                                <a-radio value="1">立即</a-radio>
                                <a-radio value="2">定时</a-radio>
                            </a-radio-group>
                            <a-form-item
                                :rules="[{ required: true }]"
                                name="at"
                                style="margin-top: 10px;margin-bottom: 0px;"
                                v-if="sendForm.atType == 2"
                            >
                                <a-date-picker placeholder="请选择时间" show-time v-model:value="sendForm.at" />
                            </a-form-item>
                        </a-form-item>
                        <a-form-item :rules="[{ required: true }]" label="目标用户角色" name="role">
                            <a-radio-group v-model:value="sendForm.role" @change="clrearUser">
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
                                    :options="userDataOptions"
                                    @search="fetchUser"
                                    label-in-value
                                    mode="multiple"
                                    placeholder="搜索账号/昵称"
                                    style="width: 100%"
                                    v-model:value="sendForm.user_ids"
                                >
                                <template #option="{ value: val, label, account }">
                                    {{ label }}&nbsp;&nbsp;<span>账号:</span> {{ account }}
                                  </template>

                                  <template #tagRender="{ value: val, label, account, closable, onClose, option }">
                                        <a-tag :closable="closable" style="margin-right: 3px" @close="onClose">
                                          {{ label }}
                                        </a-tag>
                                      </template>
                                </a-select>
                            </a-form-item>
                        </a-form-item>

                        <a-form-item label="附加字段" style="margin-bottom: 0;">
                            <a-form-item>
                                <a-button @click="addExtra" type="primary">+添加</a-button>
                            </a-form-item>
                            <a-form-item>
                                <div style="display: flex;" v-for="(ex, idx) in sendForm.extra">
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

                        <div class="tipc" v-if="!sendForm.channel_ids || !sendForm.channel_ids.length">
                          请选择你要发送消息的通道
                        </div>

                        <!-- <div v-if="sendForm.module_fields.length" class="module_fields">变量传值</div> -->
                        <!-- <a-form-item
                            :label="field.name"
                            :name="['module_fields', index, 'value']"
                            :rules="[{ required: true }]"
                            v-for="(field, index) in sendForm.module_fields"
                        >
                            <a-select
                                placeholder="请选择值"
                                v-if="field.type === 'select'"
                                v-model:value="field.value"
                            >
                                <template v-for="item in field.options">
                                    <a-select-option :value="item.value">{{item.label}}</a-select-option>
                                </template>
                            </a-select>
                            <a-input placeholder="请输入值"  v-else v-model:value="field.value" />
                        </a-form-item> -->

                            <div class="showChan">
                        <a-tabs v-model:activeKey="activeKey">
                           <template :key="template.key" v-for="(template, tidx) in sendForm.template">
                                <a-tab-pane :tab="template.label">
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
                    </div>

                    </a-form>
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
import { ModulesCauType } from "@/types/modulesManagement";
import { useConfirm } from "@/hooks/useConfirm";

export default defineComponent({
    name: "SendMessageSuper",
    emits: ["sendSuccess"],
    setup(props, context) {
        const sendVisible: Ref<boolean> = ref(false);
        const sendForm: Ref<SendCauType> = ref({
            template_name: "",
            module_key: "",
            app_id: "",
            app_name: "",
            at: 0,
            atType: "1",
            role: 2,
            user_ids: [],
            is_all: 0,
            platform_id: '',
            channel_ids: [],
            template: [],
            extra: [],
            module_fields: [],
        });
        const channel_ids: any = ref([]);
        const suid: Ref<number | string> = ref("");
        const sendFormRef = ref<FormInstance>();
        const activeKey: Ref<number | string> = ref(0);
        const appOption: Ref<Array<AppType>> = ref([]);
        const getAppOption = () => {
            http.post(`/api/app/list/simple/${sendForm.value.platform_id}`, {}).then((res) => {
                console.log(res);
                if (res) {
                    sendForm.value.app_id = ''
                    appOption.value = []
                    appOption.value = res.data;
                    console.log(appOption.value);
                    sendForm.value.app_id = appOption.value[0]?.id
                    getChannelById(appOption.value[0]?.id)
                    // getFieldsOptionsByAppId(appOption.value[0]?.id);
                }
            });
        };
        const platformOption: Ref<Array<ModulesCauType>> = ref([]);
        const getPlatformOption = () => {
            http.post("/api/platform/list/simple", {}).then((res) => {
                if (res) {
                    platformOption.value = res.data;
                    console.log(platformOption.value);
                    sendForm.value.platform_id = platformOption.value[0].id
                    getAppOption();
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
                    setFields(res.data.condition.fields);
                }
            });
        };
         const channelOptions: Ref<Array<JoinDataType>> = ref([]);
        const getChannelById = async (id: string | number) => {
            sendForm.value.channel_ids = []
            sendForm.value.template = []
            sendForm.value.channel_ids = []
            channelOptions.value = []
            if(!id) {
              return false;
            }
            http.post(`/api/app/channel/${id}`, {}).then((res) => {
                console.log(res);
                if (res && res.data) {
                    channelOptions.value = res.data;
                }
            });
        };
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
        geRoleRadio();
        const userDataOptions: Ref<Array<userType>> = ref([]);
        const fetchUser = debounce((value) => {
            http.post(`api/user/list/${sendForm.value.role}`, {
                keyword: value,
            }).then((res) => {
                if (res.data) {
                    const data = res.data.list.map(
                        (user: { nickname: any; id: any, account: string }) => ({
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
          sendForm.value.module_fields = []
          if(!id) {
            return false;
          }
           http.post(`/api/module/fields/${id}`, {}).then((res) => {
                console.log(res);
                if (res && res.data.length) {
                    for (const item of res.data) {
                        sendForm.value.module_fields.push({
                            field: item.field,
                            value: undefined,
                            type: item.type,
                            name:  `${item.name}(${item.field})`,
                            options: item.options || [],
                        });
                    }
                }
            });
        };
        const showSendDrawer = (id: string | number): void => {
          sendFormRef.value?.resetFields();
          fetchUser(undefined);
          getPlatformOption();
          sendVisible.value = true;
        };
        const extraDisp = (fields: Array<any>) => {
          const keyv:any = {}
          for (const kv of fields) {
            keyv[kv.key] = kv.value
          }
          return keyv
        };
        const useridDisp = (userList: Array<{label: string, value: number }>):string => {
          const temp = []
          for (const user of userList) {
            temp.push(user.value)
          }
          return temp.toString();
        }
            const templateContentDisp = (
            form: Array<{ name: string; value: string | number }>
        ): {} => {
            const keyv: any = {};
            for (const kv of form) {
                keyv[kv.name] = kv.value;
            }
            return keyv;
        };
        const disptemplateContentRun = (data: SendCauType): Array<any> => {
           const task = [];
            for (const temp of data.template) {
                const tempReq = {
                    channel_id: temp.value,
                    template_id: 0,
                    template_content: templateContentDisp(temp.form),
                };
                task.push(tempReq)
            }
            return task
        }
   
        const postParams = (data: SendCauType) => {
          data.at = data.atType === '2' ? data.at.format('YYYY-MM-DD HH:mm:ss')  : 0
          data.user_ids = useridDisp(data.user_ids as Array<{label: string, value: number }>);
          data.extra = extraDisp(data.extra);
          data.channel = disptemplateContentRun(data)
          return data;
        }
        const addOrEditRunReq = () => {
            const params = postParams(cloneDeep(sendForm.value));
            http.post(`/api/message/push/0`, params).then((res) => {
                if (res) {
                    message.success("操作成功");
                    context.emit("sendSuccess", true);
                    sendVisible.value = false;
                }
            });
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
        const platformChange = async (
            e: string | number,
        ) => {
            getAppOption()
        };
        const appOptionChange = async (
            e: string | number,
        ) => {
            await getChannelById(e);
            // await getFieldsOptionsByAppId(e);
        };
         const getChannelItemById = async (val: string | number) => {
            return channelOptions.value.filter((item) => item.value === val)[0];
        };
        const clearNotExist = (ids: Array<string | number>) => {
            const res = sendForm.value.template.filter(
                (item) => ids.includes(item.value)
            );
            console.log(res);
            sendForm.value.template = res;
            console.log(sendForm.value.template);
        };
        const checkisExist = (id: string | number): boolean => {
          const res = sendForm.value.template.filter(
                (item) => item.value === id
          );
          return res.length > 0
        }
         const templateReduction = async (ids: Array<string | number>) => {
          clearNotExist(ids)
            for (const some of ids) {
              const item = await getChannelItemById(some);
              if(!checkisExist(some)) {
                const tempConfig = await getChannelTemplate(some, 0);
                if (tempConfig?.data) {
                    sendForm.value.template.push({
                        label: item.label,
                        key: item.key,
                        value: item.value,
                        form: tempConfig.data,
                    });
                }
              }
              activeKey.value = item.key;
            }
        };
         const channelChange = async (seid: Array<string | number>) => {
            if (
                sendForm.value.channel_ids!.length < channel_ids.value.length
            ) {
                useConfirm(
                    "确定取消该通道吗？",
                    "取消后，已填写数据无法恢复",
                    () => {
                        console.log("ok");
                        templateReduction(seid);
                        channel_ids.value = cloneDeep(seid);
                    },
                    () => {
                        sendForm.value.channel_ids = cloneDeep(
                            channel_ids.value
                        );
                        sendFormRef?.value?.clearValidate();
                    }
                );
            } else {
                templateReduction(seid);
                channel_ids.value = cloneDeep(sendForm.value.channel_ids);
            }
            // console.log(seid);
            // if (!seid.length) { 
            //   sendForm.value.template = [];
            // } else {
            //   templateReduction(seid);            
            // }
        };
        const clrearUser = () => {
          userDataOptions.value = []
          sendForm.value.user_ids = []
          fetchUser(undefined);
        };
        const addExtra = () => {
            sendForm.value.extra.push({
                key: "",
                value: "",
            });
        };
          const delexRow = (index: number) => {
            sendForm.value.extra.splice(index, 1);
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
            platformOption,
            channelOptions,
            appOptionChange,
            channelChange,
            clrearUser,
            platformChange,
            addExtra,
            delexRow,
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
.module_fields{
  font-size: 14px;
  font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
  font-weight: 700;
  text-align: left;
  color: rgba(2,14,26,0.85);
}
.tipc{
  width: 628px;
  height: 32px;
  background: #fffae0;
  border-radius: 4px;
  font-size: 14px;
  font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
  font-weight: 400;
  text-align: left;
  color: #f49a24;
  padding: 5px 12px;
  margin-left: 122px;
}
</style>