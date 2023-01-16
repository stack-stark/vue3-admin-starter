<script lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { defineComponent } from 'vue';
dayjs.locale('zh-cn');

export default defineComponent({
    setup() {
      return {
       locale: zhCN,
      }
    }
});
</script>

<template>
<a-config-provider :locale="locale">
     <router-view></router-view>
  </a-config-provider>
</template>

<style>
@import url('//at.alicdn.com/t/c/font_2233276_lkofqamdsk.css');

</style>
