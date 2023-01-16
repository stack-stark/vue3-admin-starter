<template>
    <div>
        <a-drawer
            :closable="false"
            class="custom-view"
            placement="right"
            title="消息详情"
            v-model:visible="drawerVisible"
            width="800px"
        >
            <div class="dwbox">
               <div class="info-box">
                    <div class="viewm">
                        <div class="view-title">消息ID：</div>
                        <div class="view-con">{{templateViewData.id}}</div>
                    </div>
                      <div class="viewm">
                        <div class="view-title">消息标题：</div>
                        <div class="view-con">{{templateViewData.title}}</div>
                    </div>
                      <div class="viewm">
                        <div class="view-title">项目：</div>
                        <div class="view-con">{{templateViewData?.platform?.platform_name}}</div>
                    </div>
                    <div class="viewm">
                        <div class="view-title">应用：</div>
                        <div class="view-con">{{templateViewData.app?.app_name}}</div>
                    </div>
                      <div class="viewm">
                        <div class="view-title">发送通道：</div>
                        <div class="view-con">{{templateViewData.channel_name}}</div>
                    </div>
                      <div class="viewm">
                        <div class="view-title">发送模块：</div>
                        <div class="view-con">{{templateViewData.module?.module_name || '--'}}</div>
                    </div>
                     <div class="viewm">
                        <div class="view-title">发送模板：</div>
                        <div class="view-con">{{templateViewData.template?.template_name || '--'}}</div>
                    </div>
                     <div class="viewm">
                        <div class="view-title">目标用户：</div>
                        <div class="view-con">{{templateViewData.user_name || '--'}}</div>
                    </div>
                      <div class="viewm">
                        <div class="view-title">发送时间：</div>
                        <div class="view-con">
                         {{templateViewData.updated_at}}
                        </div>
                    </div>
                    <div class="viewm">
                        <div class="view-title">附加字段： </div>
                        <div class="view-con">
                            <div v-for="item in exArray">{{item.keyString + ':'}}  {{item.value}}</div>
                        </div>
                    </div>
                </div>
                <div class="info-box unfi">
                    <div class="viewm" v-for="chs in templateViewData.channel_template">
                        <div class="view-title">{{chs.label}}:</div>
                        <div class="view-con">{{chs.value}}</div>
                    </div>
                </div>
            </div>
        </a-drawer>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from "vue";
import { EditType } from "@/common/editType";
import { ModuleFieldsListType, TemplateDetailType } from "@/types/templateManagement";
import { http } from "@/utils/http";
import { conditionOptions } from "@/common/conditions";

export default defineComponent({
    name: "MessageDetail",
    setup() {
        const drawerVisible: Ref<boolean> = ref(false);
        const templateViewData: Ref<TemplateDetailType | any> = ref({});
        const getDetailById = (id: string | number) => {
            http.post(`/api/message/detail/${id}`, {}).then((res) => {
                console.log(res);
                if (res && res.data) {
                    templateViewData.value = res.data;
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
        const showDrawer = (id: string | number): void => {
            getDetailById(id);
            drawerVisible.value = true;
        };
        const getChannelTemplate = async (channelId: string | number, templateId: string | number) => {
          return http.post(`/api/channel/template`, { channel_id: channelId, template_id: templateId })
        }
        const channels: Ref<Array<{bigTitle: string, form: Array<any>}>> = ref([])
        const channelsString: Ref<string> = ref('');
        const channelChange = async (suid: string | number) => {
            const config = templateViewData.value.channel_config
            channels.value = []
            const nameTemp = []
            for (const key in config) {
              if (Object.prototype.hasOwnProperty.call(config, key)) {
                const element = config[key];
                const tempConfig = await getChannelTemplate(key, suid)
                channels.value.push({
                  bigTitle: element.name,
                  form: tempConfig.data
                })
                nameTemp.push(element.name)
              }
              channelsString.value = nameTemp.toString()
            }
        }
        const fields: Ref<Array<ModuleFieldsListType>> = ref([]);
        const getConditionLabel = (code: string): string => {
          return conditionOptions.filter(item => item.value === code)[0].label
        }
         const getopValue = (code: string | number | undefined, options: Array<{label: string, value: string}> | undefined): string => {
          return options!.filter(item => item.value === code)[0].label
        }
        const setFields = (data: Array<any>) => {
          fields.value = data
          for (const fe of fields.value) {
            fe.condition = getConditionLabel(fe.condition)
            if(fe.type === 'select') {
              fe.value = getopValue(fe.value, fe.options)
            }
          }
        }
        const onClose = () => {
            drawerVisible.value = false;
        };
        return {
            EditType,
            drawerVisible,
            templateViewData,
            channelsString,
            fields,
            onClose,
            showDrawer,
            channels,
            exArray,
        };
    },
});
</script>

<style lang="less" scoped>
.custom-view {
    .dwbox {
        background: #ffffff;
        overflow-y: auto;
        height: 100%;
    }
    .unfi{
      border-top: 1px solid #e1e1e1;
      padding-top: 20px;
    }
    .info-box{
      
      .title{
        font-size: 16px;
        font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
        font-weight: 700;
        text-align: left;
        color: rgba(2,14,26,0.85);
        margin-bottom: 16px;
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
    }
}
</style>