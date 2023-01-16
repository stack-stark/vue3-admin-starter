<template>
    <div>
        <a-modal @ok="associatedHandleOk" wrapClassName="associatedSty"  title="关联项目" v-model:visible="associatedVisible" width="720px">
            <div class="assbox">
                <div class="name">
                    应用名称：
                    <span class="c">{{appname}}</span>
                </div>
                <div class="prolist">
                    <div class="app">
                        <div class="title">可关联项目</div>
                        <div class="content">
                            <div :key="item.id" class="list" v-for="item in projectList">
                                <a-checkbox
                                    @change="projectChange($event, item)"
                                    v-model:checked="item.checked"
                                >
                                  <span :title="item.platform_name">{{item.platform_name}}</span>
                                </a-checkbox>
                            </div>
                        </div>
                    </div>
                    <div class="app" style="margin-left: 24px">
                        <div class="title">已关联项目</div>
                        <div class="content">
                            <div class="tags">
                                <div :key="tag.id" class="tag" v-for="tag in projectTags">
                                    <div class="item">{{tag.platform_name}}</div>
                                    <div @click="projectTagClose(tag.id)">
                                        <i class="iconfont iconpopup_icon_close"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a-modal>
    </div>
</template>

<script lang="ts">
import { ProjectTagType } from "@/types/applicationManagement";
import { CheckboxEvent } from "@/types/ui";
import { http } from "@/utils/http";
import { message, Modal } from "ant-design-vue";
import { createVNode, defineComponent, ref, Ref } from "vue";
import { ExclamationCircleFilled } from '@ant-design/icons-vue';
export default defineComponent({
    name: "associatedProject",
    emits: ["associatedSucc"],
    setup(props, context) {
        const projectList: Ref<Array<ProjectTagType>> = ref([]);
        const projectTags: Ref<Array<ProjectTagType>> = ref([]);
        const projectTagsTemp: Ref<Array<ProjectTagType>> = ref([]);
        const associatedVisible: Ref<boolean> = ref(false);
        const suid: Ref<string | number> = ref('');
        const appname: Ref<string> = ref('');
        const getProjectList = async (id: string | number): Promise<void> => {
            suid.value = id;
            projectTags.value = []
            projectTagsTemp.value = []
            const detail:any = await http.post(`/api/app/detail/${id}`, {});
            console.log(detail);
            appname.value = detail.data.app_name;
            const list:any = await http.post("/api/platform/list", {});
            for (const pro of list.data.list) {
              pro.checked = false
              for (const platform of detail.data.platform) {
                if(pro.id === platform.platform_id) {
                  pro.checked = true
                  projectTags.value.push(pro);
                  projectTagsTemp.value.push(pro);
                } 
              }
            }
            projectList.value = list.data.list
        };
        const associatedHandleOk = (): void => {
          const ids: any = [];
          for (const pro of projectTags.value) {
            ids.push(pro.id)
          }
          let strTemp = ''
          for (const some of projectTagsTemp.value) {
            if(!ids.includes(some.id)) {
              strTemp += `【${some.platform_name}】`
            }
          }
          if (strTemp.length) {
            Modal.confirm({
              title: `取消对项目${strTemp}的关联，会对这些项目产生以下影响，确定取消关联？`,
              icon: createVNode(ExclamationCircleFilled),
              content: [
                createVNode('div', { }, '* 含有本项目的模块将变为无效状态无法使用'),
                createVNode('div', { }, '* 含有本项目的模板将变为无效状态无法使用'),
                createVNode('div', { }, '* 发送消息时将无法选择该应用')
              ],
              onOk:() => {
                associatedReq(ids.toString());
              },
              onCancel() {
                console.log('Cancel');
              },
            });
          }else{
             associatedReq(ids.toString());
          }
        };
        const associatedReq = (ids: string) => {
           http.post("/api/app/platform", {id: suid.value, platform_ids: ids}).then((res: any) => {
              console.log(res);
              if(res.errCode === 0) {
                message.success('关联项目成功');
                context.emit('associatedSucc', true)
                associatedVisible.value = false;
              }
           })
        };
        const associatedShow = (id: string | number): void => {
            getProjectList(id)
            associatedVisible.value = true;
        };
        const projectTagClose = (id: number | string) => {
            projectTags.value = projectTags.value.filter(
                (item) => item.id !== id
            );
            projectList.value.map(item => {
              if(item.id === id) {
                item.checked = false
              }
            })
        };
        const projectChange = (
            e: CheckboxEvent,
            item: ProjectTagType
        ): void => {
            console.log(e);
            if (e.target?.checked) {
                projectTags.value.push(item);
            } else {
                projectTagClose(item.id);
            }
        };
        return {
            associatedHandleOk,
            associatedShow,
            projectChange,
            projectTagClose,
            projectList,
            projectTags,
            associatedVisible,
            appname,
        };
    },
});
</script>

<style lang="less" scoped>
.assbox{
  .name{
    font-size: 14px;
    font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
    font-weight: 400;
    color: rgba(2,14,26,0.45);
    .c{
      color: rgba(2,14,26,0.65);
    } 
  }
  .prolist{
    margin-top: 16px;
    display: flex;
    .app{
      width: 316px;
      background: #ffffff;
      border: 1px solid rgba(2,14,26,0.15);
      border-radius: 4px;
      .title{
        width: 100%;
        height: 40px;
        background: #f5f8ff;
        border-radius: 4px 4px 0px 0px;
        font-size: 14px;
        font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
        font-weight: 700;
        text-align: left;
        color: rgba(2,14,26,0.85);
        line-height: 40px;
        text-indent: 12px;
      }
      .content{
        width: 100%;
        height: 192px;
        overflow-y: auto;
        .list{
          width: 100%;
          height: 32px;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0 12px;
        }
        .list:hover{
          background: #e6f7ff;
        }
        .tags{
          width: 100%;
          padding: 16px 0;
          display: flex;
          flex-wrap: wrap;
          .tag{
            height: 22px;
            background: rgba(24,144,255,0.10);
            border-radius: 11px;
            padding: 0 8px;
            font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
            font-weight: 400;
            text-align: left;
            color: #1890ff;
            margin-bottom: 12px;
            margin-left: 12px;
            display: flex;
            cursor: pointer;
            .item{
              max-width: 280px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              margin-right: 5px;
            }
            .iconpopup_icon_close{
              font-size: 7px;
            }
          }
        }
      }
      
    }
  }
}
/deep/ .ant-checkbox-wrapper span + span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 270px;
}
/deep/ .associatedSty .ant-modal-title {
  font-weight: 700;
}
</style>