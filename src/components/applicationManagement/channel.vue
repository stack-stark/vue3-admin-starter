<template>
    <div>
        <a-drawer
            :closable="false"
            :maskClosable="false"
            class="custom-chnnel"
            placement="right"
            title="配置通道"
            v-model:visible="drawerVisible"
            width="800px"
        >
            <div class="dwbox">
                <div class="appform">
                    <a-form
                        :label-col="{ span: 4 }"
                        :model="formApp"
                        :rules="rules"
                        :wrapper-col="{ span: 20 }"
                        autocomplete="off"
                        name="basicFormApp"
                        ref="basicFormAppRef"
                    >
                        <a-form-item label="应用名称" name="appname">
                            <a-input v-model:value="formApp.appname" />
                        </a-form-item>

                        <a-form-item label="发送通道" name="channelValue">
                            <a-checkbox-group
                                :options="formApp.channel"
                                name="channelCheckbox"
                                v-model:value="formApp.channelValue"
                                @change="checkboxClick"
                            />
                        </a-form-item>
                        <div class="conbox">
                            <div class="ptitle">通道设置</div>
                            <a-tabs v-model:activeKey="activeKey">
                                <template
                                    :key="channel.key"
                                    v-for="channel in formApp.channel.filter(item => formApp.channelValue.includes(item.value))"
                                >
                                    <a-tab-pane :tab="channel.label">
                                        <template v-for="(item, index) in formApp.config[activeKey]">
                                            <a-form-item
                                                :label="item.label"
                                                :name="['config', activeKey ,index, 'value']"
                                                :rules="[{ required: item.require, whitespace: true }]"
                                            >
                                                <a-input v-if="item.type === 'input' " :placeholder="'请输入' +item.label" v-model:value="item.value" />
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
                    <a-button @click="saveRun" class="save" type="primary">保存</a-button>
                </div>
            </template>
        </a-drawer>
    </div>
</template>

<script lang="ts">
import { FormInstance, message } from "ant-design-vue";
import { defineComponent, reactive, Ref, ref } from "vue";
import { channelType, FormAppType } from "@/types/applicationManagement";
import { http } from "@/utils/http";
import { Rule } from "ant-design-vue/es/form";

export default defineComponent({
    name: "channel",
    emits: ["channelUpdateSucc"],
    setup(props, context) {
        const drawerVisible: Ref<boolean> = ref(false);
        const formApp = reactive<FormAppType>({
            appname: "",
            channel: [],
            channelValue: [],
            config: {},
        });
        const formAppInit = () => {
            formApp.appname = "";
            formApp.channel = [];
            formApp.channelValue = [];
            formApp.config = {};
        };
        let validateChannelValue = async (_rule: Rule, value: string) => {
            if (!value || !value.length) {
                return Promise.reject("请选择发送通道！");
            } else {
                return Promise.resolve();
            }
        };
        const rules: Record<string, Rule[]> = {
            appname: [{ required: true, trigger: "change" }],
            channelValue: [
                {
                    required: true,
                    validator: validateChannelValue,
                    trigger: "change",
                },
            ],
        };
        const activeKey: Ref<string | number | undefined> = ref(0);
        const basicFormAppRef = ref<FormInstance>();
        const suid = ref<string | number>("");
        const onClose = () => {
            drawerVisible.value = false;
        };
        const getConfigByKey = async (
            channelId: string | number
        ): Promise<any> => {
            return await http.post("/api/channel/config", {
                app_id: suid.value,
                channel_id: channelId,
            });
        };
        const dispCid = (ids: string): Array<string | number> => {
            if (ids && ids.length) {
                return ids.split(',').map(item => Number(item));
            }
            return []
        };
        const setActiveKey = (id: string | number) => {
          activeKey.value = formApp.channel.find(item => item.value == id)?.key;
        }
        const getList = async (id: string | number): Promise<void> => {
            const detail: any = await http.post(`/api/app/detail/${id}`, {});
            const list: any = await http.post("/api/channel/list", {});
            formApp.channelValue = dispCid(detail.data.channel_ids);
            formApp.appname = detail.data.app_name;
            for (const pro of list.data) {
                const temp = await getConfigByKey(pro.value);
                formApp.config[pro.key] = temp.data;
            }
            formApp.channel = list.data;
            setActiveKey(formApp.channelValue[0])
            console.log(formApp);
        };
        const onShow = (id: string | number) => {
            suid.value = id;
            formAppInit();
            getList(id);
            drawerVisible.value = true;
        };
        const saveChannelReq = async (channelId: string | number, config: {}) => {
          const tempParams = {
            channel_id:	channelId,	
            app_id: suid.value,
            config: config
          };
          await http.post("/api/channel/config/update", tempParams)
        };
        const disConfigKeyValue = (item: Array<any>): {} => {
          const temp: any = {}
          for (const keyitem of item) {
             temp[keyitem.name] = keyitem.value;
          }
          return temp
        }
        const checkConfigKeyValue = (): {} => {
          for (const con of formApp.channel) { 
            if(formApp.channelValue.includes(con.value)) { 
              for (const keyitem of formApp.config[con.key]) {
              if((!keyitem.value || !keyitem.value.length) && keyitem.require) {
                activeKey.value = con.key
                return false
              }
              }
            }
          }
          return true
        }
        const saveChannelRun = () => {
          const temp = []
          for (const con of formApp.channel) {
            if(formApp.channelValue.includes(con.value)) {
              const configData = disConfigKeyValue(formApp.config[con.key]);
              temp.push({
                channel_id:	con.value,
                config: configData
              })
            }
          }
          return temp
        }
        const basicReq = async () => {
            const params = {
              app_name: formApp.appname,
              id: suid.value,
              channel_ids: formApp.channelValue.toString(),
              channels: saveChannelRun()
            };
            const res:any = await http.post("/api/app/modify", params);
            if (res.errCode === 0) {
              // await saveChannelRun();
              message.success('更新成功！');
              context.emit('channelUpdateSucc', true);
              drawerVisible.value = false;
            }
        };
        const saveRun = () => {
            basicFormAppRef.value?.validateFields().then(() => {
              if(!checkConfigKeyValue()) {
                return false
              }
                basicReq();
            });
        };
        const checkboxClick = (e: any) => {
          console.log(e);
          
          setActiveKey(e[0])
        }
        return {
            drawerVisible,
            basicFormAppRef,
            formApp,
            activeKey,
            onShow,
            onClose,
            saveRun,
            rules,
            checkboxClick,
        };
    },
});
</script>

<style lang="less" scoped>
.custom-chnnel {
    .dwbox {
        background: #ffffff;
        overflow-y: auto;
    }
    .footer {
        display: flex;
        justify-content: flex-end;
        .save {
        }
    }
    .conbox {
        padding: 8px;
        .ptitle {
            font-size: 16px;
            font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
            font-weight: 700;
            text-align: left;
            color: rgba(2, 14, 26, 0.85);
        }
    }
}
</style>