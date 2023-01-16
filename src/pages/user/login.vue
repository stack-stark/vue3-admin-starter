<template>
    <div class="common-layout">
      <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/images/logo@2x.png" />
        <span class="title">vue3 admin start</span>
      </div>
      <div class="desc">🥂共饮这杯庆功酒🥂</div>
    </div>
    <div class="login">
      <a-form @onFinish="onFinish" @finishFailed="handleFinishFailed" name="login" :model="formLogin">
        <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
          <a-tab-pane tab="账户密码登录" key="1">
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="admin"
                v-model:value="formLogin.username"
              >
               <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="888888"
                autocomplete="autocomplete"
                v-model:value="formLogin.username"
                type="password"
              >
              <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
              </a-input>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane tab="手机号登录" key="2">
            <a-form-item>
              <a-input size="large" v-model:value="formLogin.phone" placeholder="mobile number" >
                <a-icon slot="prefix" type="mobile" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-row :gutter="8" style="margin: 0 -4px">
                <a-col :span="16">
                  <a-input size="large" v-model:value="formLogin.verificationCode" placeholder="captcha">
                    <a-icon slot="prefix" type="mail" />
                  </a-input>
                </a-col>
                <a-col :span="8" style="padding-left: 4px">
                  <a-button style="width: 100%" class="captcha-button" size="large">获取验证码</a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <a-form-item>
          <a-checkbox v-model:checked="formLogin.remember">自动登录</a-checkbox>
          <a style="float: right">忘记密码</a>
        </a-form-item>
        <a-form-item>
          <a-button  style="width: 100%;margin-top: 24px" size="large"  html-type="submit" type="primary" >登录</a-button>
        </a-form-item>
        <!-- <div>
          其他登录方式
          <a-icon class="icon" type="alipay-circle" />
          <a-icon class="icon" type="taobao-circle" />
          <a-icon class="icon" type="weibo-circle" />
          <router-link style="float: right" to="/dashboard/workplace" >注册账户</router-link>
        </div> -->
      </a-form>
    </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { useUserStore } from "@/store/user";
import { FormLoginType } from "@/types/login";
import { useRoute, useRouter } from 'vue-router';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

export default defineComponent({
  name: 'Login',
  components: {
    UserOutlined,
    LockOutlined,
  },
  setup() {
    const userStore = useUserStore();
    const router = useRouter();
    const route = useRoute();
    const setToken = (token: string):void => {
      userStore.setToken(token)
    }
    const formLogin = reactive<FormLoginType>({
      username: '',
      password: '',
      remember: true,
      phone: '',
      verificationCode: ''
    });
    const setUserinfo = (userName: string) => {
      const data = {
        member_avatar: 'https://himg.bdimg.com/sys/portraitn/item/public.1.3c7eff7c.6E5Fm_UtXzobtOukz3FrVw',
        member_id: 2683,
        member_name: userName,
        member_phone: "13145207708",
        member_true_name: userName,
        mobile_zone: "86",
      }
       userStore.setUserinfo(data)
    };
    if(route.query.token) {
        setToken('Bearer ' + route.query.token as string)
        setUserinfo(route.query.userName as string)
        router.push({ path: '/workbench/project-management' })
    }
    const mockLogin = () => {
      setToken('Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTI3LjAuMC4xOjk3MDIvTWVzc2FnZVBsYXRmb3JtLkF1dGgvZ2V0VG9rZW4iLCJpYXQiOjE2NjE4MzIwNDksImV4cCI6MTY2MTgzOTI1MCwibmJmIjoxNjYxODMyMDUwLCJqdGkiOiJ4YkRLc1F5STlCVE5pZkdBIiwic3ViIjoiMTY4NiIsInBydiI6ImEwMWVhYjI0MWNlMTc3ZDU5YTFmNjYwZjY5NDc4MzU1NTA5N2QxZWMiLCJzcGFjZV9pZCI6MX0.7g_04lVnW0myTlj5x46xVFBopVY-xWgM7j5529Vet4Q');
      setUserinfo('管理员来的');
      router.push({ path: '/workbench/project-management' });
    };
    const onFinish = (values: any) => {
      console.log('Success:', values);
      mockLogin()
    };
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
      mockLogin()
    };
    return {
      mockLogin,
      formLogin,
      onFinish,
      onFinishFailed,
    }
  },
})
</script>


<style lang="less" scoped>
.common-layout{
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  // background-color: @layout-body-background;
  background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: 110px;
  background-size: 100%;
  .content{
    padding: 32px 0;
    flex: 1;
    @media (min-width: 768px){
      padding: 112px 0 24px;
    }
  }
}
  .common-layout{
    .top {
      text-align: center;
      .header {
        height: 44px;
        line-height: 44px;
        a {
          text-decoration: none;
        }
        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
          margin-top: 2px;
        }
        .title {
          font-size: 24px;
          // color: @title-color;
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 16px;
        // color: @text-color-second;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
    .login{
      width: 368px;
      margin: 0 auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
        .captcha-button{
          font-size: 14px;
        }
      }
      .icon {
        font-size: 24px;
        // color: @text-color-second;
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          // color: @primary-color;
        }
      }
    }
  }
</style>