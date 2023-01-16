<template>
    <div class="work-header workHeader">
        <div class="logo">
            <img alt src="@/assets/images/logo@2x.png" />
        </div>
        <div class="title">统一消息平台</div>
        <div class="operation">
            <!-- <div class="msg">
                <bell-outlined />
            </div> -->
            <div class="info">
                <!-- <div class="av">
                    <img :src="userData.member_avatar" alt />
                </div> -->
                <div class="name">{{userData.member_name}}</div>
            </div>
            <!-- <div @click="logout" class="msg">
                <i class="iconfont iconicon_clos"></i>
            </div> -->
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { BellOutlined, CloseCircleOutlined } from "@ant-design/icons-vue";
import { useUserStore } from "@/store/user";
import { useConfirm } from "@/hooks/useConfirm";
import { useRouter } from "vue-router";
export default defineComponent({
    name: "WorkHeader",
    components: {
        BellOutlined,
        CloseCircleOutlined,
    },
    setup() {
        const userStore = useUserStore();
        const userData = computed(() => userStore.userData);
        const router = useRouter();
        const outRun = () => {
          userStore.clearToken();
          router.replace({ path: '/login' })
        }
        const logout = () => {
            useConfirm(
                `温馨提示`,
                "是否退出登录？",
                () => {
                   outRun() 
                },
                () => {
                    console.log("clc");
                }
            );
        };
        return {
            userData,
            logout,
        };
    },
});
</script>

<style lang="less" scoped>
.workHeader{
    width: 100vw;
    height: 48px;
    background: #ffffff;
    border-radius: 1px;
    box-shadow: 0px 3px 6px 0px rgba(0, 85, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    margin-bottom: 6px;
}
.work-header {
    width: 100vw;
    height: 48px;
    background: #ffffff;
    border-radius: 1px;
    box-shadow: 0px 3px 6px 0px rgba(0, 85, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 32px;
    margin-bottom: 6px;
    .logo {
        width: 113px;
        height: 48px;
        img {
            width: 100%;
            height: 100%;
        }
    }
    .title {
        font-size: 16px;
        font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
        font-weight: 700;
        text-align: left;
        color: rgba(2, 14, 26, 0.85);
    }
    .operation {
        display: flex;
        align-items: center;
        cursor: pointer;
        .msg {
        }
        .info {
            display: flex;
            align-items: center;
            margin-left: 13px;
            .av {
                width: 24px;
                height: 24px;
                border-radius: 4px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;
                }
            }
            .name {
                height: 22px;
                font-size: 14px;
                font-family: MicrosoftYaHei, MicrosoftYaHei-Regular;
                font-weight: 400;
                text-align: left;
                color: rgba(2, 14, 26, 0.65);
                margin: 0 8px;
                padding-right: 8px;
                // border-right: 1px solid #e1e1e1;
                display: flex;
            }
        }
        .out {
            font-size: 12px;
        }
    }
}
</style>
